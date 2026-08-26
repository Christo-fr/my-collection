"use client";

import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Contrat d'interface définissant l'état d'image de fond globale et sa fonction de mise à jour */
interface BackgroundContextType {
  bgImage: string | null;
  setBgImage: (url: string | null) => void;
}

// =========================================================================
// 2. CRÉATION DU CANAL
// =========================================================================
// Canal de communication global pour le fond de page (non initialisé par défaut)
const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined,
);

// =========================================================================
// 3. COMPOSANT PROVIDER
// =========================================================================
/** Provider enveloppant l'application pour gérer dynamiquement l'image d'arrière-plan */
export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Stocke l'URL de l'image de fond courante (null par défaut pour afficher le thème standard)
  const [bgImage, setBgImage] = useState<string | null>(null);

  // Extrait le chemin d'accès de l'URL actuelle
  const pathname = usePathname();

  // Remet automatiquement le fond par défaut si l'utilisateur quitte la section /game/
  useEffect(() => {
    if (!pathname?.startsWith("/game/")) {
      setBgImage(null);
    }
  }, [pathname]);

  // Mémoïse l'objet de contexte pour préserver sa référence mémoire lors des re-rendus
  const gameBackground = useMemo(
    () => ({ bgImage, setBgImage }),
    [bgImage, setBgImage],
  );

  return (
    <BackgroundContext.Provider value={gameBackground}>
      {children}
    </BackgroundContext.Provider>
  );
}

// =========================================================================
// 4. CUSTOM HOOK
// =========================================================================
/** Hook consommateur permettant aux composants de lire ou modifier l'image de fond */
export function useBackground() {
  const context = useContext(BackgroundContext);

  if (!context) {
    throw new Error(
      "useBackground doit être utilisé à l'intérieur d'un BackgroundProvider",
    );
  }

  return context;
}
