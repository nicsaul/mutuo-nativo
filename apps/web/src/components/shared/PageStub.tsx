import { Construction } from "lucide-react";

interface PageStubProps {
  title: string;
  description?: string;
}

export function PageStub({ title, description }: PageStubProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
      <Construction className="h-10 w-10 text-muted-foreground/30" />
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <p className="text-xs text-muted-foreground/60">Proximamente</p>
    </div>
  );
}
