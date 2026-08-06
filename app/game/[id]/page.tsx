"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import LayoutSplit from "@/components/layout/LayoutSplit";
import { Game } from "@/types/game";
import { useBackground } from "@/components/providers/BackgroundProvider";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Remplace bgImage par setBgImage
  const { setBgImage } = useBackground();

  // Effet A : Chargement des données (inchangé)
  useEffect(() => {
    if (!id) return;
    async function fetchGame() {
      try {
        const reponse = await fetch(`/api/games/${id}`);
        const data: Game = await reponse.json();
        reponse.ok ? setGame(data) : setGame(null);
      } catch (error) {
        console.error("Erreur lors du chargement du jeu :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  // Effet B : Gestion du fond d'écran
  useEffect(() => {
    // Si le jeu est chargé et possède une cover, on l'envoie au Provider
    if (game?.images?.cover) {
      setBgImage(game.images.cover);
    }

    // Quand on quitte la page, on réinitialise le fond
    return () => {
      setBgImage(null);
    };
  }, [game, setBgImage]);
  console.log("Parallax URL:", game?.images?.parallax);
  return (
    <>
      {loading ? (
        <p className="p-8 text-gray-400">Chargement en cours...</p>
      ) : !game ? (
        <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
      ) : (
        <LayoutSplit image={game.images.parallax}>
          <div>ok</div>
        </LayoutSplit>
      )}
    </>
  );
}
