import { prisma } from "@/lib/prisma"
import TagsPageComponent from "@/components/pages/TagsPageComponent"

export default async function Page() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true }, // This populates the tag._count.posts field that we use in the table.
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <main className="container mx-auto py-6">
      <TagsPageComponent initialTags={tags} />
    </main>
  )
}
