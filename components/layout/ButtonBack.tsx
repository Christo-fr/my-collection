import Button from "@/components/ui/Button";
import { Undo2 } from "lucide-react";
import { useBack } from "@/hooks/useBack";

type ButtonBackProps = {
  link?: "list" | "administration";
};

export function ButtonBack({ link }: ButtonBackProps) {
  const handleClick = useBack(link);

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      icon={<Undo2 className="w-5 h-5" />}
    >
      Retour
    </Button>
  );
}
