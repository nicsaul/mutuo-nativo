import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/shared/BackButton";
import { Play, SkipBack, SkipForward } from "lucide-react";

export function CapsuleDetailPage() {
  const { capsuleId } = useParams<{ capsuleId: string }>();
  const capsule = useQuery(
    api.capsules.get,
    capsuleId ? { capsuleId: capsuleId as Id<"capsules"> } : "skip",
  );

  if (capsule === undefined) return <Skeleton className="mx-auto h-96 max-w-lg" />;
  if (!capsule) return <p className="text-sm text-muted-foreground">Capsula no encontrada</p>;

  const epNum = String(capsule.sortOrder).padStart(2, "0");

  return (
    <div className="mx-auto max-w-lg">
      <BackButton label="Todas las capsulas" />

      {/* Cover */}
      <div className="relative mx-auto mb-8 flex aspect-square max-w-xs flex-col items-center justify-center overflow-hidden rounded-lg bg-foreground p-10 text-center text-background">
        <div className="bg-scanlines absolute inset-0 opacity-[0.06]" />
        <p className="relative text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-background/40">Capsula auditiva</p>
        <p className="relative my-3 text-5xl font-bold tracking-tight">{epNum}</p>
        <p className="relative text-base font-semibold">{capsule.title}</p>
        <p className="absolute bottom-4 text-[0.55rem] uppercase tracking-[0.2em] text-background/25">Mütüö · IA Nativo</p>
      </div>

      {/* Player */}
      <Card className="mb-6 bg-muted p-5">
        <div className="mb-3 h-1 w-full cursor-pointer rounded-full bg-border">
          <div className="relative h-full w-1/3 rounded-full bg-foreground">
            <div className="absolute -right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-foreground" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs tabular-nums text-muted-foreground">0:00</span>
          <div className="flex items-center gap-5">
            <Button variant="ghost" size="icon" className="h-auto w-auto p-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-foreground text-background hover:bg-foreground hover:opacity-80">
              <Play className="ml-0.5 h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-auto w-auto p-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{capsule.duration}</span>
        </div>
      </Card>

      <h2 className="mb-1.5 text-lg font-bold">{capsule.title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{capsule.description}</p>
    </div>
  );
}
