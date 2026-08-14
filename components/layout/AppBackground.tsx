"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function AppBackground() {
  const bgGame = useBackground();
  // Couche réellement affichée : ne change qu'une fois la nouvelle image chargée (crossfade sans trou)
  const [current, setCurrent] = useState<string | null>(null);

  // Si on quitte une fiche jeu, on efface immédiatement (pas besoin d'attendre un chargement)
  useEffect(() => {
    if (!bgGame.bgImage) setCurrent(null);
  }, [bgGame.bgImage]);

  return (
    <div className="fixed inset-0 -z-20 opacity-30 pointer-events-none">
      <Image
        src="/background/bg-modelight.webp"
        alt="Background"
        className="object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
        priority
        quality={100}
        sizes="100vw"
        fill
      />
      <Image
        src="/background/bg-modedark.webp"
        alt="Background"
        className="object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
        priority
        quality={100}
        sizes="100vw"
        fill
      />
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
              className="object-cover opacity-100 "
              priority
              quality={100}
              sizes="100vw"
              fill
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Précharge la prochaine image en coulisses ; ne devient "current" qu'une fois prête */}
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
