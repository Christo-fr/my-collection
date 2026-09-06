"use client";
import { useState } from "react";
import { Game } from "@/types/game";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { File, Pencil, X, Check } from "lucide-react";
import AdminDeleteDialog from "@/features/admin-delete-game/components/AdminDeleteDialog";
interface AdminGameCardProps {
  game: Game;
  priority?: boolean;
}

export default function AdminGameCard({ game, priority }: AdminGameCardProps) {
  // State local pour valider le Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-between w-full min-h-20 py-2 rounded-xl overflow-hidden border border-main/10 bg-background/20 backdrop-blur-sm select-none transition-shadow duration-300 hover:shadow-[0_0_15px_2px_var(--color-secondary)]">
        {/* COUCHE 1 : Arrière-plan fondu (Couverture) */}
        <div
          className="absolute top-0 left-0 w-[60%] md:w-[40%] h-full z-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to right, black 15%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, black 15%, transparent 100%)",
          }}
        >
          <Image
            src={game.images.cover}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 60vw, 50vw"
            quality={80}
            className={`object-cover object-left transition-opacity duration-500 ease-out ${
              coverLoaded ? "opacity-50" : "opacity-0"
            }`}
            priority={priority}
            onLoad={() => setCoverLoaded(true)}
          />
        </div>
        {/* COUCHE 2 : Contenu (Logo, Titre, Actions) */}
        <div className="relative z-10 flex flex-row items-center justify-between w-full h-full px-3 gap-2">
          {/* Bloc Gauche : Logo + Titre */}
          <div className="flex flex-row items-center gap-2 sm:gap-4 min-w-0 pr-2">
            {game.images.logo && (
              <div className="relative w-26 h-16 sm:w-36 shrink-0 drop-shadow-md">
                <Image
                  src={game.images.logo}
                  alt={game.title}
                  fill
                  sizes="(max-width: 640px) 80px, 112px"
                  className={`object-contain object-center transition-opacity duration-500 ease-out ${
                    logoLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            )}

            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-main drop-shadow-md hidden sm:block">
                {game.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1 text-main text-xs sm:text-sm font-medium">
                {game.estimatedPlaytime}h • {game.genre}
                {game.review?.score && (
                  <div className="flex items-center gap-1 text-main font-bold mt-0.5">
                    (<Check className="h-4 w-4" />
                    {game.review.playtime}h • {game.review.score}/10)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bloc Droite : Les 3 boutons */}
          <div className="flex flex-row shrink-0 items-center gap-1.5 sm:gap-2">
            <Button variant="secondary" href={`/game/${game.id}`} size="sm">
              <File className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              href={`/administration/edit/${game.id}`}
              size="sm"
              title={`Modifier ${game.title}`}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              title={`Supprimer ${game.title}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <AdminDeleteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        game={game}
      ></AdminDeleteDialog>
    </>
  );
}
