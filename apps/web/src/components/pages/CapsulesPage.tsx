import { useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Headphones, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export function CapsulesPage() {
  const capsules = useQuery(api.capsules.list);
  const navigate = useNavigate();
  const [yearFilter, setYearFilter] = useState("all");

  const years = capsules
    ? [...new Set(capsules.map((c) => c.year))].sort((a, b) => b - a)
    : [];

  const filtered = yearFilter === "all"
    ? capsules
    : capsules?.filter((c) => c.year === Number(yearFilter));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Capsulas auditivas</h1>
      <p className="mb-6 text-sm text-muted-foreground">Episodios para escuchar y entender la era de la IA</p>

      {years.length > 0 && (
        <Tabs value={yearFilter} onValueChange={setYearFilter} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
            {years.map((y) => (
              <TabsTrigger key={y} value={String(y)} className="text-xs">{y}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {capsules === undefined ? (
        <Card className="space-y-3 p-5">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}
        </Card>
      ) : (filtered ?? []).length === 0 ? (
        <EmptyState icon={Headphones} title="No hay capsulas" />
      ) : (
        <Card className="p-0">
          {(filtered ?? []).map((capsule) => {
            const isLocked = capsule.status === "locked";
            return (
              <div
                key={capsule._id}
                className={cn(
                  "flex items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0",
                  isLocked ? "opacity-40" : "cursor-pointer hover:bg-muted",
                )}
                onClick={() => !isLocked && navigate(ROUTES.CAPSULE_DETAIL(capsule._id))}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
                  {String(capsule.sortOrder).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{capsule.title}</h3>
                  <p className="text-xs text-muted-foreground">{capsule.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{capsule.duration}</span>
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground transition-colors",
                  isLocked && "border-border",
                  !isLocked && "hover:bg-foreground hover:text-background",
                )}>
                  {isLocked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <Play className="ml-0.5 h-3 w-3" />}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
