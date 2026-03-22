import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Check } from "lucide-react";
import { getTimeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/feed": "Feed",
  "/events": "Encuentros",
  "/missions": "Misiones",
  "/forum": "Foro",
  "/community": "Club",
  "/members": "Miembros",
  "/blog": "Lecturas",
  "/capsules": "Capsulas auditivas",
  "/recommended": "Recomendados",
  "/tools": "Herramientas",
  "/profile": "Mi perfil",
  "/admin": "Admin Panel",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [route, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(route)) return title;
  }
  return "AI Nativo";
}

export function Header() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const unreadCount = useQuery(api.notifications.unreadCount);
  const notifications = useQuery(
    api.notifications.listMine,
    popoverOpened ? {} : "skip",
  );
  const markAllRead = useMutation(api.notifications.markAllRead);

  return (
    <header className="flex h-12 shrink-0 select-none items-center justify-between border-b-2 border-border px-6">
      <h1 className="text-sm font-semibold text-foreground/80">{title}</h1>

      <Popover onOpenChange={(open) => { if (open) setPopoverOpened(true); }}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 border-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {(unreadCount ?? 0) > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[0.55rem] font-bold text-background">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider">
              Notificaciones
            </p>
            {(unreadCount ?? 0) > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void markAllRead({})}
                className="h-auto gap-1 px-0 py-0 text-[0.65rem] text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <Check className="h-3 w-3" /> Marcar leidas
              </Button>
            )}
          </div>
          <Separator />
          <ScrollArea className="max-h-80">
            {!notifications || notifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No hay notificaciones
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={cn(
                    "border-b border-border px-4 py-3 text-xs transition-colors last:border-b-0 hover:bg-muted",
                    !n.read && "border-l-2 border-l-foreground bg-muted/50",
                  )}
                >
                  <p className="leading-relaxed">
                    {n.text}
                  </p>
                  <p className="mt-1 text-[0.6rem] text-muted-foreground">
                    {getTimeAgo(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </header>
  );
}
