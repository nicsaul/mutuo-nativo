import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Id } from "convex/_generated/dataModel";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAY_NAMES = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export function EventsPage() {
  const events = useQuery(api.events.list);
  const { profile } = useCurrentUser();
  const isLocked = profile?.role === "member";

  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewingRecording, setViewingRecording] = useState<Id<"events"> | null>(null);

  const recordingEvent = viewingRecording
    ? events?.find((e) => e._id === viewingRecording)
    : null;

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
  const today = new Date();

  const eventsInMonth = (events ?? []).filter((e) => {
    const d = new Date(e.eventDate);
    return d.getMonth() === calMonth && d.getFullYear() === calYear;
  });

  const getEventsForDay = (day: number) =>
    eventsInMonth.filter((e) => new Date(e.eventDate).getDate() === day);

  const selectedEvents = selectedDay
    ? getEventsForDay(selectedDay)
    : eventsInMonth;

  const calendarCells: Array<{ day: number; current: boolean }> = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--)
    calendarCells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    calendarCells.push({ day: d, current: true });
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7)
    for (let i = 1; i <= remaining; i++)
      calendarCells.push({ day: i, current: false });

  const prevMonth = () => {
    setSelectedDay(null);
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    setSelectedDay(null);
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  if (events === undefined) {
    return (
      <div>
        <h1 className="mb-1 text-2xl font-bold">Encuentros</h1>
        <p className="mb-6 text-sm text-muted-foreground">Encuentros en vivo, workshops y grabaciones</p>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Encuentros</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Encuentros en vivo, workshops y grabaciones
      </p>

      <div className="relative">
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/85 p-10 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-border">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold">Contenido exclusivo de la mentoria</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Los encuentros estan disponibles para miembros activos en la mentoria AI Nativo.
            </p>
            <Button size="sm" className="mt-4">Consultar acceso</Button>
          </div>
        )}

        <div className={cn("grid gap-6 lg:grid-cols-[1fr_320px]", isLocked && "pointer-events-none blur-sm select-none")}>
          {/* Calendar */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-bold capitalize">
                {MONTH_NAMES[calMonth]} {calYear}
              </h3>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7">
              {DAY_NAMES.map((d) => (
                <div key={d} className="py-2 text-center text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {d}
                </div>
              ))}
              {calendarCells.map((cell, i) => {
                const hasEvent = cell.current && getEventsForDay(cell.day).length > 0;
                const isUpcoming = cell.current && getEventsForDay(cell.day).some((e) => e.status === "upcoming");
                const isToday = cell.current && cell.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                const isSel = cell.current && selectedDay === cell.day;

                return (
                  <div
                    key={i}
                    onClick={() => cell.current && setSelectedDay(isSel ? null : cell.day)}
                    className={cn(
                      "flex min-h-[40px] cursor-default flex-col items-center justify-center rounded-md text-sm transition-colors",
                      !cell.current && "text-muted-foreground/30",
                      isToday && "font-bold",
                      hasEvent && "cursor-pointer font-semibold hover:bg-muted",
                      isUpcoming && "bg-foreground text-background hover:bg-foreground/90",
                      isSel && !isUpcoming && "bg-foreground text-background",
                    )}
                  >
                    {cell.day}
                    {hasEvent && (
                      <div className={cn("mt-0.5 h-1 w-1 rounded-full bg-foreground", (isUpcoming || isSel) && "bg-background")} />
                    )}
                  </div>
                );
              })}
            </div>
            {selectedDay && (
              <div className="mt-3 text-center">
                <button onClick={() => setSelectedDay(null)} className="text-xs text-muted-foreground underline hover:text-foreground">
                  Ver todos los encuentros del mes
                </button>
              </div>
            )}
          </Card>

          {/* Event Sidebar */}
          <div className="space-y-3">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {selectedDay ? `${MONTH_NAMES[calMonth]} ${selectedDay}` : `Encuentros de ${MONTH_NAMES[calMonth]}`}
            </p>
            {selectedEvents.length === 0 ? (
              <EmptyState icon={Calendar} title="No hay encuentros" className="py-8" />
            ) : (
              selectedEvents.map((event) => (
                <Card
                  key={event._id}
                  className={cn("p-4", event.status === "upcoming" && "bg-foreground text-background")}
                >
                  <h4 className="text-sm font-bold">{event.title}</h4>
                  <p className={cn("mt-1 text-xs", event.status === "upcoming" ? "text-background/60" : "text-muted-foreground")}>
                    {new Date(event.eventDate).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    {event.time && ` · ${event.time}`}
                  </p>
                  {event.description && (
                    <p className={cn("mt-2 text-xs leading-relaxed", event.status === "upcoming" ? "text-background/60" : "text-muted-foreground")}>
                      {event.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant={event.status === "upcoming" ? "secondary" : "outline"} className="text-[0.6rem]">
                      {event.status === "upcoming" ? "Proximo" : "Grabado"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {event.zoomLink && (
                      <Button
                        size="sm"
                        variant={event.status === "upcoming" ? "secondary" : "default"}
                        className="h-7 text-[0.65rem]"
                        asChild
                      >
                        <a href={event.zoomLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" /> Ir a evento
                        </a>
                      </Button>
                    )}
                    {event.recordingUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn("h-7 text-[0.65rem]", event.status === "upcoming" && "border-background/30 text-background hover:bg-background/10")}
                        onClick={() => setViewingRecording(event._id)}
                      >
                        <Play className="mr-1 h-3 w-3" /> Ver grabacion
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recording Modal */}
      <Dialog open={!!viewingRecording} onOpenChange={() => setViewingRecording(null)}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-sm">{recordingEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-foreground">
            {recordingEvent?.recordingUrl && (
              <iframe
                src={recordingEvent.recordingUrl}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
