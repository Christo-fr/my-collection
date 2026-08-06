"use client";
import { createContext, useState, useContext } from "react";

// 2. TYPAGE : On décrit la structure des données qui voyageront sur notre "canal".
interface BackgroundContextType {
  bgImage: string | null; // Soit l'URL de l'image (ex: "/covers/zelda.jpg"), soit null (fond par défaut)
  setBgImage: (url: string | null) => void; // La fonction qui permet de changer cette URL
}

// 3. CRÉATION DU CANAL : On crée le contexte. Au départ, il n'a pas de valeur (undefined).
const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined,
);

// 4. LE PROVIDER (L'Antenne Relais) : C'est le composant qui va englober notre site.
export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // On crée un état local React pour stocker l'URL actuelle.
  // Par défaut, l'image vaut null (ce qui signifie : afficher le fond par défaut).
  const [bgImage, setBgImage] = useState<string | null>(null);

  return (
    // On met à disposition 'bgImage' et 'setBgImage' à TOUS les enfants situés à l'intérieur.
    <BackgroundContext.Provider value={{ bgImage, setBgImage }}>
      {children}
    </BackgroundContext.Provider>
  );
}

// 5. LE CUSTOM HOOK (Le Récepteur) : Une petite fonction pratique pour nos composants.
export function useBackground() {
  const context = useContext(BackgroundContext);

  // Sécurité : Si un composant essaie d'utiliser useBackground() alors qu'il n'est pas dans le Provider, on prévient le dev.
  if (!context) {
    throw new Error(
      "useBackground doit être utilisé dans un BackgroundProvider",
    );
  }

  return context; // Renvoie { bgImage, setBgImage }
}
