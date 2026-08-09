import Dialog from "@/components/ui/Dialog";
import GameCard from "@/components/game/GameCard";
import Link from "next/link";
import { SuggestionResult } from "@/features/game/gameUtils";
import Button from "@/components/ui/Button";
import { RotateCw } from "lucide-react";

interface SuggestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: SuggestionResult | null;
  onRePoll: () => void;
}

export default function SuggestionDialog({
  isOpen,
  onClose,
  result,
  onRePoll,
}: SuggestionDialogProps) {
  if (!result || !result.game) return null; // Sécurité si aucun résultat n'est présent

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      centered
      title="Voici le jeu qu'on vous suggère !"
    >
      <div className="w-full">
        {!result.isMatch && (
          <p className="text-red-500">{result.warningMessage}</p>
        )}
        <div className="w-100 h-full flex flex-col gap-4 mt-4">
          <GameCard game={result.game} />
        </div>
        <div>
          <Button
            onClick={onRePoll}
            icon={<RotateCw className="w-5 h-5" />}
            variant="secondary"
            className="mt-8 w-full"
          >
            Suggère moi un autre jeu !
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
