import AdminHeader from "@/components/layout/admin/AdminHeader"
import AdminLayoutProvider from "@/components/layout/admin/AdminLayoutProvider"
import { getUser } from "@/utils/getUser"
import NotFound from "../not-found"
import ServersideAdminSidebar from "@/components/layout/admin/ServersideAdminSidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const userData = await getUser()

  if (!userData) {
    return <NotFound />
  }

  return (
    <AdminLayoutProvider>
      <div className="admin-theme min-h-screen bg-background">
        {/* Sidebar */}
        <ServersideAdminSidebar />

        {/* Main Content Area */}
        <div className="pl-64">
          {/* Header */}
          <AdminHeader />

          {/* Page Content - Light Background */}
          <main className="min-h-[calc(100vh-4rem)] bg-background p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  )
}
