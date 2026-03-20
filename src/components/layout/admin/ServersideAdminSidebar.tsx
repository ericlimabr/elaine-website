import { countUnreadMessages } from "@/app/actions/contact"
import AdminSidebar from "./AdminSidebar"

export default async function ServersideAdminSidebar() {
  const totalUnreadMessages = await countUnreadMessages()

  return <AdminSidebar countUnreadMessages={totalUnreadMessages} />
}
