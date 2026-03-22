import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  resetKey: number;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
          <h1 className="text-lg font-semibold">Algo salio mal</h1>
          <p className="text-sm text-muted-foreground">
            Ocurrio un error inesperado.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                this.setState((s) => ({
                  hasError: false,
                  resetKey: s.resetKey + 1,
                }))
              }
            >
              Reintentar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                window.location.href = "/feed";
              }}
            >
              Ir al inicio
            </Button>
          </div>
        </div>
      );
    }
    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}
