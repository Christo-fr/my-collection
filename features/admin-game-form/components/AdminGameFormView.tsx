"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LayoutFull from "@/components/layout/LayoutFull";
import { LoaderCircle } from "lucide-react";
import { useGamesContext } from "@/components/providers/GamesProvider";
import AdminGameForm from "@/features/admin-game-form/components/AdminGameForm";

interface AdminGameFormViewProps {
  mode: "insert" | "update";
  idGame?: number | null;
}

export default function AdminGameFormView({
  mode,
  idGame,
}: AdminGameFormViewProps) {
  const router = useRouter();
  const { getGameById, loading } = useGamesContext();

  // Récupération du jeu uniquement en mode édition
  const game =
    mode === "update" && idGame !== undefined && idGame !== null
      ? getGameById(idGame)
      : undefined;

  // Redirection + Toast uniquement en mode édition si le jeu est introuvable
  useEffect(() => {
    if (mode === "update" && !loading && !game) {
      toast.error("Le jeu demandé n'existe pas ou a été supprimé.");
      router.push("/administration");
    }
  }, [mode, loading, game, router]);

  // 1. CAS ÉDITION
  if (mode === "update") {
    if (loading || !game) {
      return (
        <LayoutFull title="Chargement du jeu...">
          <div className="flex h-64 w-full items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-main" />
          </div>
        </LayoutFull>
      );
    }

    return (
      <LayoutFull title={`Éditer : ${game.title}`}>
        <AdminGameForm mode="update" editGame={game} />
      </LayoutFull>
    );
  }

  // 2. CAS CRÉATION
  return (
    <LayoutFull title="Ajout">
      <AdminGameForm mode="insert" />
    </LayoutFull>
  );
}
