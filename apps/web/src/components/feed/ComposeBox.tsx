import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ComposeBox() {
  const { profile } = useCurrentUser();
  const createPost = useMutation(api.posts.create);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createPost({ content: content.trim() });
      setContent("");
      toast.success("Post publicado");
    } catch {
      toast.error("Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 p-4">
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-foreground text-xs font-bold text-background">
            {profile?.initials ?? "?"}
          </AvatarFallback>
        </Avatar>
        <Textarea
          placeholder="Compartir algo con la comunidad..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[72px] resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
      <Separator className="my-3" />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!content.trim() || loading}
          onClick={handleSubmit}
          className="rounded-full px-5 text-xs"
        >
          {loading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
          Publicar
        </Button>
      </div>
    </Card>
  );
}
