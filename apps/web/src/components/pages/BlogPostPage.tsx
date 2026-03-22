import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/shared/BackButton";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = useQuery(api.blogPosts.getBySlug, slug ? { slug } : "skip");

  if (post === undefined) return <Skeleton className="h-96 w-full" />;
  if (!post) return <p className="text-sm text-muted-foreground">Articulo no encontrado</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton label="Volver a lecturas" />
      <div className="mb-4 flex items-center gap-2">
        {post.category && <Badge variant="secondary">{post.category}</Badge>}
        {post.readTime && <span className="text-xs text-muted-foreground">{post.readTime}</span>}
      </div>
      <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
      {post.author && <p className="mb-6 text-sm text-muted-foreground">Por {post.author}</p>}
      <div className="prose prose-sm max-w-none text-foreground">
        <p className="whitespace-pre-wrap leading-relaxed">{post.body ?? post.excerpt}</p>
      </div>
    </div>
  );
}
