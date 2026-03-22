import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComposeBox } from "@/components/feed/ComposeBox";
import { PostCard } from "@/components/feed/PostCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar, Target, BookOpen, ChevronRight, Rss } from "lucide-react";
import { ROUTES } from "@/constants/routes";

function QuickCard({
  icon: Icon,
  label,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <Card
      className="flex cursor-pointer items-center gap-3 p-3.5 transition-colors hover:border-foreground/20"
      onClick={onClick}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground">
        <Icon className="h-4 w-4 text-background" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-xs font-bold">{title}</p>
        <p className="text-[0.65rem] text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </Card>
  );
}

export function FeedPage() {
  const posts = useQuery(api.posts.list);
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido a AI Nativo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu espacio de aprendizaje, comunidad y accion.
        </p>
      </div>

      {/* Quick access cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <QuickCard
          icon={Calendar}
          label="Proximo evento"
          title="Encuentro en vivo"
          subtitle="Ver calendario"
          onClick={() => navigate(ROUTES.EVENTS)}
        />
        <QuickCard
          icon={Target}
          label="Mision activa"
          title="Continuar aprendiendo"
          subtitle="Ver misiones"
          onClick={() => navigate(ROUTES.MISSIONS)}
        />
        <QuickCard
          icon={BookOpen}
          label="Nueva lectura"
          title="Leer articulos"
          subtitle="Ver lecturas"
          onClick={() => navigate(ROUTES.BLOG)}
        />
      </div>

      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Actividad reciente
      </p>

      <ComposeBox />

      {/* Posts */}
      {posts === undefined ? (
        <Card className="space-y-4 p-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </Card>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Rss}
          title="No hay posts todavia"
          description="Se el primero en compartir algo con la comunidad"
        />
      ) : (
        <Card className="p-0">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Card>
      )}
    </div>
  );
}
