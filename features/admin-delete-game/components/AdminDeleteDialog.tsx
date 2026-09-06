// Composants UI
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Image from "next/image";
import { LoaderCircle, Undo2, X } from "lucide-react";
import { Game } from "@/types/game";
import { useAdminDeleteGame } from "@/features/admin-delete-game/hooks/useAdminDeleteGame";
import FormError from "@/components/ui/FormError";

interface AdminDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game; // Ajout de la propriété game pour passer le jeu à supprimer
}

export default function AdminDeleteDialog({
  isOpen,
  onClose,
  game,
}: AdminDeleteDialogProps) {
  const { deleteGame, isDeleting, error } = useAdminDeleteGame();

  const handleDelete = async () => {
    const success = await deleteGame(game);
    if (success) {
      onClose(); // Ferme la modale si la suppression est réussie
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-full" centered>
      <div className="w-full  h-full flex flex-col gap-4 items-center justify-between p-4 bg-gradient-to-r from-[var(--color-secondary)]  to-background">
        {/* En-tête : Titre et message alternatif */}

        <div className="flex flex-col mb-4 shrink-0">
          <Heading as="h2" size="lg" className="text-center text-main">
            Suppression : {game.title}
          </Heading>
          <p className=" text-center text-main">
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
          {error && <FormError message={error} />}
          <div className="flex items-center justify-between w-full mt-6">
            <Button
              onClick={onClose}
              icon={<Undo2 className="w-5 h-5 " />}
              variant="secondary"
              disabled={isDeleting}
            >
              Retour
            </Button>
            <Button
              onClick={handleDelete}
              icon={
                isDeleting ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  <X className="w-5 h-5 " />
                )
              }
              variant="secondary"
              disabled={isDeleting}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
