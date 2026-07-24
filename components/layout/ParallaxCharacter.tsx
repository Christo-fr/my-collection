"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ParallaxImage } from "@/types/game";

export default function ParallaxCharacter({ image }: { image: ParallaxImage }) {
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

      // Formule d'interpolation linéaire (Lerp) pour la fluidité des axes X et Y :
      // NouvellePosition = PositionActuelle + (PositionCible - PositionActuelle) * Coefficient
      charX += (targetX - charX) * 0.05;
      charY += (targetY - charY) * 0.05;

      // Application du Lerp sur l'échelle (scale) pour l'effet ressort doux au clic
      charScale += (targetScale.current - charScale) * 0.12;

      // Si le "pop" a dépassé 114% de sa taille, on réinitialise la cible vers 1 (100%)
      // Le Lerp ramènera automatiquement l'image à sa taille initiale sans coupure
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

    // Normalisation des coordonnées de la souris :
    // Centre du composant = (0, 0) | Coin haut-gauche = (-1, -1) | Coin bas-droit = (+1, +1)
    mousePos.current.x =
      (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    mousePos.current.y =
      (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  };

  // Easter Egg : Impulsion d'agrandissement au clic
  const handleClick = () => {
    targetScale.current = 1.18; // Rebond à 118% de la taille d'origine
  };

  const isTruncated = image.mode === "truncate";

  return (
    <div
      ref={characterRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      /*- isTruncated : décale l'ancrage (-bottom-10) pour enfouir la tranche inférieure sous le bord de l'écran*/
      className={`relative w-full h-full will-change-transform hidden md:block select-none ${
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
        className={`object-contain pointer-events-none animate-[float_8s_ease-in-out_infinite] ${
          isTruncated ? "object-bottom translate-y-8" : "object-center"
        }`}
      />
    </div>
  );
}
