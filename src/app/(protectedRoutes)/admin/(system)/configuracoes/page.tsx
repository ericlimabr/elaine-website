import SettingsPageComponent from "@/components/pages/SettingsPageComponent"
import { getSystemConfig } from "@/utils/getDbData"

export default async function SettingsPage() {
  const config = await getSystemConfig()

  return <SettingsPageComponent initialSettings={config} />
}
