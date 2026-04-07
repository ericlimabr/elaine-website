import { getSystemConfig } from "@/utils/getDbData"
import { getActiveFaqs } from "@/app/actions/faq"
import ContatoPageComponent from "@/components/pages/ContatoPageComponent"

export default async function Contato() {
  const [settings, faqs] = await Promise.all([
    getSystemConfig([
      "socialInstagram",
      "socialYoutube",
      "socialLinkedin",
      "socialX",
      "socialFacebook",
      "socialWhatsApp",
    ]),
    getActiveFaqs(),
  ])

  return <ContatoPageComponent settings={settings} faqs={faqs} />
}
