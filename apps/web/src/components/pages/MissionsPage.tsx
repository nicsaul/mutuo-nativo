import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Target, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MissionsPage() {
  const missions = useQuery(api.missions.list);

  const completedCount = missions?.filter((m) => m.userStatus === "completed").length ?? 0;
  const totalMissions = missions?.length ?? 0;
  const progressPercent = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;

  if (missions === undefined) {
    return (
      <div>
        <h1 className="mb-1 text-2xl font-bold">Misiones</h1>
        <p className="mb-6 text-sm text-muted-foreground">Tu recorrido de 4 semanas</p>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Misiones</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Tu recorrido de 4 semanas. Cada mision se desbloquea a medida que avanzas.
      </p>

      {/* Stats */}
      <div className="mb-6 flex gap-3">
        <Card className="flex-1 bg-foreground p-4 text-background">
          <p className="text-2xl font-bold">{completedCount}/{totalMissions}</p>
          <p className="text-xs font-light">Misiones completadas</p>
        </Card>
        <Card className="flex-1 p-4">
          <p className="text-2xl font-bold">{progressPercent}%</p>
          <p className="text-xs text-muted-foreground">Progreso total</p>
        </Card>
      </div>

      {missions.length === 0 ? (
        <EmptyState icon={Target} title="No hay misiones" description="Las misiones se publicaran pronto" />
      ) : (
        <Card className="p-0">
          {missions.map((mission, i) => {
            const isLocked = mission.userStatus === "locked";
            const isCompleted = mission.userStatus === "completed";
            const isActive = mission.userStatus === "active";

            return (
              <div
                key={mission._id}
                className={cn(
                  "flex items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0",
                  isLocked ? "pointer-events-none opacity-40" : "cursor-pointer hover:bg-muted",
                )}
              >
                {/* Number circle */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                    isCompleted && "border-foreground bg-foreground text-background",
                    isActive && "border-foreground",
                    isLocked && "border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isLocked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    i + 1
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {mission.week}
                  </p>
                  <h3 className="text-sm font-semibold">{mission.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {mission.description}
                  </p>
                </div>

                {/* Status */}
                <Badge
                  variant={isCompleted ? "default" : "secondary"}
                  className={cn("text-[0.6rem]", isLocked && "opacity-50")}
                >
                  {isCompleted ? "Completada" : isActive ? "Activa" : "Bloqueada"}
                </Badge>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
