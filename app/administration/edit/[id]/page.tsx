"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutFull from "@/components/layout/LayoutFull";
import GameForm from "@/components/admin/gameForm/GameForm";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export default function EditGamePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? Number(params.id) : null;

  const { getGameById, loading } = useGamesContext();

  // 1. Récupération synchrone du jeu depuis le context
  const game = id ? getGameById(id) : undefined;

  // 2. Redirection + Toast si le jeu est introuvable une fois le chargement fini
  useEffect(() => {
    if (!loading && !game) {
      toast.error("Le jeu demandé n'existe pas ou a été supprimé.");
      router.push("/administration");
    }
  }, [loading, game, router]);

  // 3. Affichage du loader pendant le chargement ou la redirection
  if (loading || !game) {
    return (
      <LayoutFull title="Chargement du jeu...">
        <div className="flex h-64 w-full items-center justify-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-main" />
        </div>
      </LayoutFull>
    );
  }

  // 4. Rendu du formulaire pré-rempli
  return (
    <LayoutFull title={`Éditer : ${game.title}`}>
      <GameForm mode="update" editGame={game} />
    </LayoutFull>
  );
}
