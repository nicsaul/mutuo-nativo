import { useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  Home,
  Calendar,
  Target,
  MessageSquare,
  Users,
  UserCircle,
  BookOpen,
  Headphones,
  Star,
  Wrench,
  User,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg border-2 border-transparent px-3 py-2 text-left text-sm font-semibold transition-all duration-150",
        active
          ? "border-white/20 bg-white/10 text-white"
          : "text-white/50 hover:border-white/10 hover:bg-white/[0.06] hover:text-white/80",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
          active ? "text-white" : "text-white/40",
        )}
        strokeWidth={active ? 2.2 : 1.8}
      />
      {label}
    </button>
  );
}

const NAV_SECTIONS = [
  {
    label: "Plataforma",
    items: [
      { icon: Home, label: "Feed", path: ROUTES.FEED },
      { icon: Calendar, label: "Encuentros", path: ROUTES.EVENTS },
      { icon: Target, label: "Misiones", path: ROUTES.MISSIONS },
      { icon: MessageSquare, label: "Foro", path: ROUTES.FORUM },
      { icon: Users, label: "Club", path: ROUTES.COMMUNITY },
      { icon: UserCircle, label: "Miembros", path: ROUTES.MEMBERS },
    ],
  },
  {
    label: "Contenido",
    items: [
      { icon: BookOpen, label: "Lecturas", path: ROUTES.BLOG },
      { icon: Headphones, label: "Capsulas", path: ROUTES.CAPSULES },
      { icon: Star, label: "Recomendados", path: ROUTES.RECOMMENDED },
      { icon: Wrench, label: "Herramientas", path: ROUTES.TOOLS },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const { profile, isAdmin } = useCurrentUser();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r-2 border-border bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex h-12 shrink-0 items-center border-b-2 border-border px-4">
        <div>
          <h1 className="text-sm font-bold tracking-wide text-white">
            AI NATIVO
          </h1>
          <span className="text-[0.55rem] font-normal uppercase tracking-[0.2em] text-white/30">
            Por Mütüö
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            <p className="mb-1 px-3 pt-3 text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Personal */}
        <div className="mb-1">
          <p className="mb-1 px-3 pt-3 text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">
            Personal
          </p>
          <NavItem
            icon={User}
            label="Mi perfil"
            active={location.pathname === ROUTES.PROFILE}
            onClick={() => navigate(ROUTES.PROFILE)}
          />
        </div>

        {/* Admin */}
        {isAdmin && (
          <div className="mb-1">
            <p className="mb-1 px-3 pt-3 text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">
              Administracion
            </p>
            <NavItem
              icon={Settings}
              label="Admin Panel"
              active={location.pathname.startsWith(ROUTES.ADMIN)}
              onClick={() => navigate(ROUTES.ADMIN)}
            />
          </div>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* User + Logout */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-white/10 text-[0.65rem] font-bold text-white">
            {profile?.initials ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white/90">
            {profile?.name ?? "Cargando..."}
          </p>
          <p className="text-[0.6rem] capitalize text-white/30">
            {profile?.role ?? ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 border-2 border-transparent text-white/30 hover:border-white/10 hover:bg-white/5 hover:text-white/60"
          onClick={() => void signOut()}
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </aside>
  );
}
