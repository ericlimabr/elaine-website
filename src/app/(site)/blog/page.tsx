import { getAllArticlesForPublicListingWithTags, getAllTags } from "@/utils/getDbData"
import BlogPageComponent from "@/components/pages/BlogPageComponent"

export default async function Blog() {
  const [posts, tags] = await Promise.all([
    getAllArticlesForPublicListingWithTags({ limit: 100 }),
    getAllTags(),
  ])

  return <BlogPageComponent posts={posts} tags={tags} />
}
