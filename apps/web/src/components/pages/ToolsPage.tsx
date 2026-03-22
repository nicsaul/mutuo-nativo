import { useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { Wrench, ExternalLink } from "lucide-react";

export function ToolsPage() {
  const tools = useQuery(api.tools.list);
  const getCategory = useCallback((t: { category: string }) => t.category, []);
  const { active, setActive, categories, filtered } = useCategoryFilter(tools, getCategory);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Herramientas</h1>
      <p className="mb-6 text-sm text-muted-foreground">Directorio curado de herramientas de IA</p>

      <CategoryTabs categories={categories} active={active} onValueChange={setActive} allLabel="Todas" />

      {tools === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (filtered ?? []).length === 0 ? (
        <EmptyState icon={Wrench} title="No hay herramientas" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(filtered ?? []).map((tool) => (
            <Card key={tool._id} className="p-5">
              <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">{tool.category}</p>
              <h3 className="mb-1.5 text-sm font-bold">{tool.name}</h3>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-muted-foreground"
              >
                Visitar <ExternalLink className="h-3 w-3" />
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
