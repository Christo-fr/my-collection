"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Game } from "@/types/game";

// =========================================================================
// 1. LE TYPAGE (Le contrat d'échange)
// On décrit la forme exacte des données du catalogue qui vont circuler :
// - games : la liste de tous les jeux en mémoire
// - loading : l'indicateur de chargement de l'API
// - refetchGames : la fonction pour recharger la liste depuis le serveur
// - getGameById : l'outil de recherche synchrone par ID
// =========================================================================
export interface GamesContextType {
  games: Game[];
  loading: boolean;
  refetchGames: () => Promise<void>;
  getGameById: (id: number) => Game | undefined;
}

// =========================================================================
// 2. CRÉATION DU CANAL (createContext)
// On crée le canal de communication. Au départ, il est "undefined"
// car aucun composant ne diffuse encore dessus.
// =========================================================================
const GamesContext = createContext<GamesContextType | undefined>(undefined);

// =========================================================================
// 3. LE PROVIDER (L'Émetteur)
// C'est le composant enveloppe qui entoure l'application dans layout.tsx.
// Son rôle : charger la liste via l'API, la garder en mémoire (useState)
// et la distribuer à tous ses composants enfants.
// =========================================================================
export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Appel API pour récupérer les jeux.
  // useCallback évite de re-créer cette fonction à chaque rendu.
  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const reponse = await fetch("/api/games");
      const data: Game[] = await reponse.json();
      setGames(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Déclenchement automatique du premier chargement au montage du Provider
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Recherche directe dans le tableau `games` déjà stocké en mémoire RAM
  const getGameById = useCallback(
    (id: number) => {
      return games.find((game) => game.id === id);
    },
    [games],
  );

  // On injecte les données et les fonctions dans le canal.
  // Tous les composants enfants contenus dans '{children}' y auront accès !
  return (
    <GamesContext.Provider
      value={{
        games,
        loading,
        refetchGames: fetchGames,
        getGameById,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

// =========================================================================
// 4. LE CUSTOM HOOK (Le Récepteur / La Prise de branchement)
// C'est la fonction pratique à appeler dans tes composants
// (ex: dans la grille de jeux ou la page détail) pour te brancher au canal.
// =========================================================================
export function useGamesContext() {
  // 'useContext' va chercher le Provider le plus proche situé au-dessus dans l'arbre React
  const context = useContext(GamesContext);

  // Sécurité dev : si useGamesContext() est appelé dans un composant
  // qui n'est PAS emballé par le <GamesProvider>, on lève une erreur claire.
  if (!context) {
    throw new Error(
      "useGamesContext doit être utilisé à l'intérieur d'un GamesProvider",
    );
  }

  // Renvoie { games, loading, refetchGames, getGameById } au composant
  return context;
}
