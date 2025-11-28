import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme-provider.tsx';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select.tsx';

type Theme = 'dark' | 'light' | 'system';

export function ThemeSwitcher({
  className,
  ariaLabel = 'Selecionar tema',
  compact = false,
}: {
  className?: string;
  ariaLabel?: string;
  compact?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  const themeLabelMap: Record<Theme, string> = {
    light: 'Claro',
    dark: 'Escuro',
    system: 'Sistema',
  };

  const iconFor = (t: Theme) => {
    switch (t) {
      case 'dark':
        return <Moon className="size-4" />;
      case 'light':
        return <Sun className="size-4" />;
      default:
        return <Monitor className="size-4" />;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Select value={theme} onValueChange={(val) => setTheme(val as Theme)}>
        <SelectTrigger
          aria-label={ariaLabel}
          size={compact ? 'sm' : 'default'}
          className={compact ? 'px-2' : 'w-full flex flex-1'}
          title={`Tema atual: ${themeLabelMap[theme]}`}
        >
          <SelectValue>
            <span className="flex items-center gap-2">
              {iconFor(theme)}
              {themeLabelMap[theme]}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className={' w-full'}>
          <SelectItem value="light">
            <Sun className="size-4" /> Claro
          </SelectItem>
          <SelectItem value="dark">
            <Moon className="size-4" /> Escuro
          </SelectItem>
          <SelectItem value="system">
            <Monitor className="size-4" /> Sistema
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default ThemeSwitcher;
