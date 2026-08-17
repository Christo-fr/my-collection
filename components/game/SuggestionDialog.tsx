import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCw } from "lucide-react";

// Types
import { SuggestionResult } from "@/features/game/gameUtils";

// Composants UI
import Dialog from "@/components/ui/Dialog";
import GameCard from "@/components/game/GameCard";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";

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
  // Compteur d'animation : incrémenté à chaque tirage pour forcer Framer Motion à rejouer l'animation
  const [count, setCount] = useState(0);

  // Déclenchement des effets visuels (confetti + incrément d'animation)
  useEffect(() => {
    if (isOpen && result?.game) {
      setCount((prev) => prev + 1);
      confetti({
        particleCount: 120,
        spread: 360,
        ticks: 70,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: [
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-grad-gacha-start")
            .trim(),
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-grad-gacha-end")
            .trim(),
          "#FFFFFF",
        ],
      });
    }
  }, [isOpen, result]);

  // Sécurité si aucun résultat n'est présent
  if (!result || !result.game) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" centered>
      <div className="w-full h-full flex flex-col gap-4 items-center justify-between p-4">
        {/* En-tête : Titre et message alternatif */}
        <div className="flex flex-col mb-4 shrink-0 gap-4">
          <Heading
            as="h2"
            size="md"
            className="text-center mb-2 !text-dialog-text"
          >
            Voici le jeu que nous vous suggérons :
          </Heading>
          {!result.isMatch && (
            <p className="text-center whitespace-pre-line text-dialog-text/80 text-sm">
              {result.warningMessage}
            </p>
          )}
        </div>

        {/* Zone centrale : Carte de jeu avec animation Framer Motion */}
        <motion.div
          key={count} // Réinitialise l'animation à chaque évolution du compteur
          initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
          }}
          className="relative flex-1 min-h-0 w-full flex items-center justify-center py-2 max-w-sm"
        >
          {/* Halo lumineux de rareté sous la carte */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0.3], scale: [0.5, 1.2, 1.05] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-grad-gacha-start via-grad-gacha-via to-grad-gacha-end blur-2xl animate-pulse"
          />

          {/* Rendu de la  GameCard */}
          <div className="relative w-full max-w-[340px] aspect-[2/3] max-h-full flex items-center justify-center">
            <GameCard game={result.game} variant="xl" />
          </div>
        </motion.div>

        {/* Btn de relance */}
        <div className="shrink-0 w-full max-w-sm ">
          <Button
            onClick={onRePoll}
            icon={<RotateCw className="w-5 h-5 !border-dialog-text" />}
            variant="secondary"
            className="w-full mt-6 !border-dialog-text !text-dialog-text  hover:!bg-primary hover:!text-background hover:!border-primary"
          >
            Une autre idée ?
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
