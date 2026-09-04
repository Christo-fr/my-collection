import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getRelatedFranchiseGames } from "../../utils/game/gameUtils";

export function useGameDetail() {
  // =============================================================
  // 1. HOOKS & CONTEXTES
  // =============================================================

  const { id } = useParams();
  const router = useRouter();
  const { setBgImage } = useBackground();

  // Récupère le catalogue global
  const { games, loading, getGameById } = useGamesContext();

  // =============================================================
  // 2. RECHERCHE DU JEU EN MEMO
  // =============================================================
  const game = id ? getGameById(Number(id)) : undefined;

  // =============================================================
  // 3. GESTION DU BOUTON RETOUR
  // =============================================================

  const handleBack = () => {
    const lastCatalogUrl = sessionStorage.getItem("lastCatalogUrl");
    if (lastCatalogUrl) {
      router.push(lastCatalogUrl);
    } else {
      router.push("/list");
    }
  };

  // =============================================================
  // 4. CALCUL DES JEUX DE LA MÊME FRANCHISE FILTRÉS DEPUIS LA MÉMOIRE
  // =============================================================

  const relatedFranchiseGames = useMemo(() => {
    if (!game || !game.franchise) return [];

    // 1. Renvoie la liste de jeu de la meme franchise
    const franchiseData = games.filter((g) => g.franchise === game.franchise);

    // 2. On passe ce sous-ensemble à la fonction utilitaire
    return getRelatedFranchiseGames(game, franchiseData);
  }, [game, games]);

  // =============================================================
  // 5. CHANGEMENT DU BACKGROUND EN FONCTION DU JEU SÉLECTIONNÉ
  // =============================================================

  useEffect(() => {
    if (game) {
      setBgImage(game.images.cover);
    } else {
      setBgImage(null);
    }
  }, [game, setBgImage]);

  // =============================================================
  // 6. REDIRECTION AUTOMATIQUE VERS LA LISTE SI LE JEU N'EXISTE PAS
  // =============================================================
  useEffect(() => {
    if (!loading && !game) {
      router.push("/list");
    }
  }, [loading, game, router]);

  return {
    game,
    loading,
    relatedFranchiseGames,
    handleBack,
  };
}
