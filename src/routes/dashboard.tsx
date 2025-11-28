import { createFileRoute } from '@tanstack/react-router';
import { useQueries } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projectsApi, reservoirsApi, wellsApi } from '@/api/endpoints';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useState, useMemo } from 'react';
import Wells3DScene from '@/components/wells-3d-scene.tsx';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const results = useQueries({
    queries: [
      { queryKey: ['projects'], queryFn: projectsApi.getAll },
      { queryKey: ['reservoirs'], queryFn: reservoirsApi.getAll },
      { queryKey: ['wells'], queryFn: wellsApi.getAll },
    ],
  });

  const [projectsQuery, reservoirsQuery, wellsQuery] = results;
  const isLoading = results.some((q) => q.isLoading);

  const filteredReservoirs = useMemo(() => {
    if (selectedProject === 'all') return reservoirsQuery?.data ?? [];
    return reservoirsQuery?.data?.filter((r) => r.project_id === selectedProject) ?? [];
  }, [selectedProject, reservoirsQuery.data]);

  const filteredWells = useMemo(() => {
    if (selectedProject === 'all') return wellsQuery?.data ?? [];
    return wellsQuery?.data?.filter((w) => w.project_id === selectedProject) ?? [];
  }, [selectedProject, wellsQuery.data]);

  const wellsByReservoir = filteredReservoirs.map((res) => ({
    name: `${res.name_reservoir}`,
    wells: filteredWells.filter((w) => w.reservoir_details_id === res.id).length,
  }));

  const wellsByProject = useMemo(() => {
    return (
      projectsQuery?.data?.map((p) => ({
        name: p.name_project,
        wells: wellsQuery?.data?.filter((w) => w.project_id === p.project_id).length ?? 0,
      })) ?? []
    );
  }, [projectsQuery.data, wellsQuery.data]);

  const COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ];

  return (
    <div className="p-3 md:p-6 space-y-4 max-h-screen overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>

        <Select onValueChange={setSelectedProject} defaultValue="all">
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projectsQuery?.data?.map((p) => (
              <SelectItem key={p.project_id} value={p.project_id}>
                {p.name_project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <StatCard title="Projects" value={projectsQuery.data?.length!} loading={isLoading} />
        <StatCard title="Reservoirs" value={filteredReservoirs.length} loading={isLoading} />
        <StatCard title="Wells" value={filteredWells.length} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <Card className="p-2 md:p-4">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Wells per Reservoir</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={wellsByReservoir}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <Tooltip
                  content={(props) => {
                    if (props.active && props.payload && props.payload.length) {
                      const data = props.payload[0].payload;
                      return (
                        <div className="p-2 border rounded bg-secondary text-xs">
                          <div>
                            <strong>{data.name}</strong>
                          </div>
                          <div>Wells: {data.wells}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="wells"
                  fill={`var(--color-chart-1)`}
                  radius={[4, 4, 0, 0]}
                  stroke={`var(--color-chart-1)`}
                  fillOpacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-2 md:p-4">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Wells per Project</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={wellsByProject}
                  dataKey="wells"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  fill="var(--color-chart-1)"
                  strokeOpacity={0.1}
                >
                  {wellsByProject.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} fillOpacity={0.7} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => {
                    if (props.active && props.payload && props.payload.length) {
                      const data = props.payload[0].payload;
                      return (
                        <div className="p-2 border rounded bg-secondary text-xs">
                          <div>
                            <strong>{data.name}</strong>
                          </div>
                          <div>Wells: {data.wells}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="p-2 md:p-4">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">3D Wells Visualization</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="h-[300px] md:h-[400px] border rounded-lg overflow-hidden">
            <Wells3DScene wells={filteredWells} showLegend />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, loading }: { title: string; value: number; loading: boolean }) {
  return (
    <Card className="p-2">
      <CardHeader className="p-2 md:p-4">
        <CardTitle className="text-xs md:text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-4 pt-0">
        {loading ? (
          <Skeleton className="w-12 h-6 md:w-16 md:h-8" />
        ) : (
          <div className="text-xl md:text-3xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
