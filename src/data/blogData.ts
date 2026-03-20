export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  featured?: boolean
}

export const categories = [
  { name: "Todos", emoji: "✨" },
  { name: "Maturescência", emoji: "🌸" },
  { name: "Autoconhecimento", emoji: "🧘‍♀️" },
  { name: "Sagrado Feminino", emoji: "💜" },
  { name: "Psicologia", emoji: "📚" },
  { name: "Espiritualidade", emoji: "🌙" },
]

export const blogPosts: BlogPost[] = [
  {
    slug: "o-poder-da-maturescencia",
    title: "O Poder da Maturescência: Redescobrindo-se Após os 40",
    excerpt:
      "A maturescência é uma fase de profunda transformação. Descubra como abraçar esse momento de renascimento e encontrar sua verdadeira essência.",
    content: `A maturescência é um termo cunhado para descrever o período de transição que ocorre na vida adulta, geralmente a partir dos 40 anos. Assim como a adolescência marca a passagem da infância para a vida adulta, a maturescência marca uma nova fase de redescoberta e transformação.\n\n## Uma Nova Perspectiva\n\nNessa fase, muitas mulheres experimentam uma profunda reavaliação de seus valores, relacionamentos e propósito de vida. É um momento de questionamento saudável que pode levar a descobertas incríveis sobre si mesma.\n\n## O Corpo em Transformação\n\nAs mudanças hormonais trazem consigo não apenas desafios físicos, mas também uma oportunidade de reconexão com o corpo. O climatério e a menopausa são portais de transformação, não sentenças.\n\n## Abraçando a Mudança\n\nA chave está em abraçar essa transformação com curiosidade e compaixão. A terapia pode ser uma aliada poderosa nesse processo, oferecendo ferramentas para navegar as emoções complexas que surgem.\n\n> "Envelhecer não é perder a juventude, mas uma nova fase de oportunidade e força." — Betty Friedan\n\n## Práticas Recomendadas\n\n1. **Journaling**: Escreva sobre suas emoções e descobertas\n2. **Meditação**: Conecte-se com seu interior\n3. **Movimento corporal**: Yoga, dança, caminhadas\n4. **Círculos de mulheres**: Compartilhe experiências\n5. **Terapia**: Busque acompanhamento profissional`,
    category: "Maturescência",
    date: "2026-02-10",
    readTime: "6 min",
    featured: true,
  },
  {
    slug: "sagrado-feminino-e-psicologia",
    title:
      "Sagrado Feminino e Psicologia: Pontes Entre Ciência e Espiritualidade",
    excerpt:
      "Explorando como a psicologia contemporânea dialoga com as tradições do sagrado feminino para uma abordagem terapêutica mais integrativa.",
    content: `O encontro entre psicologia e sagrado feminino não é uma contradição — é uma complementaridade rica que pode transformar a prática terapêutica.\n\n## Jung e o Feminino\n\nCarl Jung foi um dos primeiros psicólogos a reconhecer a importância dos arquétipos femininos na psique humana. Conceitos como Anima, Grande Mãe e a integração dos opostos oferecem bases sólidas.\n\n## Rituais como Ferramentas Terapêuticas\n\nRituais de passagem, círculos de mulheres e práticas contemplativas podem ser integrados ao processo terapêutico de forma ética e embasada.\n\n## A Ciência por Trás\n\nEstudos em neurociência mostram que práticas meditativas e rituais comunitários ativam redes neurais associadas ao bem-estar e à regulação emocional.`,
    category: "Sagrado Feminino",
    date: "2026-02-05",
    readTime: "5 min",
  },
  {
    slug: "autoconhecimento-mulher-madura",
    title: "Autoconhecimento na Maturidade: Um Mergulho Interior",
    excerpt:
      "O processo de autoconhecimento ganha novas dimensões quando combinamos a sabedoria acumulada com práticas terapêuticas contemporâneas.",
    content: `O autoconhecimento na maturidade tem uma qualidade diferente. Há décadas de experiência, de relações, de erros e acertos que formam uma base rica para a autodescoberta.\n\n## Além do Autoajuda\n\nAutoconhecimento verdadeiro vai além de frases motivacionais. Envolve enfrentar sombras, questionar crenças limitantes e reconstruir a narrativa de vida.\n\n## Ferramentas Práticas\n\nA psicoterapia, combinada com práticas como mindfulness, escrita terapêutica e arte-terapia, oferece caminhos concretos para essa jornada interior.`,
    category: "Autoconhecimento",
    date: "2026-01-28",
    readTime: "4 min",
  },
  {
    slug: "ansiedade-climatério",
    title: "Ansiedade no Climatério: Compreendendo e Acolhendo",
    excerpt:
      "A ansiedade durante o climatério tem bases hormonais e emocionais. Entender suas origens é o primeiro passo para encontrar alívio.",
    content: `A ansiedade é uma das queixas mais comuns durante o climatério e a menopausa. Compreender suas raízes é fundamental para um manejo adequado.\n\n## Bases Hormonais\n\nA queda nos níveis de estrogênio afeta diretamente os neurotransmissores responsáveis pela regulação do humor e da ansiedade.\n\n## Abordagem Integrativa\n\nUma abordagem que combine acompanhamento médico, psicoterapia e práticas de autocuidado oferece os melhores resultados.`,
    category: "Psicologia",
    date: "2026-01-20",
    readTime: "5 min",
  },
  {
    slug: "rituais-femininos-modernos",
    title: "Rituais Femininos para a Mulher Moderna",
    excerpt:
      "Como adaptar práticas ancestrais do feminino sagrado para o dia a dia contemporâneo, criando momentos de conexão e cura.",
    content: `Rituais não precisam ser complexos ou demorados. Pequenas práticas diárias podem reconectar você com sua essência feminina.\n\n## Ritual do Amanhecer\n\nReserve 5 minutos pela manhã para uma intenção consciente. Acenda uma vela, respire profundamente e declare sua intenção para o dia.\n\n## Círculo Lunar\n\nAcompanhe as fases da lua e use-as como guia para suas atividades: lua nova para plantar sementes, lua cheia para celebrar.`,
    category: "Espiritualidade",
    date: "2026-01-15",
    readTime: "4 min",
    featured: true,
  },
  {
    slug: "relacoes-na-maturidade",
    title: "Reconfigurando Relações na Maturidade",
    excerpt:
      "Os relacionamentos passam por profundas transformações na maturescência. Aprenda a navegar essas mudanças com sabedoria.",
    content: `Na maturescência, os relacionamentos passam por uma profunda reconfiguração. Filhos crescem, casamentos se transformam, amizades se redefinem.\n\n## O Ninho Vazio\n\nQuando os filhos saem de casa, muitas mulheres enfrentam uma crise de identidade. Quem sou eu além de mãe?\n\n## Redescoberta do Casal\n\nO relacionamento conjugal pode se renovar ou revelar incompatibilidades que estavam mascaradas pela rotina da criação dos filhos.`,
    category: "Autoconhecimento",
    date: "2026-01-10",
    readTime: "5 min",
  },
]
