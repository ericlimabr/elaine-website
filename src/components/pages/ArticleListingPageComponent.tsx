"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  ExternalLink,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/primitives/button"
import { Input } from "@/components/ui/primitives/input"
import { Badge } from "@/components/ui/primitives/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/primitives/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/primitives/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/primitives/alert-dialog"
import {
  articleTypeLabels,
  articleStatusLabels,
  PostsForListing,
  ArticleType,
  ArticleStatus,
} from "@/types/article"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ArticleListingPageComponentProps {
  articles: PostsForListing[]
}

export default function ArticleListingPageComponent({
  articles,
}: ArticleListingPageComponentProps) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"todos" | ArticleType>("todos")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] =
    useState<PostsForListing | null>(null)

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesType = activeTab === "todos" || article.type === activeTab
      return matchesSearch && matchesType
    })
  }, [searchQuery, activeTab])

  const handleDelete = (article: PostsForListing) => {
    setArticleToDelete(article)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Mock delete - would integrate with database
    console.log("Deleting article:", articleToDelete?.id)
    setDeleteDialogOpen(false)
    setArticleToDelete(null)
  }

  const getTypeBadgeVariant = (type: ArticleType) => {
    switch (type) {
      case "ARTICLE":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "VIDEO":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "STUDY":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return ""
    }
  }

  const getStatusBadgeVariant = (status: ArticleStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "DRAFT":
        return "bg-slate-100 text-slate-600 border-slate-200"
      default:
        return ""
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Gestão de Artigos
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todos os seus conteúdos em um só lugar
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/artigos/novo")}
            className="gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Novo Artigo
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs Filter */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "todos" | ArticleType)}
          >
            <TabsList>
              <TabsTrigger value="todos" className="cursor-pointer">
                Todos
              </TabsTrigger>
              <TabsTrigger value="ARTICLE" className="cursor-pointer">
                Artigos
              </TabsTrigger>
              <TabsTrigger
                value="VIDEO"
                className="cursor-not-allowed"
                disabled
              >
                Sermões
              </TabsTrigger>
              <TabsTrigger
                value="STUDY"
                className="cursor-not-allowed"
                disabled
              >
                Estudos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Título</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Data</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum artigo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow
                    key={article.id}
                    className="group cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        href={`/admin/artigos/${article.id}/editar`}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {article.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1 md:hidden">
                        {articleTypeLabels[article.type]}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={getTypeBadgeVariant(article.type)}
                      >
                        {articleTypeLabels[article.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeVariant(article.status)}
                      >
                        {articleStatusLabels[article.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {format(
                        article.publishedAt || article.updatedAt,
                        "dd MMM yyyy",
                        {
                          locale: ptBR,
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/artigos/${article.id}/editar`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver no Site
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(article)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando {filteredArticles.length} de {articles.length} itens
          </span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{articleToDelete?.title}"? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
