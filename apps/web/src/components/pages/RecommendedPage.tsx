import { useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { Star, Video, Headphones, BookOpen, Link as LinkIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const CAT_ICONS: Record<string, React.ElementType> = {
  Video,
  Audio: Headphones,
  Investigacion: BookOpen,
};

export function RecommendedPage() {
  const items = useQuery(api.recommended.list);
  const getCategory = useCallback((i: { category: string }) => i.category, []);
  const { active, setActive, categories, filtered } = useCategoryFilter(items, getCategory);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Contenidos recomendados</h1>
      <p className="mb-6 text-sm text-muted-foreground">Recursos curados para seguir aprendiendo</p>

      <CategoryTabs categories={categories} active={active} onValueChange={setActive} />

      {items === undefined ? (
        <Card className="space-y-3 p-5">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}</Card>
      ) : (filtered ?? []).length === 0 ? (
        <EmptyState icon={Star} title="No hay recomendados" />
      ) : (
        <Card className="p-0">
          {(filtered ?? []).map((item) => {
            const Icon = CAT_ICONS[item.category] ?? LinkIcon;
            return (
              <a
                key={item._id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-muted"
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
                  item.category === "Video" && "bg-foreground text-background",
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant="secondary" className="text-[0.6rem]">{item.category}</Badge>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              </a>
            );
          })}
        </Card>
      )}
    </div>
  );
}
