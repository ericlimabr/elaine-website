import AdminNotFound from "@/components/features/admin/AdminNotFound"
import ArticleEditorPageComponent from "@/components/pages/ArticleEditorPageComponent"
import { Button } from "@/components/ui/Button"
import { getAllTags, getPostById } from "@/utils/getDbData"
import { getUser } from "@/utils/getUser"

export default async function ArticleEditorPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    return (
      <AdminNotFound>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/admin/artigos/novo">Escrever novo Artigo</Button>
          <Button href="/admin" variant="outline">
            Voltar ao Painel
          </Button>
        </div>
      </AdminNotFound>
    )
  }

  const tags = await getAllTags()

  const userData = await getUser()

  return (
    <ArticleEditorPageComponent
      id={id}
      availableTags={tags}
      initialData={post}
      userData={userData}
    />
  )
}
