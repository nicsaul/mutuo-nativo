import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  label: string;
}

export function BackButton({ label }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button variant="outline" size="sm" className="mb-5" onClick={() => navigate(-1)}>
      <ChevronLeft className="mr-1 h-3.5 w-3.5" /> {label}
    </Button>
  );
}
