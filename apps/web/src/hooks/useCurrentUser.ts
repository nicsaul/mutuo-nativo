import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export function useCurrentUser() {
  const profile = useQuery(api.profiles.getMyProfile);
  return {
    profile,
    isLoading: profile === undefined,
    isAdmin: profile?.role === "admin",
    isTeam: profile?.role === "team" || profile?.role === "admin",
  };
}
