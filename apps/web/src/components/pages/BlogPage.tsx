import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";

export function BlogPage() {
  const posts = useQuery(api.blogPosts.list);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Lecturas</h1>
      <p className="mb-6 text-sm text-muted-foreground">Articulos, reflexiones y guias para pensar con criterio</p>

      {posts === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-60" />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={BookOpen} title="No hay lecturas todavia" description="Las lecturas se publicaran pronto" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="cursor-pointer overflow-hidden p-0 transition-colors hover:border-foreground/20"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="flex h-40 items-center justify-center bg-muted text-xs uppercase tracking-widest text-muted-foreground">
                {post.category ?? "Articulo"}
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-sm font-bold">{post.title}</h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
