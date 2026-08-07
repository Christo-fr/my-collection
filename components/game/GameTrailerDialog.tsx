import Dialog from "@/components/ui/Dialog";

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
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Dialog>
  );
}
