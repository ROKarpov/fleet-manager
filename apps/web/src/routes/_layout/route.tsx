import { AppSidebar } from '#/routes/_layout/-components/app-sidebar'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppHeader } from '#/routes/_layout/-components/app-header'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <SidebarProvider
        style={
          {
            '--sidebar-width': '19rem',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
