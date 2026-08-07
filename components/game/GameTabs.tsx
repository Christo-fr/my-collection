import Image from "next/image";
import Link from "next/link";
import {
  Play,
  ShieldAlert,
  Timer,
  Languages,
  Gamepad2,
  CodeXml,
  CalendarDays,
  CalendarCheck,
  Award,
} from "lucide-react";

// Composants UI Globaux
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import ProgressBar from "@/components/ui/ProgressBar";

// Types & Utilitaires Métier
import { Game } from "@/types/game";
import { formatDate } from "@/features/game/gameUtils";

/**
 * Interface des Props de GameTabs
 * @param game Données complètes du jeu courant
 * @param relatedFranchiseGames Liste des jeux connexes de la même franchise
 * @param onOpenTrailer Fonction déclenchée pour ouvrir la modale vidéo
 */
interface GameTabsProps {
  game: Game;
  relatedFranchiseGames: Game[];
  onOpenTrailer: () => void;
}

/**
 * Composant GameTabs
 * Construit et structure les données du jeu sous forme d'onglets ("Informations" & "Avis")
 * à injecter dans le composant générique UI <Tabs />.
 */
export default function GameTabs({
  game,
  relatedFranchiseGames,
  onOpenTrailer,
}: GameTabsProps) {
  // =========================================================================
  // 1. CONFIGURATION DES ONGLETS
  // =========================================================================
  const tabs = [
    // -----------------------------------------------------------------------
    // Onglet 1 : Informations générales sur le jeu
    // -----------------------------------------------------------------------
    {
      label: "Informations",
      content: (
        <>
          {/* Grille des métadonnées du jeu (Développeur, Langue, Date, Genre, PEGI, Durée) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {game?.developer && (
              <div className="flex gap-2 items-center">
                <CodeXml className="w-5 h-5" />
                <span>{game.developer}</span>
              </div>
            )}

            {game?.language && (
              <div className="flex gap-2 items-center">
                <Languages className="w-5 h-5" />
                <span>{game.language}</span>
              </div>
            )}

            {game?.releaseDate && (
              <div className="flex gap-2 items-center">
                <CalendarDays className="w-5 h-5" />
                <span>{formatDate(game.releaseDate)}</span>
              </div>
            )}

            {game?.genre && (
              <div className="flex gap-2 items-center">
                <Gamepad2 className="w-5 h-5" />
                <span>{game.genre}</span>
              </div>
            )}

            {game?.pegi && (
              <div className="flex gap-2 items-center">
                <ShieldAlert className="w-5 h-5" />
                <span>PEGI {game.pegi}</span>
              </div>
            )}

            {game?.estimatedPlaytime && (
              <div className="flex gap-2 items-center">
                <Timer className="w-5 h-5" />
                <span>{game.estimatedPlaytime} h</span>
              </div>
            )}
          </div>

          {/* Description textuelle du jeu */}
          {game?.description && (
            <p className="mt-4 text-main/80 text-sm leading-relaxed">
              {game.description}
            </p>
          )}

          {/* Carousel / Grille "De la même série..." (Affiché uniquement si la franchise existe) */}
          {relatedFranchiseGames.length > 0 && (
            <div className="mt-4">
              <Heading as="h2" size="sm" className="mb-2">
                De la même série...
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {relatedFranchiseGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/game/${relatedGame.id}`}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative h-24">
                      <Image
                        src={relatedGame.images.logo}
                        alt={relatedGame.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // Onglet 2 : Avis & Critique (Conditonnnel : uniquement si le jeu a une note)
    // -----------------------------------------------------------------------
    ...(game?.review?.score
      ? [
          {
            label: "Avis",
            content: (
              <>
                {/* Statistiques d'accomplissement (Date de fin, Note, Temps passé) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {game.review.completedDate && (
                    <div className="flex gap-2 items-center">
                      <CalendarCheck className="w-5 h-5" />
                      <span>{formatDate(game.review.completedDate)}</span>
                    </div>
                  )}

                  {game.review.score && (
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        <span>{game.review.score} /10</span>
                        <span className="flex flex-auto gap-2">
                          <ProgressBar value={game.review.score * 10} />
                        </span>
                      </div>
                    </div>
                  )}

                  {game.review.playtime && (
                    <div className="flex gap-2 items-center">
                      <Timer className="w-5 h-5" />
                      <span>{game.review.playtime} h</span>
                    </div>
                  )}
                </div>

                {/* Listes comparatives : Points forts (+) et Points faibles (-) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {game.review.pros && (
                    <ul className="space-y-1">
                      {game.review.pros.map((pro, index) => (
                        <li
                          key={index}
                          className="text-main/80 text-sm flex gap-1"
                        >
                          <span className="text-main/60 shrink-0">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {game.review.cons && (
                    <ul className="space-y-1">
                      {game.review.cons.map((con, index) => (
                        <li
                          key={index}
                          className="text-main/80 text-sm flex gap-1"
                        >
                          <span className="text-main/60 shrink-0">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bilan récapitulatif */}
                {game.review.summary && (
                  <p className="mt-4 text-main/80 text-sm leading-relaxed">
                    {game.review.summary}
                  </p>
                )}
              </>
            ),
          },
        ]
      : []),
  ];

  // =========================================================================
  // 2. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <Tabs
      // Bouton "Trailer" optionnel injecté en haut à droite des onglets
      action={
        game.youtubeId && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Play className="w-5 h-5" />}
            onClick={onOpenTrailer}
          >
            Trailer
          </Button>
        )
      }
      items={tabs}
    />
  );
}
