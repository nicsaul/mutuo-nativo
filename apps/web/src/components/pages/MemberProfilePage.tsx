import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/shared/BackButton";
import { ExternalLink } from "lucide-react";

export function MemberProfilePage() {
  const { memberId } = useParams<{ memberId: string }>();
  const member = useQuery(
    api.members.getById,
    memberId ? { profileId: memberId as Id<"profiles"> } : "skip",
  );

  if (member === undefined) {
    return <Skeleton className="h-64 w-full" />;
  }
  if (!member) {
    return <p className="text-sm text-muted-foreground">Miembro no encontrado</p>;
  }

  return (
    <div>
      <BackButton label="Volver a miembros" />

      <div className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-foreground text-2xl font-bold text-background">
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">{member.name}</h2>
            <Badge>{member.role}</Badge>
          </div>
          {(member.position || member.company) && (
            <p className="mt-1 text-sm font-medium">
              {member.position}{member.position && member.company ? " en " : ""}{member.company}
            </p>
          )}
          {member.joinYear && (
            <p className="mt-0.5 text-xs text-muted-foreground">Desde {member.joinYear}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Bio</p>
          <p className="text-sm leading-relaxed">{member.bio || "Este miembro aun no completo su bio."}</p>
        </Card>
        <Card className="p-5">
          <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Que busca</p>
          <p className="text-sm leading-relaxed">{member.looking || "No especificado."}</p>
        </Card>
      </div>

      {member.skills && member.skills.length > 0 && (
        <Card className="mt-4 p-5">
          <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Habilidades</p>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </Card>
      )}

      {member.linkedin && (
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Ver perfil en LinkedIn
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
