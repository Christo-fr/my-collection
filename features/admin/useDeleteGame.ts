import { useState } from "react";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Game } from "@/types/game";

export function useDeleteGame() {
  // =============================================================
  // 1. HOOKS & CONTEXTES
  // =============================================================

  const { refetchGames } = useGamesContext(); // Permet de rafraîchir la liste globale des jeux
  const [isDeleting, setIsDeleting] = useState(false); // État de chargement pour l'UI
  const [error, setError] = useState<string | null>(null); // Stocke le message d'erreur éventuel
  const supabase = createClient(); // Client Supabase côté navigateur

  // =========================================================================
  // 2. TRAITEMENT
  // =========================================================================

  const deleteGame = async (game: Game): Promise<boolean> => {
    // A. Réinitialisation des états avant le début de l'opération
    setError(null);
    setIsDeleting(true);

    // B. Nettoyage des médias dans Supabase Storage
    // On centralise la liste des assets à vérifier et leurs buckets respectifs
    const assets = [
      { bucket: "covers", url: game.images.cover },
      { bucket: "logos", url: game.images.logo },
      { bucket: "parallaxes", url: game.images.parallax?.url },
    ];

    // On parcourt les visuels pour supprimer les fichiers orphelins
    for (const asset of assets) {
      if (asset.url) {
        // Extraction du nom de fichier depuis l'URL complète
        const fileName = asset.url.split("/").pop();

        if (fileName) {
          await supabase.storage.from(asset.bucket).remove([fileName]);
        }
      }
    }

    // C. Suppression de l'entrée dans la table BDD "games"
    const { error } = await supabase.from("games").delete().eq("id", game.id);

    // D. Traitement du résultat
    if (error) {
      setError(error.message);
      setIsDeleting(false);
      return false; // Échec de la suppression
    } else {
      toast.success("Jeu supprimé avec succès !");
      await refetchGames(); // Synchronise le contexte global et revalide le cache
      setIsDeleting(false);
      return true; // Succès : l'UI peut fermer la modale
    }
  };

  return {
    deleteGame,
    isDeleting,
    error,
  };
}
