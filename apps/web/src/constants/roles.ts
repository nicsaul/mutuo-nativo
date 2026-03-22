import type { UserRole } from "@repo/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  team: "Equipo",
  mentor: "Mentoria",
  member: "Miembro",
};
