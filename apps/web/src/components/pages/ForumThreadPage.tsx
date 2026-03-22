import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { BackButton } from "@/components/shared/BackButton";
import { getTimeAgo } from "@/lib/time";
import { toast } from "sonner";

export function ForumThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const thread = useQuery(
    api.forum.getThread,
    threadId ? { threadId: threadId as Id<"forumThreads"> } : "skip",
  );
  const replies = useQuery(
    api.forum.getReplies,
    threadId ? { threadId: threadId as Id<"forumThreads"> } : "skip",
  );
  const addReply = useMutation(api.forum.addReply);

  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim() || !threadId) return;
    setSubmitting(true);
    try {
      await addReply({ threadId: threadId as Id<"forumThreads">, content: replyContent });
      setReplyContent("");
      toast.success("Respuesta publicada");
    } catch {
      toast.error("Error al responder");
    } finally {
      setSubmitting(false);
    }
  };

  if (thread === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!thread) {
    return <p className="text-sm text-muted-foreground">Tema no encontrado</p>;
  }

  return (
    <div>
      <BackButton label="Volver al foro" />

      {/* Thread */}
      <Card className="mb-6 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-[0.6rem]">{thread.category}</Badge>
          <span className="text-xs text-muted-foreground">{getTimeAgo(thread.createdAt)}</span>
        </div>
        <h2 className="mb-4 text-xl font-bold">{thread.title}</h2>
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-xs font-bold">{thread.authorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{thread.author}</p>
            <p className="text-xs text-muted-foreground">Autor del tema</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{thread.body}</p>
      </Card>

      {/* Replies */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {replies?.length ?? 0} respuestas
      </p>

      {replies?.map((reply) => (
        <Card key={reply._id} className="mb-3 p-4">
          <div className="mb-2 flex items-center gap-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-muted text-[0.6rem] font-bold">{reply.authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-semibold">{reply.author}</span>
              <span className="ml-2 text-xs text-muted-foreground">{getTimeAgo(reply.createdAt)}</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{reply.content}</p>
        </Card>
      ))}

      {/* Reply box */}
      <Card className="mt-5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider">Tu respuesta</p>
        <Textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Escribi tu respuesta..."
          className="min-h-[100px]"
        />
        <div className="mt-3 flex justify-end">
          <Button size="sm" disabled={!replyContent.trim() || submitting} onClick={handleReply}>
            {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Responder
          </Button>
        </div>
      </Card>
    </div>
  );
}
