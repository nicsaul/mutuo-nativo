import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { ROLE_LABELS } from "@/constants/roles";
import { type Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import type { UserRole } from "@repo/types";

export function AdminPage() {
  const { isAdmin, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const stats = useQuery(api.admin.getDashboardStats);
  const users = useQuery(api.admin.listAllUsers);
  const updateRole = useMutation(api.profiles.updateUserRole);

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate(ROUTES.FEED, { replace: true });
  }, [isAdmin, isLoading, navigate]);

  if (isLoading || !isAdmin) return null;

  const handleRoleChange = async (profileId: string, role: UserRole) => {
    try {
      await updateRole({ profileId: profileId as Id<"profiles">, role });
      toast.success("Rol actualizado");
    } catch {
      toast.error("Error al cambiar el rol");
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Admin Panel</h1>
      <p className="mb-6 text-sm text-muted-foreground">Gestion de la plataforma AI Nativo</p>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">General</TabsTrigger>
          <TabsTrigger value="users">Miembros</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {stats === undefined ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Miembros", value: stats.totalMembers },
                { label: "Posts", value: stats.totalPosts },
                { label: "Eventos", value: stats.totalEvents },
                { label: "Temas de foro", value: stats.totalThreads },
              ].map((stat) => (
                <Card key={stat.label} className="p-6 text-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          {users === undefined ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Miembro</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-xs font-bold">{user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.company ?? "-"}</TableCell>
                      <TableCell className="text-sm">{user.joinYear ?? "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(v) => handleRoleChange(user._id, v as UserRole)}
                        >
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROLE_LABELS).map(([val, label]) => (
                              <SelectItem key={val} value={val}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
