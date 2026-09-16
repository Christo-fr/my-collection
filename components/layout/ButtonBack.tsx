import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";

type ButtonBackProps = {
  link?: "list" | "administration";
};

export function ButtonBack({ link }: ButtonBackProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${link}`);
    }
  };

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
