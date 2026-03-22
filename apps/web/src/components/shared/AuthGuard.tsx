import { type ReactNode, useEffect, useRef } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Loader2 } from "lucide-react";
import { LoginPage } from "@/components/pages/LoginPage";

interface AuthGuardProps {
  children: ReactNode;
}

function ProfileEnsurer({ children }: { children: ReactNode }) {
  const profile = useQuery(api.profiles.getMyProfile);
  const ensureProfile = useMutation(api.profiles.ensureProfile);
  const ensured = useRef(false);

  useEffect(() => {
    if (profile === null && !ensured.current) {
      ensured.current = true;
      // Profile doesn't exist yet — create one with placeholder data.
      // The user's email comes from auth; name defaults to email prefix.
      // They can update their profile later.
      void ensureProfile({});
    }
  }, [profile, ensureProfile]);

  if (profile === undefined || profile === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Preparando tu perfil...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <ProfileEnsurer>{children}</ProfileEnsurer>;
}
