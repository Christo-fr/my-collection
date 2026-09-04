import { useState } from "react";
import { Game } from "@/types/game";

export function useGameReview(editGame?: Game) {
  // =========================================================================
  // 1. ÉTATS (STATES)
  // =========================================================================
  // On initialise chaque champ. Si editGame existe, on prend sa valeur, sinon valeur par défaut.
  const [completedDate, setCompletedDate] = useState<string>(
    editGame?.review?.completedDate || "",
  );
  const [playtime, setPlaytime] = useState<number | null>(
    editGame?.review?.playtime || null,
  );
  const [score, setScore] = useState<number | null>(
    editGame?.review?.score || null,
  );
  const [summary, setSummary] = useState<string>(
    editGame?.review?.summary || "",
  );

  // Les tableaux pour les points forts et faibles.
  const [pros, setPros] = useState<string[]>(editGame?.review?.pros || []);
  const [cons, setCons] = useState<string[]>(editGame?.review?.cons || []);

  // =========================================================================
  // 2. MÉCANIQUE & HANDLERS (ACTIONS)
  // =========================================================================

  // --- Gestion des Points Forts ---
  const handleAddPro = () => {
    setPros([...pros, ""]); // Copie du tableau existant + ajout d'une case vide.
  };

  const handleUpdatePro = (indexToUpdate: number, newValue: string) => {
    // .map() crée un nouveau tableau. On met à jour l'élément ciblé par son index.
    setPros(
      pros.map((item, index) => (index === indexToUpdate ? newValue : item)),
    );
  };

  const handleDeletePro = (indexToDelete: number) => {
    // .filter() recrée un tableau en retirant l'élément à l'index donné.
    setPros(pros.filter((_, index) => index !== indexToDelete));
  };

  // --- Gestion des Points Faibles ---
  const handleAddCon = () => setCons([...cons, ""]);

  const handleUpdateCon = (indexToUpdate: number, newValue: string) => {
    setCons(
      cons.map((item, index) => (index === indexToUpdate ? newValue : item)),
    );
  };

  const handleDeleteCon = (indexToDelete: number) => {
    setCons(cons.filter((_, index) => index !== indexToDelete));
  };

  // --- Réinitialisation complète de l'Avis ---
  const handleClearReview = () => {
    setCompletedDate("");
    setPlaytime(null);
    setScore(null);
    setSummary("");
    setPros([]);
    setCons([]);
  };

  // =========================================================================
  // 3. VALEURS DE RETOUR (RETURN)
  // =========================================================================
  return {
    completedDate,
    setCompletedDate,
    playtime,
    setPlaytime,
    score,
    setScore,
    summary,
    setSummary,
    pros,
    setPros,
    cons,
    setCons,
    handleAddPro,
    handleUpdatePro,
    handleDeletePro,
    handleAddCon,
    handleUpdateCon,
    handleDeleteCon,
    handleClearReview,
  };
}
