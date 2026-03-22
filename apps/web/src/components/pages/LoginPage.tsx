import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "Al menos 8 caracteres", test: (pw) => pw.length >= 8 },
  { label: "Una letra mayuscula", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Una letra minuscula", test: (pw) => /[a-z]/.test(pw) },
  { label: "Un numero", test: (pw) => /\d/.test(pw) },
];

function PasswordStrength({ password }: { password: string }) {
  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
  const passedCount = results.filter((r) => r.passed).length;
  const strength = passedCount / PASSWORD_RULES.length;

  if (!password) return null;

  return (
    <div className="space-y-2.5 pt-1">
      {/* Strength bar */}
      <div className="flex gap-1">
        {PASSWORD_RULES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < passedCount
                ? strength === 1
                  ? "bg-white"
                  : strength >= 0.5
                    ? "bg-white/60"
                    : "bg-white/30"
                : "bg-white/10",
            )}
          />
        ))}
      </div>
      {/* Rules */}
      <div className="space-y-1">
        {results.map((rule) => (
          <div
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 text-[0.65rem] transition-colors duration-200",
              rule.passed ? "text-white/60" : "text-white/25",
            )}
          >
            {rule.passed ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {rule.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function LoginPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }> = [];
    const PARTICLE_COUNT = 120;
    const CONNECTION_DIST = 150;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    const mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas!.width = canvas!.parentElement!.offsetWidth;
      H = canvas!.height = canvas!.parentElement!.offsetHeight;
    }

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.5,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * 0.03;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(255,255,255,0.6)";
        ctx!.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!email || !password) {
        setError("Ingresa tu email y contraseña");
        return;
      }
      if (flow === "signUp" && !name) {
        setError("Ingresa tu nombre");
        return;
      }
      if (flow === "signUp" && !isPasswordValid(password)) {
        setError("La contraseña no cumple los requisitos");
        return;
      }
      setLoading(true);
      try {
        await signIn("password", {
          email,
          password,
          flow,
          ...(flow === "signUp" ? { name } : {}),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (flow === "signIn") {
          setError("Email o contraseña incorrectos");
        } else if (message.includes("already exists")) {
          setError("Ya existe una cuenta con este email. Intenta iniciar sesion.");
        } else if (message.includes("password") || message.includes("Password")) {
          setError("La contraseña no cumple los requisitos minimos");
        } else {
          setError("No se pudo crear la cuenta. Intenta de nuevo.");
        }
        setLoading(false);
      }
    },
    [email, password, name, flow, signIn],
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-foreground">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="mb-1 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Mütüö
          </span>
        </div>
        <h1 className="mb-1 text-center text-3xl font-bold tracking-wide text-white">
          AI NATIVO
        </h1>
        <p className="mb-10 text-center text-xs font-light uppercase tracking-[0.15em] text-white/40">
          Plataforma de aprendizaje
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {flow === "signUp" && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-white/60">
                Nombre completo
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="border-white/15 bg-white/8 text-white placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-0"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-white/60">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              className="border-white/15 bg-white/8 text-white placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-white/60">
              Contraseña
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={
                flow === "signIn" ? "current-password" : "new-password"
              }
              className="border-white/15 bg-white/8 text-white placeholder:text-white/30 focus-visible:border-white/40 focus-visible:ring-0"
            />
            {flow === "signUp" && <PasswordStrength password={password} />}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-foreground hover:bg-white/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {flow === "signIn" ? "Ingresar" : "Crear cuenta"}
          </Button>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}
        </form>

        <div className="mt-6 text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError("");
            }}
            className="h-auto px-0 py-0 text-xs text-white/40 hover:bg-transparent hover:text-white/70"
          >
            {flow === "signIn"
              ? "No tenes cuenta? Registrate"
              : "Ya tenes cuenta? Ingresa"}
          </Button>
        </div>

        <p className="mt-8 text-center text-[0.65rem] text-white/20">
          Plataforma exclusiva para miembros de AI Nativo
        </p>
      </div>
    </div>
  );
}
