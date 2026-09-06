import Dialog from "@/components/ui/Dialog";
import { motion } from "framer-motion";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Props contrôlant la visibilité, la fermeture et l'identifiant YouTube de la vidéo */
interface GameDetailTrailerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId?: string;
}

// =========================================================================
// 2. COMPOSANT MODALE
// =========================================================================
/** Dialog affichant le trailer officiel YouTube du jeu dans un lecteur iframe */
export default function GameDetailTrailerDialog({
  onClose,
  youtubeId,
  isOpen,
}: GameDetailTrailerDialogProps) {
  // Sécurité : bloque le rendu si aucun identifiant vidéo n'est fourni
  if (!youtubeId) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-7xl" centered>
      {/* Container animé légère au montage */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="relative flex-1 min-h-0 w-full flex items-center justify-center py-2 aspect-video rounded-xl shadow-2xl"
      >
        {/* Halo lumineux dégradé*/}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.9, 0.3], scale: [0.5, 1.2, 1.05] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-grad-gacha-start/50 via-grad-gacha-via/50 to-grad-gacha-end/50 blur-2xl animate-pulse"
        />

        {/* Intégration du lecteur vidéo YouTube responsive*/}
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
