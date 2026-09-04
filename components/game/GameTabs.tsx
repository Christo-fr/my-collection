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
import { formatDate } from "@/utils/game/gameUtils";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Props injectant le jeu actif, les opus connexes de la saga et la fonction de déclenchement du trailer */
interface GameTabsProps {
  game: Game;
  relatedFranchiseGames: Game[];
  onOpenTrailer: () => void;
}

// =========================================================================
// 2. COMPOSANT & STRUCTURATION DES ONGLETS
// =========================================================================
/** Construit dynamiquement les structures JSX des onglets d'informations et d'avis pour le composant Tabs */
export default function GameTabs({
  game,
  relatedFranchiseGames,
  onOpenTrailer,
}: GameTabsProps) {
  // Définition du tableau des onglets injectés dans le composant d'affichage
  const tabs = [
    // -----------------------------------------------------------------------
    // Onglet 1 : Informations générales sur le jeu
    // -----------------------------------------------------------------------
    {
      label: "Informations",
      content: (
        <>
          {/* Métadonnées du jeu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {game?.developer && (
              <div className="flex gap-2 items-center" title="Développeur">
                <CodeXml className="w-5 h-5" />
                <span>{game.developer}</span>
              </div>
            )}

            {game?.language && (
              <div className="flex gap-2 items-center" title="Langue & voix">
                <Languages className="w-5 h-5" />
                <span>{game.language}</span>
              </div>
            )}

            {game?.releaseDate && (
              <div className="flex gap-2 items-center" title="Date de sortie">
                <CalendarDays className="w-5 h-5" />
                <span>{formatDate(game.releaseDate)}</span>
              </div>
            )}

            {game?.genre && (
              <div className="flex gap-2 items-center" title="Genre">
                <Gamepad2 className="w-5 h-5" />
                <span>{game.genre}</span>
              </div>
            )}

            {game?.pegi && (
              <div
                className="flex gap-2 items-center"
                title="Classification PEGI"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>PEGI {game.pegi}</span>
              </div>
            )}

            {game?.estimatedPlaytime && (
              <div
                className="flex gap-2 items-center"
                title="Temps de jeu estimé"
              >
                <Timer className="w-5 h-5" />
                <span>{game.estimatedPlaytime} h</span>
              </div>
            )}
          </div>

          {/* Synopsis */}
          {game?.description && (
            <p className="mt-4 whitespace-pre-line text-main/90 dark:text-main/80 text-sm leading-relaxed">
              {game.description}
            </p>
          )}

          {/* Propose 3 opus max de la même franchise */}
          {relatedFranchiseGames.length > 0 && (
            <div className="mt-4">
              <Heading as="h2" size="sm" className="mb-2">
                De la même série...
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {relatedFranchiseGames.map((relatedGame) => (
                  <Link
                    title={relatedGame.title}
                    key={relatedGame.id}
                    href={`/game/${relatedGame.id}`}
                    className="transition-transform duration-300 hover:scale-105"
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
    // Onglet 2 : Avis
    // -----------------------------------------------------------------------
    //injecte l'onglet « Avis » uniquement s'il existe, sans insérer d'élément null ou undefined
    ...(game?.review?.score
      ? [
          {
            label: "Avis",
            content: (
              <>
                {/* Statistiques de complétion */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {game.review.completedDate && (
                    <div
                      className="flex gap-2 items-center"
                      title="Date de complétion"
                    >
                      <CalendarCheck className="w-5 h-5" />
                      <span>{formatDate(game.review.completedDate)}</span>
                    </div>
                  )}

                  {game.review.score && (
                    <div className="col-span-2">
                      <div
                        className="flex items-center gap-2"
                        title="Note du jeu"
                      >
                        <Award className="w-5 h-5" />
                        <span>{game.review.score} /10</span>
                        <span className="flex flex-auto gap-2">
                          <ProgressBar value={game.review.score * 10} />
                        </span>
                      </div>
                    </div>
                  )}

                  {game.review.playtime && (
                    <div
                      className="flex gap-2 items-center"
                      title="Temps de jeu"
                    >
                      <Timer className="w-5 h-5" />
                      <span>{game.review.playtime} h</span>
                    </div>
                  )}
                </div>

                {/* Listes des points forts et des points faibles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {game.review.pros && (
                    <ul className="space-y-1">
                      {game.review.pros.map((pro, index) => (
                        <li
                          key={index}
                          className="text-main/90 dark:text-main/80 text-sm flex gap-1"
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
                          className="text-main/90 dark:text-main/80 text-sm flex gap-1"
                        >
                          <span className="text-main/60 shrink-0">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bilan de la critique */}
                {game.review.summary && (
                  <p className="mt-4 whitespace-pre-line text-main/90 dark:text-main/80 text-sm leading-relaxed">
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
  // 3. RENDU DU COMPOSANT GÉNÉRIQUE TABS
  // =========================================================================
  return (
    <Tabs
      className="pt-4"
      // Btn trailer si l'ID Youtube est présent
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
