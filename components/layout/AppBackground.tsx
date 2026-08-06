"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useBackground } from "@/components/providers/BackgroundProvider";

export default function AppBackground() {
  const { bgImage } = useBackground();
  const pathname = usePathname();

  // Actif uniquement sur les fiches jeux (/game/...)
  const isGamePage = pathname?.startsWith("/game/");
  const targetImage = isGamePage ? bgImage : null;

  // Calque principal (display) et calque entrant (incoming)
  const [displayBg, setDisplayBg] = useState<string | null>(null);
  const [incomingBg, setIncomingBg] = useState<string | null>(null);
  const [isIncomingLoaded, setIsIncomingLoaded] = useState(false);

  useEffect(() => {
    // Cas 1 : Arrivée d'une nouvelle image de jeu
    if (
      targetImage &&
      targetImage !== displayBg &&
      targetImage !== incomingBg
    ) {
      setIncomingBg(targetImage);
      setIsIncomingLoaded(false);
    }
    // Cas 2 : Sortie de la fiche jeu (retour vers /list, etc.)
    else if (!targetImage && (displayBg || incomingBg)) {
      setIncomingBg(null);
      setIsIncomingLoaded(false);
    }
  }, [targetImage, displayBg, incomingBg]);

  // Image suivante chargée par le navigateur
  const handleIncomingLoad = () => {
    setIsIncomingLoaded(true);
  };

  // Fin du fondu d'entrée : la nouvelle image devient l'image principale
  const handleIncomingTransitionEnd = () => {
    if (incomingBg && isIncomingLoaded) {
      setDisplayBg(incomingBg);
      setIncomingBg(null);
      setIsIncomingLoaded(false);
    }
  };

  // Fin du fondu de sortie vers la liste
  const handleDisplayTransitionEnd = () => {
    if (!targetImage) {
      setDisplayBg(null);
    }
  };

  return (
    <div className="fixed inset-0 -z-20 opacity-30 pointer-events-none">
      {/* 1. Fonds Light / Dark par défaut */}
      <Image
        src="/background/bg-modelight.webp"
        alt="Background light"
        className="object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
        priority
        quality={100}
        sizes="100vw"
        fill
      />
      <Image
        src="/background/bg-modedark.webp"
        alt="Background dark"
        className="object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* 2. Image de fond actuelle (reste affichée pendant le fetch) */}
      {displayBg && (
        <Image
          key={`display-${displayBg}`}
          src={displayBg}
          alt="Background jeu"
          fill
          priority
          quality={100}
          sizes="100vw"
          onTransitionEnd={handleDisplayTransitionEnd}
          className={`object-cover transition-opacity duration-500 ease-in-out ${
            targetImage ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* 3. Nouvelle image qui apparaît en fondu doux par-dessus */}
      {incomingBg && (
        <Image
          key={`incoming-${incomingBg}`}
          src={incomingBg}
          alt="Background jeu suivant"
          fill
          priority
          quality={100}
          sizes="100vw"
          onLoad={handleIncomingLoad}
          onTransitionEnd={handleIncomingTransitionEnd}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            isIncomingLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
