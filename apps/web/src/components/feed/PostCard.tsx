import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { type Id } from "convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTimeAgo } from "@/lib/time";
import { toast } from "sonner";

interface PostCardProps {
  post: {
    _id: Id<"posts">;
    content: string;
    createdAt: string;
    author: string;
    authorInitials: string;
    authorRole: string;
    likeCount: number;
    commentCount: number;
    userLiked: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const toggleLike = useMutation(api.posts.toggleLike);
  const addComment = useMutation(api.posts.addComment);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const comments = useQuery(
    api.posts.getComments,
    showComments ? { postId: post._id } : "skip",
  );

  const handleLike = async () => {
    try {
      await toggleLike({ postId: post._id });
    } catch {
      toast.error("Error al dar like");
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await addComment({ postId: post._id, content: newComment.trim() });
      setNewComment("");
    } catch {
      toast.error("Error al comentar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-b border-border px-5 py-5 last:border-b-0">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback
            className={cn(
              "text-xs font-bold",
              post.authorRole === "admin"
                ? "bg-foreground text-background"
                : "bg-muted text-foreground",
            )}
          >
            {post.authorInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{post.author}</p>
          <p className="text-xs text-muted-foreground">
            {getTimeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed">{post.content}</p>

      {/* Actions */}
      <div className="mt-4 flex gap-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "h-auto gap-1.5 px-0 py-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground",
            post.userLiked && "text-foreground",
          )}
        >
          <Heart
            className={cn("h-4 w-4", post.userLiked && "fill-current")}
          />
          {post.likeCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="h-auto gap-1.5 px-0 py-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          {post.commentCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-1.5 px-0 py-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 border-t border-border pt-4">
          {comments?.map((c) => (
            <div key={c._id} className="mb-3 flex gap-2.5">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-muted text-[0.6rem] font-semibold">
                  {c.authorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-xs font-semibold">{c.author}</span>
                <p className="text-xs leading-snug text-foreground/80">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-2 flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribir comentario..."
              className="h-8 text-xs"
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <Button
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={!newComment.trim() || submitting}
              onClick={handleComment}
            >
              {submitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
