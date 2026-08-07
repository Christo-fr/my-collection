"use client";

import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

// =========================================================================
// 1. LE TYPAGE (Le contrat d'échange)
// On décrit la forme exacte des données qui vont circuler sur le canal :
// - bgImage : l'URL textuelle de l'image (ou null si aucun fond spécifique)
// - setBgImage : la fonction pour changer cette URL
// =========================================================================
interface BackgroundContextType {
  bgImage: string | null;
  setBgImage: (url: string | null) => void;
}

// =========================================================================
// 2. CRÉATION DU CANAL ( createContex )
// On crée le canal de communication. Au départ, il est "undefined"
// car aucun composant ne diffuse encore dessus.
// =========================================================================
const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined,
);

// =========================================================================
// 3. LE PROVIDER (L'Émetteur)
// C'est un composant enveloppe qui entoure tout ton site (dans layout.tsx).
// Son rôle : contenir la VRAIE donnée (useState) et la diffuser vers le bas.
// =========================================================================
export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // L'état local React qui contient l'URL de l'image actuellement affichée.
  // Par défaut à 'null' (= fond light/dark standard).
  const [bgImage, setBgImage] = useState<string | null>(null);

  // Hook Next.js pour connaître la route actuelle (ex: "/game/12", "/list", etc.)
  const pathname = usePathname();

  // Nettoyage automatique :
  // À chaque changement de page, si l'URL NE commence PAS par "/game/",
  // on remet automatiquement le fond à null pour enlever l'image du jeu.
  useEffect(() => {
    if (!pathname?.startsWith("/game/")) {
      setBgImage(null);
    }
  }, [pathname]);

  // Optimisation mémoire (useMemo) :
  // On regroupe { bgImage, setBgImage } dans un seul objet.
  // 'useMemo' évite de re-créer cet objet en mémoire à chaque rendu du site,
  // sauf si l'image ou la fonction ont réellement changé.
  const gameBackground = useMemo(
    () => ({ bgImage, setBgImage }),
    [bgImage, setBgImage],
  );

  // On injecte notre objet 'gameBackground' dans le canal.
  // Tous les composants enfants contenus dans '{children}' y auront accès !
  return (
    <BackgroundContext.Provider value={gameBackground}>
      {children}
    </BackgroundContext.Provider>
  );
}

// =========================================================================
// 4. LE CUSTOM HOOK (Le Récepteur / La Prise de branchement)
// C'est la fonction pratique que tu vas appeler dans tes composants
// (ex: dans GameDetail ou AppBackground) pour te brancher sur le canal.
// =========================================================================
export function useBackground() {
  // 'useContext' va chercher le Provider le plus proche situé au-dessus dans l'arbre React
  const context = useContext(BackgroundContext);

  // Sécurité pour le dev : si tu appelles useBackground() dans un composant
  // qui n'est PAS emballé par le <BackgroundProvider>, on lève une erreur claire.
  if (!context) {
    throw new Error(
      "useBackground doit être utilisé à l'intérieur d'un BackgroundProvider",
    );
  }

  // Renvoie { bgImage, setBgImage } au composant qui a appelé l'outil
  return context;
}
