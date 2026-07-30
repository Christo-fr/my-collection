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
      className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer select-none border border-main/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_2px_var(--color-secondary)]`}
    >
      <Image
        src={game.images.cover}
        alt={game.title}
        fill
        sizes={
          variant === "xl"
            ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
            : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        }
        quality={variant === "xl" ? 90 : 80}
        className="object-cover"
      />

      {/* Pill Console */}
      <div className="absolute top-2.5 left-2.5 bg-background/20 backdrop-blur-sm rounded-md p-1 font-bold text-main uppercase text-xs">
        <ConsoleIcon
          console={game.console}
          className="h-3 w-auto object-contain"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center z-10 p-3 pt-12 bg-gradient-to-t from-background via-background/80 to-transparent  ">
        {/* 1. Le Logo du jeu */}
        {game.images.logo ? (
          <div
            className={`relative w-full mb-2 ${variant === "xl" ? "h-50" : "h-19"}`}
          >
            <Image
              src={game.images.logo}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-contain"
            />
          </div>
        ) : (
          <h3 className="font-bold text-sm line-clamp-2 mb-2">{game.title}</h3>
        )}

        {/* 2. Durée & Genre */}
        <div className="text-sm text-main w-full truncate font-medium">
          {game.estimatedPlaytime}h • {game.genre}
        </div>

        {/* 3. Note /10*/}
        {game.review?.score ? (
          <div className="text-sm text-main font-bold mt-0.5">
            {game.review.score}/10
          </div>
        ) : (
          <div
            className="text-sm font-bold mt-0.5 opacity-0 select-none"
            aria-hidden="true"
          >
            /10
          </div>
        )}
      </div>
    </div>
  );
}
