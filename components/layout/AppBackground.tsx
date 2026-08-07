"use client";
import Image from "next/image";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function AppBackground() {
  const bgGame = useBackground();
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
        {bgGame.bgImage && (
          <motion.div
            key={bgGame.bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={bgGame.bgImage}
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
    </div>
  );
}
