import { RotateCw } from "lucide-react";

// Types

// Composants UI
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Image from "next/image";
import { Game } from "@/types/game";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game; // Ajout de la propriété game pour passer le jeu à supprimer
}

export default function DeleteDialog({
  isOpen,
  onClose,
  game,
}: DeleteDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-full" centered>
      <div className="w-full  h-full flex flex-col gap-4 items-center justify-between p-4 bg-gradient-to-r from-[var(--color-secondary)]  to-background">
        {/* En-tête : Titre et message alternatif */}

        <div className="flex flex-col mb-4 shrink-0">
          <Heading as="h2" size="lg" className="text-center !text-dialog-text">
            Suppression : {game.title}
          </Heading>
          <p className="text-dialog-text text-center">
            Êtes-vous sûr de vouloir supprimer ce jeu de votre collection ?
          </p>
        </div>

        {game.images.logo && (
          <div className="relative items-start mb-2 h-32 w-full">
            <Image
              src={game.images.logo}
              alt={game.title}
              fill
              className="object-contain object-center"
              quality={95}
              priority
            />
          </div>
        )}

        {/* Btn de relance */}
        <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto">
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={onClose}
              icon={<RotateCw className="w-5 h-5 !border-dialog-text" />}
              variant="secondary"
              className="mt-6 !text-dialog-text !border-dialog-text"
            >
              Retour
            </Button>
            <Button
              icon={<RotateCw className="w-5 h-5 !border-dialog-text" />}
              variant="secondary"
              className="mt-6 !text-dialog-text !border-dialog-text"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
