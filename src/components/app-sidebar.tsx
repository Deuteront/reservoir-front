import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useLocation } from '@tanstack/react-router';
import ThemeSwitcher from '@/components/theme-switcher.tsx';

export function AppSidebar() {
  const location = useLocation();

  const isItemActive = (url: string) => {
    const currentPath = location.pathname;
    if (url === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader title="Main Menu"></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={`flex items-center gap-2 w-full ${isItemActive(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                >
                  <span className="sidebar-label transition-all duration-200">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={'w-full'}>
        <ThemeSwitcher className={'w-full'} />
      </SidebarFooter>
    </Sidebar>
  );
}

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    title: 'Projects',
    url: '/projects',
  },
  {
    title: 'Wells',
    url: '/wells',
  },
  {
    title: 'Reservoir',
    url: '/reservoirs',
  },
];
