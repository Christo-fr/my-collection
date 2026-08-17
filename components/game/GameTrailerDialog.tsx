import Dialog from "@/components/ui/Dialog";
import { motion } from "framer-motion";

interface GameTrailerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId?: string;
}

export default function GameTrailerDialog({
  onClose,
  youtubeId,
  isOpen,
}: GameTrailerDialogProps) {
  if (!youtubeId) return null; // Sécurité si aucun ID YouTube n'est fourni
  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-7xl" centered>
      {/* Zone centrale : Carte de jeu avec animation Framer Motion */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="relative flex-1 min-h-0 w-full flex items-center justify-center py-2 aspect-video rounded-xl shadow-2xl"
      >
        {/* Halo lumineux de rareté sous la carte */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.9, 0.3], scale: [0.5, 1.2, 1.05] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-grad-gacha-start/50 via-grad-gacha-via/50 to-grad-gacha-end/50 blur-2xl animate-pulse"
        />
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </Dialog>
  );
}
