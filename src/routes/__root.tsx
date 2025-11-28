import { Outlet, createRootRoute } from '@tanstack/react-router';
import { AppSidebar } from '@/components/app-sidebar.tsx';
import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="min-h-screen w-full">
          <Outlet />
        </div>
      </SidebarProvider>
      <Toaster richColors position="top-right" />
    </>
  ),
});
