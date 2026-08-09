import Dialog from "@/components/ui/Dialog";
import GameCard from "@/components/game/GameCard";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { SuggestionResult } from "@/features/game/gameUtils";
import Button from "@/components/ui/Button";
import { RotateCw } from "lucide-react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (isOpen && result?.game) {
      confetti({
        particleCount: 120,
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["#FFD700", "#FFA500", "#FFFFFF"],
      });
    }
  }, [isOpen, result]);

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

        <motion.div
          key={result.game.id} // Rejoue l'animation à chaque "Relancer"
          initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
          }}
          className="relative"
        >
          {/* Halo de rareté doré (éclat sous la carte) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0.3], scale: [0.5, 1.2, 1.05] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 blur-xl animate-pulse"
          />

          {/* Rendu de ta carte de jeu */}
          <div className="w-100 h-full flex flex-col gap-4 mt-4">
            <GameCard game={result.game} variant="xl" />
          </div>
        </motion.div>

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
