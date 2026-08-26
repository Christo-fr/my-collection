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
import { Console } from "@/types/console";

// =========================================================================
// 1. LE TYPAGE (Le contrat d'échange)
// - games : la liste de tous les jeux en mémoire
// - loading : l'indicateur de chargement de l'API
// - refetchGames : la fonction pour recharger la liste depuis le serveur
// - getGameById : l'outil de recherche synchrone par ID
// =========================================================================
export interface GamesContextType {
  games: Game[];
  loading: boolean;
  refetchGames: () => Promise<void>;
  refetchConsoles: () => Promise<void>;
  consoles: Console[];
  getGameById: (id: number) => Game | undefined;
}

// =========================================================================
// 2. CRÉATION DU CANAL (Context React)
// =========================================================================
// Initialisation du canal de communication React (non défini par défaut)
const GamesContext = createContext<GamesContextType | undefined>(undefined);

// =========================================================================
// 3. COMPOSANT PROVIDER (Émetteur de données)
// =========================================================================
/** Composant conteneur chargé de récupérer, stocker et distribuer les jeux et consoles */
export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [loadingGames, setLoadingGames] = useState<boolean>(true);
  const [loadingConsoles, setLoadingConsoles] = useState<boolean>(true);

  // Exécute la requête HTTP pour récupérer tous les jeux et met à jour le state
  // useCallback évite de re-créer cette fonction à chaque rendu.
  const fetchGames = useCallback(async () => {
    try {
      setLoadingGames(true);
      const reponse = await fetch("/api/games");
      const data: Game[] = await reponse.json();
      setGames(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error);
    } finally {
      setLoadingGames(false);
    }
  }, []);

  // Exécute la requête HTTP pour récupérer toutes les consoles et met à jour le state
  const fetchConsoles = useCallback(async () => {
    try {
      setLoadingConsoles(true);
      const reponse = await fetch("/api/consoles");
      const data = await reponse.json();
      setConsoles(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des consoles :", error);
    } finally {
      setLoadingConsoles(false);
    }
  }, []);

  // Déclenche le chargement initial des données au premier montage du composant
  useEffect(() => {
    fetchGames();
    fetchConsoles();
  }, [fetchGames, fetchConsoles]);

  // Recherche synchrone d'un jeu par son identifiant directement dans le tableau en mémoire
  const getGameById = useCallback(
    (id: number) => {
      return games.find((game) => game.id === id);
    },
    [games],
  );

  // Injection des données et fonctions d'action dans le canal React
  return (
    <GamesContext.Provider
      value={{
        games,
        consoles,
        loading: loadingGames || loadingConsoles,
        refetchGames: fetchGames,
        refetchConsoles: fetchConsoles,
        getGameById,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

// =========================================================================
// 4. CUSTOM HOOK (Récepteur)
// =========================================================================
/** Hook consommateur permettant aux composants enfants d'accéder au GamesContext */
export function useGamesContext() {
  // 'useContext' va chercher le Provider le plus proche situé au-dessus dans l'arbre React
  const context = useContext(GamesContext);

  // Sécurité dev : si useGamesContext() est appelé dans un composant qui n'est PAS emballé par le <GamesProvider>, on indique l'erreur.
  if (!context) {
    throw new Error(
      "useGamesContext doit être utilisé à l'intérieur d'un GamesProvider",
    );
  }

  // Renvoie { games, loading, refetchGames, getGameById }
  return context;
}
