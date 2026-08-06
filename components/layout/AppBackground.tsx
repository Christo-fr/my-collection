"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useBackground } from "@/components/providers/BackgroundProvider";

export default function AppBackground() {
  const { bgImage } = useBackground();

  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [pendingBg, setPendingBg] = useState<string | null>(null);
  const [isPendingLoaded, setIsPendingLoaded] = useState(false);

  useEffect(() => {
    if (bgImage && bgImage !== currentBg && bgImage !== pendingBg) {
      setPendingBg(bgImage);
      setIsPendingLoaded(false);
    }
  }, [bgImage, currentBg, pendingBg]);

  // Fin du fondu d'entrée du nouveau fond
  const handlePendingTransitionEnd = () => {
    if (isPendingLoaded && pendingBg) {
      setCurrentBg(pendingBg);
      setPendingBg(null);
      setIsPendingLoaded(false);
    }
  };

  // Fin du fondu de sortie quand on quitte la fiche jeu (bgImage === null)
  const handleCurrentTransitionEnd = () => {
    if (!bgImage && currentBg) {
      setCurrentBg(null);
    }
  };

  return (
    <div className="fixed inset-0 -z-20 opacity-30 pointer-events-none">
      {/* 1. Fond Light mode par défaut */}
      <Image
        src="/background/bg-modelight.webp"
        alt="Background light"
        className="object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* 2. Fond Dark mode par défaut */}
      <Image
        src="/background/bg-modedark.webp"
        alt="Background dark"
        className="object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* 3. Fond du jeu actuel (s'estompe vers opacity-0 si bgImage passe à null) */}
      {currentBg && (
        <Image
          src={currentBg}
          alt="Background jeu actuel"
          fill
          priority
          quality={100}
          sizes="100vw"
          onTransitionEnd={handleCurrentTransitionEnd}
          className={`object-cover transition-opacity duration-500 ease-in-out ${
            bgImage ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* 4. Nouveau fond du jeu en cours de chargement */}
      {pendingBg && (
        <Image
          src={pendingBg}
          alt="Background jeu suivant"
          fill
          priority
          quality={100}
          sizes="100vw"
          onLoad={() => setIsPendingLoaded(true)}
          onTransitionEnd={handlePendingTransitionEnd}
          className={`object-cover transition-opacity duration-500 ease-in-out ${
            isPendingLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
