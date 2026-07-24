"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ParallaxImage } from "@/types/game";

/**
 * Composant ParallaxCharacter
 * Affiche l'illustration d'un personnage avec :
 * 1. Un effet d'inertie en parallaxe (Lerp) réagissant au survol de la souris.
 * 2. Un flottement continu en CSS (animate-float).
 * 3. Une gestion adaptative du rendu (mode tronqué / plein pied).
 */
export default function ParallaxCharacter({ image }: { image: ParallaxImage }) {
  // 1. Référence directe sur la div conteneur pour appliquer le style CSS sans re-render React (60 FPS)
  const characterRef = useRef<HTMLDivElement>(null);

  // 2. Stockage mutable de la position normalisée de la souris (-1 à +1)
  // Utiliser useRef évite d'avoir à redéclencher le cycle de rendu React à chaque mouvement
  const mousePos = useRef({ x: 0, y: 0 });

  // Boucle d'animation à 60 FPS synchronisée avec le navigateur
  useEffect(() => {
    let charX = 0;
    let charY = 0;
    let animationFrameId: number;

    // Fonction d'animation exécutée à chaque rafraîchissement d'écran via requestAnimationFrame
    const updateParallax = () => {
      // Amplitude maximale du déplacement en pixels (18px horizontal, 12px vertical)
      const targetX = mousePos.current.x * 18;
      const targetY = mousePos.current.y * 12;

      // Formule d'interpolation linéaire (Lerp) pour la fluidité / l'inertie
      // (0.08 représente le coefficient de lissage)
      charX += (targetX - charX) * 0.08;
      charY += (targetY - charY) * 0.08;

      // Injection directe du style transform dans le DOM via la ref
      if (characterRef.current) {
        characterRef.current.style.transform = `translate3d(${charX}px, ${charY}px, 0)`;
      }

      // Planification de la prochaine frame d'animation
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    // Démarrage initial de la boucle
    updateParallax();

    // Nettoyage au démontage du composant pour éviter les fuites de mémoire
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Calcul de la position de la souris uniquement au survol du conteneur du personnage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Convertit les coordonnées pixel de la souris en une valeur normalisée de -1 à +1 par rapport au centre de l'élément
    mousePos.current.x =
      (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    mousePos.current.y =
      (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  };

  // Détermine si l'image possède un bas tronqué nécessitant un ancrage spécifique
  const isTruncated = image.mode === "truncate";

  return (
    <div
      ref={characterRef}
      onMouseMove={handleMouseMove}
      /*
        Explication des classes du conteneur :
        - relative w-full h-full : occupe tout l'espace disponible du conteneur parent
        - will-change-transform : optimise les performances en déclenchant l'accélération matérielle (GPU)
        - hidden lg:block : masque le personnage sur mobile/tablette pour préserver la lisibilité
        - isTruncated : ancre la div sous le bas de l'écran (-bottom-10) pour dissimuler la ligne de coupe
      */
      className={`relative w-full h-full will-change-transform hidden lg:block ${
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
        /*
          Explication des classes de l'image :
          - object-contain : conserve le ratio de l'illustration sans la déformer
          - pointer-events-none : empêche l'image de bloquer les clics de la souris
          - animate-float : applique le flottement vertical infini défini dans globals.css
          - object-bottom / translate-y-8 : enfonce l'image pour que la tranche reste masquée même en flottant
        */
        className={`object-contain pointer-events-none animate-float ${
          isTruncated ? "object-bottom translate-y-8" : "object-center"
        }`}
      />
    </div>
  );
}
