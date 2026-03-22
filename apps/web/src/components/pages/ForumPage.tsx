import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageSquare, Plus, Loader2 } from "lucide-react";
import { getTimeAgo } from "@/lib/time";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

type ForumCat = "question" | "resources" | "discussion" | "experience";

export function ForumPage() {
  const threads = useQuery(api.forum.listThreads);
  const createThread = useMutation(api.forum.createThread);
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<ForumCat>("question");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await createThread({ title, body, category });
      setShowCreate(false);
      setTitle("");
      setBody("");
      toast.success("Tema creado");
    } catch {
      toast.error("Error al crear el tema");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Foro</h1>
          <p className="mt-1 text-sm text-muted-foreground">Espacio abierto de discusion entre miembros</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Nuevo tema
        </Button>
      </div>

      {threads === undefined ? (
        <Card className="space-y-4 p-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </Card>
      ) : threads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No hay temas todavia"
          description="Inicia la conversacion creando un nuevo tema"
          actionLabel="Nuevo tema"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <Card className="p-0">
          {threads.map((thread) => (
            <div
              key={thread._id}
              onClick={() => navigate(ROUTES.FORUM_THREAD(thread._id))}
              className="cursor-pointer border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-muted"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Badge variant="secondary" className="text-[0.6rem]">
                  {thread.category}
                </Badge>
                {thread.pinned && (
                  <Badge variant="default" className="text-[0.6rem]">Fijado</Badge>
                )}
              </div>
              <h3 className="text-sm font-semibold">{thread.title}</h3>
              <div className="mt-1.5 flex gap-4 text-xs text-muted-foreground">
                <span>{thread.author}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> {thread.replyCount} respuestas
                </span>
                <span>{getTimeAgo(thread.lastActivityAt)}</span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Create Thread Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo tema</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titulo</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="De que queres hablar?" />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ForumCat)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Pregunta</SelectItem>
                  <SelectItem value="resources">Recursos</SelectItem>
                  <SelectItem value="discussion">Debate</SelectItem>
                  <SelectItem value="experience">Experiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Escribi tu mensaje..." className="min-h-[120px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button disabled={!title.trim() || !body.trim() || submitting} onClick={handleCreate}>
              {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Publicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
