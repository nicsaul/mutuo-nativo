import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  const { profile, isLoading } = useCurrentUser();
  const updateProfile = useMutation(api.profiles.updateProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");
  const [looking, setLooking] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  const startEditing = () => {
    if (!profile) return;
    setName(profile.name);
    setBio(profile.bio ?? "");
    setCompany(profile.company ?? "");
    setPosition(profile.position ?? "");
    setSkills(profile.skills?.join(", ") ?? "");
    setLooking(profile.looking ?? "");
    setLinkedin(profile.linkedin ?? "");
    setWebsite(profile.website ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name, bio, company, position, looking, linkedin, website,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setEditing(false);
      toast.success("Perfil actualizado");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!profile) return <p className="text-sm text-muted-foreground">Perfil no encontrado</p>;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <Button variant="outline" size="sm" onClick={editing ? () => setEditing(false) : startEditing}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" /> {editing ? "Cancelar" : "Editar"}
        </Button>
      </div>

      {!editing ? (
        <>
          <div className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-foreground text-2xl font-bold text-background">
                {profile.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              {(profile.position || profile.company) && (
                <p className="mt-0.5 text-sm font-medium">
                  {profile.position}{profile.position && profile.company ? " en " : ""}{profile.company}
                </p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">
                {profile.joinYear ? `Miembro desde ${profile.joinYear}` : "Miembro"}
              </p>
              {profile.bio && <p className="mt-3 text-sm leading-relaxed">{profile.bio}</p>}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              )}
            </div>
          </div>
          {profile.looking && (
            <Card className="p-5">
              <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Que busco</p>
              <p className="text-sm">{profile.looking}</p>
            </Card>
          )}
        </>
      ) : (
        <Card className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nombre completo</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Empresa</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tu empresa" /></div>
            <div className="space-y-2"><Label>Cargo</Label><Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Tu cargo" /></div>
            <div className="space-y-2"><Label>LinkedIn</Label><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
          </div>
          <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[80px]" /></div>
          <div className="space-y-2"><Label>Habilidades (separadas por coma)</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} /></div>
          <div className="space-y-2"><Label>Que busco</Label><Textarea value={looking} onChange={(e) => setLooking(e.target.value)} className="min-h-[60px]" /></div>
          <div className="space-y-2"><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." /></div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button disabled={saving} onClick={handleSave}>
              {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />} Guardar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
