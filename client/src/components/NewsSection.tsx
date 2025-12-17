import { useState, useEffect } from "react";
import { Link } from "wouter";
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
} from "lucide-react";

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
  return new Date(date).toLocaleDateString("pt-BR");
}

function NewsBannerSkeleton() {
  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden bg-zinc-800/50">
      <Skeleton className="absolute inset-0" />
    </div>
  );
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

export default function NewsSection() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: featuredNews, isLoading: featuredLoading } = trpc.news.featured.useQuery({ limit: 5 });
  const { data: allNews, isLoading: allLoading } = trpc.news.list.useQuery({ limit: 12 });

  // Auto-rotate banner
  useEffect(() => {
    if (!featuredNews || featuredNews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % featuredNews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredNews]);

  const filteredNews = selectedCategory
    ? allNews?.filter((n) => n.category === selectedCategory)
    : allNews;

  const currentFeatured = featuredNews?.[currentBannerIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-medium text-sm uppercase tracking-wider">
                Notícias
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Atualizações do Setor
            </h2>
            <p className="text-zinc-400 mt-2 max-w-xl">
              Fique por dentro das últimas novidades fiscais, contábeis e tributárias do Brasil
            </p>
          </div>
          <Link href="/noticias">
            <Button variant="outline" className="hidden md:flex border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
              Ver todas
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Featured News Banner */}
        <div className="relative mb-10">
          {featuredLoading ? (
            <NewsBannerSkeleton />
          ) : featuredNews && featuredNews.length > 0 ? (
            <>
              <div className="relative h-[400px] rounded-2xl overflow-hidden group">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 via-zinc-900/80 to-zinc-900/90" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  {currentFeatured && (
                    <>
                      <Badge className={`w-fit mb-4 ${categoryConfig[currentFeatured.category as keyof typeof categoryConfig]?.color || "bg-zinc-700"}`}>
                        {categoryConfig[currentFeatured.category as keyof typeof categoryConfig]?.label || currentFeatured.category}
                      </Badge>
                      
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-3xl leading-tight">
                        {currentFeatured.title}
                      </h3>
                      
                      {currentFeatured.summary && (
                        <p className="text-zinc-300 text-lg mb-6 max-w-2xl line-clamp-2">
                          {currentFeatured.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-zinc-400 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(currentFeatured.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {currentFeatured.viewCount || 0} visualizações
                        </span>
                        <span className="text-amber-500">{currentFeatured.source}</span>
                      </div>
                      
                      <Link href={`/noticias/${currentFeatured.id}`}>
                        <Button className="mt-6 bg-amber-600 hover:bg-amber-700 text-white w-fit">
                          Ler notícia completa
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + (featuredNews?.length || 1)) % (featuredNews?.length || 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % (featuredNews?.length || 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Banner indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentBannerIndex
                        ? "bg-amber-500 w-6"
                        : "bg-zinc-600 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="h-[400px] rounded-2xl bg-zinc-800/30 flex items-center justify-center">
              <p className="text-zinc-500">Nenhuma notícia em destaque</p>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
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
          {allLoading ? (
            Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
          ) : filteredNews && filteredNews.length > 0 ? (
            filteredNews.slice(0, 6).map((news) => {
              const config = categoryConfig[news.category as keyof typeof categoryConfig];
              const Icon = config?.icon || Newspaper;
              
              return (
                <Link key={news.id} href={`/noticias/${news.id}`}>
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-amber-500/30 transition-all cursor-pointer group h-full">
                    <CardHeader className="pb-2">
                      <Badge className={`w-fit mb-2 ${config?.color || "bg-zinc-700"}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config?.label || news.category}
                      </Badge>
                      <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      {news.summary && (
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                          {news.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(news.publishedAt)}
                        </span>
                        <span>{news.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Newspaper className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-500">Nenhuma notícia encontrada</p>
            </div>
          )}
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/noticias">
            <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
              Ver todas as notícias
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
