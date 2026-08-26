"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { motion, AnimatePresence } from "framer-motion";

// =========================================================================
// 1. COMPOSANT D'ARRIÈRE-PLAN GLOBAL
// =========================================================================
/** Gère les fonds d'écran dynamiques, le changement de thème et le préchargement transparent */
export default function AppBackground() {
  // Lit l'URL de l'image de jeu diffusée par le BackgroundProvider
  const bgGame = useBackground();

  // Conserve l'image actuellement affichée au premier plan pour orchestrer le fondu
  const [current, setCurrent] = useState<string | null>(null);

  // Lit la route active pour ajuster l'opacité selon le contexte de navigation
  const pathname = usePathname();

  // Atténue l'opacité d'arrière-plan sur les pages correspondant à l'admin et au login
  const isDimmedRoute =
    pathname === "/login" || pathname?.startsWith("/administration");

  // Re-initialise le fond courant à null dès que le Provider retire l'image
  useEffect(() => {
    if (!bgGame.bgImage) setCurrent(null);
  }, [bgGame.bgImage]);

  return (
    <div
      className={`fixed inset-0 -z-20 pointer-events-none transition-opacity duration-500 ${
        isDimmedRoute ? "opacity-15" : "opacity-30"
      }`}
    >
      {/* background thème clair */}
      <Image
        src="/background/bg-modelight.webp"
        alt="Background"
        className="object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* Background thème sombre */}
      <Image
        src="/background/bg-modedark.webp"
        alt="Background"
        className="object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
        priority
        quality={100}
        sizes="100vw"
        fill
      />

      {/* Anime l'apparition et la disparition du fond personnalisé du jeu */}
      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt="Background"
              className="object-cover opacity-100"
              priority
              quality={100}
              sizes="100vw"
              fill
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone de préchargement masquée pour télécharger l'image avant l'animation */}
      {bgGame.bgImage && bgGame.bgImage !== current && (
        <div
          className="absolute inset-0 opacity-0 pointer-events-none"
          aria-hidden
        >
          <Image
            key={bgGame.bgImage}
            src={bgGame.bgImage}
            alt=""
            fill
            sizes="100vw"
            quality={100}
            priority
            onLoad={() => setCurrent(bgGame.bgImage)}
          />
        </div>
      )}
    </div>
  );
}
