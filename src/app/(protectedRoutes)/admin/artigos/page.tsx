import ArticleListingPageComponent from "@/components/pages/ArticleListingPageComponent"
import { PostsForListing } from "@/types/article"
import { getAllPostsForListing } from "@/utils/getDbData"

export default async function ArticlesPage() {
  const posts: PostsForListing[] = await getAllPostsForListing()

  return <ArticleListingPageComponent articles={posts} />
}
