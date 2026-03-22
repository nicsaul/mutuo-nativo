import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle } from "lucide-react";

const RULES = [
  { title: "Respeto y buena onda", desc: "Tratamos a todos con respeto. Dudas basicas, avanzadas, opiniones distintas: todo suma." },
  { title: "Compartir con generosidad", desc: "Si descubriste algo util, compartilo. La comunidad crece cuando todos aportan." },
  { title: "Sin spam ni autopromocion", desc: "El grupo es para intercambio genuino, no para vender servicios ni promocionar productos." },
  { title: "Lo que pasa en el grupo, queda en el grupo", desc: "No compartir capturas ni contenido del grupo fuera de la comunidad sin permiso." },
];

export function CommunityPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Club</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        El espacio privado de la comunidad AI Nativo en WhatsApp
      </p>

      <Card className="mb-6 p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
          <MessageCircle className="h-8 w-8 text-background" />
        </div>
        <h2 className="mb-2 text-lg font-bold">Grupo privado de WhatsApp</h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
          Conecta con el resto de los miembros de AI Nativo. Comparti dudas, descubrimientos y avances en tiempo real.
        </p>
        <Button asChild>
          <a href="https://chat.whatsapp.com/INVITE_LINK" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> Unirme al grupo
          </a>
        </Button>
      </Card>

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Reglas de la comunidad
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {RULES.map((rule) => (
          <Card key={rule.title} className="p-5">
            <h3 className="mb-1.5 text-sm font-bold">{rule.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{rule.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
