import { useState, useEffect } from "react";
import { Link, useParams, useSearch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Newspaper,
  TrendingUp,
  Building2,
  Users,
  Calculator,
  FileText,
  ChevronRight,
  ChevronLeft,
  Clock,
  Eye,
  ExternalLink,
  ArrowLeft,
  Share2,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const categoryConfig = {
  fiscal: { label: "Fiscal", icon: FileText, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  contabil: { label: "Contábil", icon: Calculator, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  tributario: { label: "Tributário", icon: TrendingUp, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  trabalhista: { label: "Trabalhista", icon: Users, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  previdenciario: { label: "Previdenciário", icon: Building2, color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  economia: { label: "Economia", icon: TrendingUp, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  reforma_tributaria: { label: "Reforma Tributária", icon: Newspaper, color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Agora mesmo";
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function NewsCardSkeleton() {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

// Highlight search terms in text
function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={i} className="bg-amber-500/30 text-amber-200 px-0.5 rounded">{part}</mark>
      : part
  );
}

// News List Page
function NewsListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: allNews, isLoading: listLoading } = trpc.news.list.useQuery(
    { limit: 50 },
    { enabled: !debouncedQuery }
  );
  
  const { data: searchResults, isLoading: searchLoading } = trpc.news.search.useQuery(
    { query: debouncedQuery, limit: 50 },
    { enabled: !!debouncedQuery }
  );

  const isLoading = debouncedQuery ? searchLoading : listLoading;
  const newsToDisplay = debouncedQuery ? searchResults : allNews;

  const filteredNews = selectedCategory
    ? newsToDisplay?.filter((n) => n.category === selectedCategory)
    : newsToDisplay;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
        <div className="container">
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-medium text-sm uppercase tracking-wider">
                Central de Notícias
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Notícias Fiscais e Contábeis
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Acompanhe as últimas atualizações sobre legislação fiscal, tributária, trabalhista e contábil do Brasil
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="text"
                placeholder="Buscar notícias por palavras-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-6 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {debouncedQuery && (
              <p className="text-zinc-400 text-sm mt-2">
                {searchLoading ? (
                  "Buscando..."
                ) : (
                  <>
                    {filteredNews?.length || 0} resultado{(filteredNews?.length || 0) !== 1 ? "s" : ""} para "{debouncedQuery}"
                  </>
                )}
              </p>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 sticky top-20 bg-zinc-950/95 backdrop-blur-sm py-4 z-10">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-amber-600 hover:bg-amber-700" : "border-zinc-700"}
            >
              Todas
            </Button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={selectedCategory === key ? "bg-amber-600 hover:bg-amber-700" : "border-zinc-700"}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {config.label}
                </Button>
              );
            })}
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => <NewsCardSkeleton key={i} />)
            ) : filteredNews && filteredNews.length > 0 ? (
              filteredNews.map((news) => {
                const config = categoryConfig[news.category as keyof typeof categoryConfig];
                const Icon = config?.icon || Newspaper;
                
                return (
                  <Link key={news.id} href={`/noticias/${news.id}`}>
                    <Card className="bg-zinc-900/50 border-zinc-800 hover:border-amber-500/30 transition-all cursor-pointer group h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${config?.color || "bg-zinc-700"}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {config?.label || news.category}
                          </Badge>
                          {news.isFeatured && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                              Destaque
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 text-lg">
                          {debouncedQuery ? highlightText(news.title, debouncedQuery) : news.title}
                        </h4>
                      </CardHeader>
                      <CardContent>
                        {news.summary && (
                          <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                            {debouncedQuery ? highlightText(news.summary, debouncedQuery) : news.summary}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(news.publishedAt)}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {news.viewCount || 0}
                            </span>
                            <span className="text-amber-500">{news.source}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <Newspaper className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {debouncedQuery ? "Nenhum resultado encontrado" : "Nenhuma notícia encontrada"}
                </h3>
                <p className="text-zinc-500">
                  {debouncedQuery 
                    ? `Não encontramos notícias para "${debouncedQuery}". Tente outros termos.`
                    : "Não há notícias disponíveis nesta categoria no momento."
                  }
                </p>
                {debouncedQuery && (
                  <Button
                    variant="outline"
                    className="mt-4 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                    onClick={() => setSearchQuery("")}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

// Single News Page
function SingleNewsPage({ id }: { id: string }) {
  const { data: news, isLoading } = trpc.news.getById.useQuery({ id: parseInt(id) });
  const { data: relatedNews } = trpc.news.byCategory.useQuery(
    { category: news?.category as any, limit: 4 },
    { enabled: !!news?.category }
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title,
          text: news?.summary || "",
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
          <div className="container max-w-4xl">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
          <div className="container text-center py-20">
            <Newspaper className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Notícia não encontrada</h1>
            <p className="text-zinc-400 mb-6">A notícia que você procura não existe ou foi removida.</p>
            <Link href="/noticias">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para notícias
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const config = categoryConfig[news.category as keyof typeof categoryConfig];
  const Icon = config?.icon || Newspaper;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
        <article className="container max-w-4xl">
          {/* Back button */}
          <Link href="/noticias">
            <Button variant="ghost" className="mb-6 text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para notícias
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${config?.color || "bg-zinc-700"}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config?.label || news.category}
              </Badge>
              {news.isFeatured && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Destaque
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {news.title}
            </h1>

            {news.summary && (
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                {news.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 pb-6 border-b border-zinc-800">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeAgo(news.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {news.viewCount || 0} visualizações
              </span>
              <span className="text-amber-500">{news.source}</span>
              {news.author && <span>Por {news.author}</span>}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="ml-auto text-zinc-400 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            {news.content ? (
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            ) : (
              <p className="text-zinc-400 italic">
                Conteúdo completo não disponível. Acesse a fonte original para mais informações.
              </p>
            )}
          </div>

          {/* Source Link */}
          {news.sourceUrl && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-12">
              <p className="text-zinc-400 mb-3">Fonte original:</p>
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 flex items-center gap-2"
              >
                {news.source}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Related News */}
          {relatedNews && relatedNews.length > 1 && (
            <section className="border-t border-zinc-800 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Notícias relacionadas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedNews
                  .filter((n) => n.id !== news.id)
                  .slice(0, 4)
                  .map((relatedItem) => (
                    <Link key={relatedItem.id} href={`/noticias/${relatedItem.id}`}>
                      <Card className="bg-zinc-900/50 border-zinc-800 hover:border-amber-500/30 transition-all cursor-pointer group">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                            {relatedItem.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span>{formatTimeAgo(relatedItem.publishedAt)}</span>
                            <span>{relatedItem.source}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

// Main News Component with routing
export default function News() {
  const params = useParams();
  const id = params.id;

  if (id) {
    return <SingleNewsPage id={id} />;
  }

  return <NewsListPage />;
}
