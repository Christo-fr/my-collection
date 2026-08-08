import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getRelatedFranchiseGames } from "./gameUtils";

export function useGameDetail() {
  // 1. Hooks & Contextes
  const { id } = useParams();
  const router = useRouter();
  const { setBgImage } = useBackground();

  // On récupère le catalogue global au lieu d'avoir des useState locaux
  const { games, loading, getGameById } = useGamesContext();

  // 2. Recherche synchrone du jeu en mémoire (plus de fetch !)
  const game = id ? getGameById(Number(id)) : undefined;

  // 3. Gestion du bouton Retour
  const handleBack = () => {
    const lastCatalogUrl = sessionStorage.getItem("lastCatalogUrl");
    if (lastCatalogUrl) {
      router.push(lastCatalogUrl);
    } else {
      router.push("/list");
    }
  };

  // 4. Calcul des jeux de la même franchise filtrés depuis la mémoire
  const relatedFranchiseGames = useMemo(() => {
    if (!game || !game.franchise) return [];

    // 1. On reproduit ce que renvoyait /api/games?franchise=...
    const franchiseData = games.filter((g) => g.franchise === game.franchise);

    // 2. On passe ce sous-ensemble à la fonction utilitaire
    return getRelatedFranchiseGames(game, franchiseData);
  }, [game, games]);

  // 5. Changement du fond global en fonction du jeu sélectionné
  useEffect(() => {
    if (game) {
      setBgImage(game.images.cover);
    } else {
      setBgImage(null);
    }
  }, [game, setBgImage]);

  // 6.Redirection automatique vers la liste si le jeu n'existe pas
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
