import { useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users, Search, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ROLE_LABELS } from "@/constants/roles";

export function MembersPage() {
  const members = useQuery(api.members.list);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("all");

  const years = members
    ? [...new Set(members.map((m) => m.joinYear).filter(Boolean) as number[])].sort((a, b) => b - a)
    : [];

  const filtered = (members ?? []).filter((m) => {
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company?.toLowerCase().includes(search.toLowerCase()) ||
      m.position?.toLowerCase().includes(search.toLowerCase()) ||
      m.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchYear = filterYear === "all" || m.joinYear === Number(filterYear);
    return matchSearch && matchYear;
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Miembros</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Conoce a los integrantes de la comunidad AI Nativo
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, empresa, cargo o habilidad..."
            className="pl-9"
          />
        </div>
        {years.length > 0 && (
          <Tabs value={filterYear} onValueChange={setFilterYear}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
              {years.map((y) => (
                <TabsTrigger key={y} value={String(y)} className="text-xs">{y}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{filtered.length} miembros</p>

      {members === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No se encontraron miembros" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <Card
              key={member._id}
              className="cursor-pointer p-5 transition-colors hover:border-foreground/20"
              onClick={() => navigate(ROUTES.MEMBER_PROFILE(member._id))}
            >
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-foreground text-sm font-bold text-background">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold">{member.name}</h3>
                  {member.position && (
                    <p className="truncate text-xs text-muted-foreground">{member.position}</p>
                  )}
                  {member.company && (
                    <p className="truncate text-xs font-medium">{member.company}</p>
                  )}
                </div>
              </div>
              {member.bio && (
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="default" className="text-[0.6rem]">
                  {ROLE_LABELS[member.role] ?? member.role}
                </Badge>
                {member.joinYear && (
                  <Badge variant="secondary" className="text-[0.6rem]">Desde {member.joinYear}</Badge>
                )}
                {member.skills?.slice(0, 2).map((s) => (
                  <Badge key={s} variant="outline" className="text-[0.6rem]">{s}</Badge>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <span className="flex items-center gap-1 text-xs font-semibold">
                  Ver perfil <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
