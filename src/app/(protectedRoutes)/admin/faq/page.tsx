import { getFaqs } from "@/app/actions/faq"
import FaqAdminPageComponent from "@/components/pages/FaqAdminPageComponent"

export default async function FaqAdminPage() {
  const faqs = await getFaqs()
  return (
    <main className="container mx-auto py-6">
      <FaqAdminPageComponent initialFaqs={faqs} />
    </main>
  )
}
