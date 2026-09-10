import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getRelatedFranchiseGames } from "../../../utils/gameUtils";

/** Hook orchestrateur gérant la recherche synchrone d'un jeu, le fond d'écran et la navigation */
export function useGameDetail(idGame?: number | null) {
  // =============================================================
  // 1. HOOKS & CONTEXTES
  // =============================================================
  const params = useParams();
  const router = useRouter();
  const { setBgImage } = useBackground();

  // Récupère le catalogue global
  const { games, loading, getGameById } = useGamesContext();

  // =============================================================
  // 2. RECHERCHE DU JEU EN MÉMOIRE
  // =============================================================
  // Priorité à l'ID transmis au hook, sinon fallback sur le paramètre d'URL
  const targetId = idGame ?? (params?.id ? Number(params.id) : null);
  const game = targetId ? getGameById(targetId) : undefined;

  // =============================================================
  // 3. GESTION DU BOUTON RETOUR
  // =============================================================
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/list");
    }
  };

  // =============================================================
  // 4. CALCUL DES JEUX DE LA MÊME FRANCHISE FILTRÉS DEPUIS LA MÉMOIRE
  // =============================================================
  const relatedFranchiseGames = useMemo(() => {
    if (!game || !game.franchise) return [];

    // 1. Renvoie la liste de jeux de la même franchise
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
