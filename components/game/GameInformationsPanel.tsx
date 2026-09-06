import Image from "next/image";
import Link from "next/link";
import {
  ShieldAlert,
  Timer,
  Languages,
  Gamepad2,
  CodeXml,
  CalendarDays,
} from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Game } from "@/types/game";
import { formatDate } from "@/utils/game/gameUtils";

interface GameInformationsPanelProps {
  game: Game;
  relatedFranchiseGames: Game[];
}

export default function GameInformationsPanel({
  game,
  relatedFranchiseGames,
}: GameInformationsPanelProps) {
  return (
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
          <div className="flex gap-2 items-center" title="Classification PEGI">
            <ShieldAlert className="w-5 h-5" />
            <span>PEGI {game.pegi}</span>
          </div>
        )}

        {game?.estimatedPlaytime && (
          <div className="flex gap-2 items-center" title="Temps de jeu estimé">
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
  );
}
