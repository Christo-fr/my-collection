import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { Game } from "@/types/game";
import { getRelatedFranchiseGames } from "./gameUtils";

/**
 * Custom Hook : useGameDetail
 *
 * OBJECTIF ET RÔLE :
* Ce hook sert de "chef d'orchestre" pour la page de détail d'un jeu (/game/[id]).
 * 1. Récupère l'ID en cours dans l'URL et charge les données du jeu via /api/games/[id].
 * 2. Transmet l'image de couverture au BackgroundProvider pour le fond global.
 * 3. Effectue une requête secondaire pour charger les jeux connexes si le jeu a une franchise.
 * 4. Fournit la fonction de retour intelligent (handleBack) basée sur le sessionStorage.
 * 5. Redirige vers /list si le jeu n'existe pas.

 */
export function useGameDetail() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const { id } = useParams();
  const router = useRouter();
  const { setBgImage } = useBackground();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedFranchiseGames, setRelatedFranchiseGames] = useState<Game[]>(
    [],
  );

  // =========================================================================
  // 2. FONCTIONS DE NAVIGATION ET HANDLERS
  // =========================================================================
  /**
   * Gestion intelligente du retour :
   * Redirige vers /list si l'utilisateur vient d'un site externe ou d'un nouvel onglet.
   */
  const handleBack = () => {
    const lastCatalogUrl = sessionStorage.getItem("lastCatalogUrl");

    if (lastCatalogUrl) {
      router.push(lastCatalogUrl);
    } else {
      router.push("/list");
    }
  };

  // =========================================================================
  // 3. EFFETS (LIFECYCLE)
  // =========================================================================

  // Effet A : Chargement du jeu principal et des jeux de sa franchise
  useEffect(() => {
    // 1. Garde (Guard Clause) : Si l'ID du jeu n'est pas encore disponible dans l'URL, on stoppe l'effet
    if (!id) return;

    async function fetchGameData() {
      try {
        // 2. Appel API principal : Récupération des détails du jeu courant
        const response = await fetch(`/api/games/${id}`);

        // 3. Gestion d'erreur HTTP (ex: 404 Jeu introuvable)
        // On réinitialise tous les états pour éviter d'afficher des données résiduelles d'un autre jeu
        if (!response.ok) {
          setGame(null);
          setRelatedFranchiseGames([]);
          setBgImage(null); // Réinitialise le fond global
          return;
        }

        // 4. Succès de la requête principale
        const data: Game = await response.json();
        setGame(data);

        // Émission au Context : On injecte l'image de couverture du jeu dans le fond global
        setBgImage(data.images.cover);

        // 5. Requête secondaire "en cascade" : Si le jeu appartient à une franchise
        if (data.franchise) {
          const franchiseResponse = await fetch(
            `/api/games?franchise=${encodeURIComponent(data.franchise)}`,
          );

          if (franchiseResponse.ok) {
            const franchiseData: Game[] = await franchiseResponse.json();
            // Filtrage des jeux connexes pour exclure le jeu actuel de sa propre liste
            const relatedGames = getRelatedFranchiseGames(data, franchiseData);
            setRelatedFranchiseGames(relatedGames);
          }
        } else {
          // Si le jeu n'a pas de franchise, on s'assure que la liste des jeux connexes est vide
          setRelatedFranchiseGames([]);
        }
      } catch (error) {
        // 6. Gestion des erreurs réseau ou d'exécution
        console.error("Erreur lors du chargement des données :", error);
        setBgImage(null); // Sécurité : remet le fond par défaut en cas de crash
      } finally {
        // 7. Fin du chargement : Désactive l'indicateur de chargement (succès ou échec)
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id, setBgImage]);

  // Effet B : Redirection si le jeu n'existe pas après chargement
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
