"use client";

import { useState } from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import Image from "next/image";
import ConsoleIcon from "./GameConsoleIcon";
import { Check } from "lucide-react";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Props configurant les données du jeu, la variante d'affichage et la priorité de chargement */
interface GameCardProps {
  game: Game;
  variant?: "default" | "xl";
  priority?: boolean;
}

// =========================================================================
// 2. COMPOSANT & LOGIQUE DE RENDU
// =========================================================================
/** Composant UI affichant une carte dynamique de jeu avec fondu d'images et données de complétion */
export default function GameCard({
  game,
  variant = "default",
  priority = false,
}: GameCardProps) {
  // États locaux gérant le fondu d'apparition de la jaquette et du logo au chargement
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    // Carte cliquable vers la page de détail dynamique /game/[id]
    <Link
      href={`/game/${game.id}`}
      className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer select-none border border-main/10 transition duration-300 hover:scale-105 hover:shadow-[0_0_15px_2px_var(--color-secondary)]`}
      title={game.title}
    >
      {/* Affichage en impulsion affiché avant le rendu complet de l'image */}
      <div className="absolute inset-0 -z-10 animate-pulse bg-main/10" />

      {/* Image de jaquette optimisée Next.js avec transition d'opacité*/}
      <Image
        src={game.images.cover}
        alt={game.title}
        fill
        sizes={
          variant === "xl"
            ? "680px"
            : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        }
        quality={variant === "xl" ? 100 : 80}
        className={`object-cover transition-opacity duration-500 ease-out ${
          coverLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority={variant === "xl" || priority}
        onLoad={() => setCoverLoaded(true)}
      />

      {/* Badge affichant le logo de la console*/}
      <div className="absolute top-2.5 left-2.5 bg-background/20 backdrop-blur-sm rounded-md p-1 font-bold text-main uppercase text-xs">
        <ConsoleIcon
          console={game.console}
          className={` ${variant === "xl" ? "h-5 text-[20px]" : "h-2.5 text-[10px]"} w-auto object-contain`}
        />
      </div>

      {/* Calque en dégradé d'arrière-plan */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center z-10 p-3 pt-12 bg-gradient-to-t from-background via-background/60 to-transparent">
        {/* Rendu conditionnel du logo du jeu ou texte sur le titre */}
        {game.images.logo ? (
          <div
            className={`relative w-full mb-2 ${variant === "xl" ? "h-50" : "h-19"}`}
          >
            <Image
              src={game.images.logo}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className={`object-contain transition-opacity duration-500 ease-out ${
                logoLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLogoLoaded(true)}
            />
          </div>
        ) : (
          <h3 className="font-bold text-sm line-clamp-2 mb-2">{game.title}</h3>
        )}

        {/* Affiche la durée estimée et le genre principal du jeu */}
        <div
          className={` ${variant === "xl" ? "text-md" : "text-sm"} text-main w-full truncate font-medium`}
        >
          {game.estimatedPlaytime}h • {game.genre}
        </div>

        {/* Rendu conditionnel de la note attribuée */}
        {game.review?.score ? (
          <div
            className={` ${variant === "xl" ? "text-md" : "text-sm"} flex items-center gap-1 text-main font-bold mt-0.5`}
          >
            <Check className={` ${variant === "xl" ? "h-5 w-5" : "h-4 w-4"}`} />
            {game.review.playtime}h • {game.review.score}/10
          </div>
        ) : (
          <div
            className={` ${variant === "xl" ? "text-md" : "text-sm"} font-bold mt-0.5 opacity-0 select-none`}
            aria-hidden="true"
          >
            /10
          </div>
        )}
      </div>
    </Link>
  );
}
