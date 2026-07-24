import { Game } from "@/types/game";
import Image from "next/image";
import ConsoleIcon from "./ConsoleIcon";

interface GameCardProps {
  game: Game;
  variant?: "default" | "xl";
}

export default function GameCard({ game, variant = "default" }: GameCardProps) {
  return (
    <div
      className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer select-none border border-black/10 transition-all duration-300 hover:scale-105 dark:border-white/10`}
    >
      <Image
        src={game.images.cover}
        alt={game.title}
        fill
        className="object-cover"
      />

      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md rounded-md px-2.5 py-1 font-bold text-white uppercase text-xs">
        <ConsoleIcon
          console={game.console}
          className="h-4 w-auto object-contain"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-3 pt-12 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black/95 dark:via-black/75 dark:to-transparent flex flex-col items-center text-center">
        {/* 1. Le Logo du jeu (dans sa div conteneur à hauteur fixe) */}
        {game.images.logo ? (
          <div className="relative flex items-end flex-auto mb-2">
            <img
              src={game.images.logo}
              alt={game.title}
              className={`object-contain w-full ${variant === "xl" ? "max-h-20" : "max-h-12"}`}
            />
          </div>
        ) : (
          <h3 className="font-bold text-sm line-clamp-2 mb-2">{game.title}</h3>
        )}

        {/* 2. Ligne 1 : Durée & Genre */}
        <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {game.estimatedPlaytime}h - {game.genre}
        </div>

        {/* 3. Ligne 2 : Note /10 (si elle existe) */}
        {game.review?.score !== undefined && (
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {game.review.score}/10
          </div>
        )}
      </div>
    </div>
  );
}
