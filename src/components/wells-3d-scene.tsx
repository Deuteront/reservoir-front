import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

type Well = {
  id: number;
  name: string;
  project_id: string;
  reservoir_details_id: number;
  entry_point_x: number;
  entry_point_y: number;
  entry_point_z: number;
  target_x: number;
  target_y: number;
  target_z: number;
  type_tubings_id?: number;
  type_functions_id?: number;
};

type Props = {
  wells: Well[];
  width?: number | string;
  height?: number | string;
  showLegend?: boolean;
};

const COLORS = [
  '#2563eb',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#0ea5e9',
];

function colorForWell(w: Well) {
  const key = w.type_tubings_id ?? w.type_functions_id ?? Math.abs(hashCode(w.project_id)) % 10;
  return COLORS[key % COLORS.length];
}

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export default function Wells3DScene({
  wells,
  width = '100%',
  height = 500,
  showLegend = false,
}: Props) {
  const bounds = useMemo(() => {
    if (!wells.length) return null;
    const xs = wells.flatMap((w) => [w.entry_point_x, w.target_x]);
    const ys = wells.flatMap((w) => [w.entry_point_y, w.target_y]);
    const zs = wells.flatMap((w) => [w.entry_point_z, w.target_z]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      minZ: Math.min(...zs),
      maxZ: Math.max(...zs),
    };
  }, [wells]);

  const center = useMemo(() => {
    if (!bounds) return [0, 0, 0];
    return [
      (bounds.minX + bounds.maxX) / 2,
      (bounds.minY + bounds.maxY) / 2,
      (bounds.minZ + bounds.maxZ) / 2,
    ];
  }, [bounds]);

  const scale = useMemo(() => {
    if (!bounds) return 1;
    const sizeX = bounds.maxX - bounds.minX;
    const sizeY = bounds.maxY - bounds.minY;
    const sizeZ = bounds.maxZ - bounds.minZ;
    const maxDim = Math.max(sizeX, sizeY, sizeZ);
    return maxDim / 200;
  }, [bounds]);

  const normalize = (x: number, y: number, z: number) =>
    [(x - center[0]) / scale, (y - center[1]) / scale, (z - center[2]) / scale] as [
      number,
      number,
      number,
    ];

  function WellLine({ well }: { well: Well }) {
    const start = normalize(well.entry_point_x, well.entry_point_y, well.entry_point_z);
    const end = normalize(well.target_x, well.target_y, well.target_z);
    const color = colorForWell(well);

    const lineObj = useMemo(() => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array([...start, ...end]), 3),
      );
      const mat = new THREE.LineBasicMaterial({ color });
      return new THREE.Line(geom, mat);
    }, [well]);

    return <primitive object={lineObj} />;
  }

  function WellPoint({ well }: { well: Well }) {
    const pos = normalize(well.entry_point_x, well.entry_point_y, well.entry_point_z);
    const color = colorForWell(well);

    return (
      <group position={pos}>
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <Html distanceFactor={12} position={[0, 2, 0]}>
          <div className="bg-white px-2 py-1 rounded shadow text-xs">{well.name}</div>
        </Html>
      </group>
    );
  }

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas camera={{ position: [0, 40, 100], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 50, 50]} intensity={0.8} />
        <Stars radius={80} depth={40} count={1500} factor={4} />

        {wells.map((w) => (
          <group key={w.id}>
            <WellLine well={w} />
            <WellPoint well={w} />
          </group>
        ))}

        <OrbitControls makeDefault enableZoom enablePan enableRotate />
      </Canvas>

      {showLegend && wells.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-background/90 border rounded-lg p-2 text-xs max-h-32 overflow-y-auto shadow-lg">
          <div className="font-semibold mb-2">Legend</div>
          <div className="space-y-1">
            {Array.from(new Set(wells.map(w => colorForWell(w)))).map((color, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px]">
                  {wells.find(w => colorForWell(w) === color)?.name || 'Well'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
