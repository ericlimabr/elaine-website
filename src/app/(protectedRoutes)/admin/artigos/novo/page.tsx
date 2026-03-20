import ArticleEditorPageComponent from "@/components/pages/ArticleEditorPageComponent"
import { getAllTags } from "@/utils/getDbData"
import { getUser } from "@/utils/getUser"

export default async function ArticleCreatorPage() {
  // Fetch available tags from the database to power the unified taxonomy
  const tags = await getAllTags()

  const userData = await getUser()

  return <ArticleEditorPageComponent availableTags={tags} userData={userData} />
}
