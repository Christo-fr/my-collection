"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ParallaxImage } from "@/types/game";

export default function ParallaxCharacter({ image }: { image: ParallaxImage }) {
  // État local pour gérer l'apparition progressive au chargement de l'image
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Référence directe sur le nœud HTML pour muter le style CSS à 60 FPS sans déclencher de re-render React
  const characterRef = useRef<HTMLDivElement>(null);

  // 2. Stockage mutable de la position relative de la souris (normalisée de -1 à +1)
  const mousePos = useRef({ x: 0, y: 0 });

  // 3. Stockage mutable du facteur d'échelle cible pour l'Easter Egg (1 = 100%, 1.18 = 118%)
  const targetScale = useRef(1);

  useEffect(() => {
    // Variables locales pour accumuler le lissage d'interpolation (Lerp)
    let charX = 0;
    let charY = 0;
    let charScale = 1;
    let animationFrameId: number;

    // Moteur d'animation exécuté à la fréquence de rafraîchissement de l'écran (~60-144 FPS)
    const updateParallax = () => {
      // Calcul des positions cibles (amplitude max: 18px horizontal, 12px vertical)
      const targetX = mousePos.current.x * 18;
      const targetY = mousePos.current.y * 12;

      // Formule d'interpolation linéaire (Lerp) pour la fluidité des axes X et Y
      charX += (targetX - charX) * 0.05;
      charY += (targetY - charY) * 0.05;

      // Application du Lerp sur l'échelle (scale) pour l'effet ressort doux au clic
      charScale += (targetScale.current - charScale) * 0.12;

      // Si le "pop" a dépassé 114% de sa taille, on réinitialise la cible vers 1 (100%)
      if (targetScale.current > 1 && charScale > 1.14) {
        targetScale.current = 1;
      }

      // Application directe des transformations combinées dans le DOM via la ref
      if (characterRef.current) {
        characterRef.current.style.transform = `translate3d(${charX}px, ${charY}px, 0) scale(${charScale})`;
      }

      // Demande au navigateur d'exécuter la frame suivante
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    // Lancement de la boucle
    updateParallax();

    // Nettoyage impératif au démontage pour stopper la boucle RAF et libérer la mémoire GPU
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Déclenché uniquement lorsque la souris survole la zone du personnage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mousePos.current.x =
      (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    mousePos.current.y =
      (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  };

  // Easter Egg : Impulsion d'agrandissement au clic
  const handleClick = () => {
    targetScale.current = 1.18;
  };

  const isTruncated = image.truncated === true;

  return (
    <div
      ref={characterRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      /* Ajout de la transition d'opacité en 1s (duration-1000) */
      className={`relative w-full h-full will-change-transform hidden lg:block select-none transition-opacity duration-500 ease-in-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${
        isTruncated
          ? "absolute -bottom-10 right-0 flex items-end justify-end"
          : ""
      }`}
    >
      <Image
        src={image.url}
        alt="Parallax Character"
        fill
        sizes="50vw"
        priority
        quality={100}
        onLoad={() => setIsLoaded(true)}
        className={`object-contain pointer-events-none animate-[float_8s_ease-in-out_infinite] ${
          isTruncated ? "object-bottom translate-y-8" : "object-center"
        }`}
      />
    </div>
  );
}
