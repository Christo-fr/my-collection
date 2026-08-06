"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useBackground } from "@/components/providers/BackgroundProvider";

export default function AppBackground() {
  const { bgImage } = useBackground();

  // On stocke l'image à afficher et sa visibilité
  const [displayedBg, setDisplayedBg] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (bgImage) {
      setDisplayedBg(bgImage);
      setIsVisible(false); // Réinitialise pour déclencher le fondu d'entrée à l'onLoad
    } else {
      setIsVisible(false); // Déclenche le fondu de sortie (opacity-0)
    }
  }, [bgImage]);

  // Quand le fondu de sortie (500ms) est fini, on nettoie le composant si bgImage est null
  const handleTransitionEnd = () => {
    if (!isVisible && !bgImage) {
      setDisplayedBg(null);
    }
  };

  return (
    <div className="fixed inset-0 -z-20 opacity-30 pointer-events-none">
      {/* 1. Fond Light mode */}
      <Image
        src="/background/bg-modelight.webp"
        alt="Background light"
        className="object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* 2. Fond Dark mode */}
      <Image
        src="/background/bg-modedark.webp"
        alt="Background dark"
        className="object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* 3. Image du jeu avec fondu entrée ET sortie */}
      {displayedBg && (
        <Image
          src={displayedBg}
          alt="Background jeu"
          fill
          priority
          quality={100}
          sizes="100vw"
          onLoad={() => setIsVisible(true)}
          onTransitionEnd={handleTransitionEnd}
          className={`object-cover transition-opacity duration-500 ease-in-out ${
            isVisible && bgImage ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
