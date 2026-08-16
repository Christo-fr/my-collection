import { RotateCw } from "lucide-react";

// Types

// Composants UI
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { useGames } from "@/features/game/useGames";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteDialog({ isOpen, onClose }: DeleteDialogProps) {
  const { games, filters } = useGames();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" centered>
      <div className="w-dvw h-full flex flex-col gap-4 items-center justify-between p-4 bg-gradient-to-r from-[var(--color-secondary)]  to-background">
        {/* En-tête : Titre et message alternatif */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col mb-4 shrink-0 gap-4">
            <Heading
              as="h2"
              size="lg"
              className="text-center !text-dialog-text"
            >
              Suppression
            </Heading>
            <p className="text-dialog-text text-center">
              Êtes-vous sûr de vouloir supprimer ce jeu de votre collection ?
            </p>
          </div>

          <div>
            {/* {game.images.logo && (
              <div className="relative items-start mb-2 h-32 w-full md:w-1/2 lg:flex-shrink-0">
                <Image
                  src={game.images.logo}
                  alt={game.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-contain object-center"
                />
              </div>
            )} */}
          </div>

          {/* Btn de relance */}
          <div className="flex items-center justify-between w-full max-w-sm gap-4">
            <Button
              icon={<RotateCw className="w-5 h-5 !border-dialog-text" />}
              variant="secondary"
              className="w-full mt-6 !text-dialog-text !border-dialog-text"
            >
              Une autre idée ?
            </Button>
            <Button
              icon={<RotateCw className="w-5 h-5 !border-dialog-text" />}
              variant="secondary"
              className="w-full mt-6 !text-dialog-text !border-dialog-text"
            >
              Une autre idée ?
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
