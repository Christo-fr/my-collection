"use client";

// =========================================================================
// 1. IMPORTS & TYPAGE
// =========================================================================
import { useState } from "react";
import { Game } from "@/types/game";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

export function useGameForm({ mode, editGame }: GameFormProps) {
  // =========================================================================
  // 2. ÉTATS DU FORMULAIRE (STATES)
  // =========================================================================

  // --- A. Métadonnées (Informations) ---
  const [title, setTitle] = useState<string>(editGame?.title || "");
  const [selectedFranchise, setSelectedFranchise] = useState<string>(
    editGame?.franchise || "",
  );
  const [selectedConsole, setSelectedConsole] = useState<string>(
    editGame?.console || "",
  );
  const [selectedSupport, setSelectedSupport] = useState<string>(
    editGame?.format || "Physical",
  );
  const [youtubeId, setYoutubeId] = useState<string>(editGame?.youtubeId || "");

  const [selectedDeveloper, setSelectedDeveloper] = useState<string>(
    editGame?.developer || "",
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    editGame?.language || "",
  );
  const [releaseDate, setReleaseDate] = useState<string>(
    editGame?.releaseDate || "",
  );
  const [selectedGenre, setSelectedGenre] = useState<string>(
    editGame?.genre || "",
  );
  const [selectedPegi, setSelectedPegi] = useState<number>(editGame?.pegi || 3);
  const [estimatedPlaytime, setEstimatedPlaytime] = useState<number>(
    editGame?.estimatedPlaytime || 1,
  );
  const [description, setDescription] = useState<string>(
    editGame?.description || "",
  );

  // --- B. Critique (Avis) ---
  const [completedDate, setCompletedDate] = useState<string>(
    editGame?.review?.completedDate || "",
  );
  const [playtime, setPlaytime] = useState<number | null>(
    editGame?.review?.playtime || null,
  );
  const [score, setScore] = useState<number | null>(
    editGame?.review?.score || null,
  );
  const [pros, setPros] = useState<string[]>(editGame?.review?.pros || []);
  const [cons, setCons] = useState<string[]>(editGame?.review?.cons || []);
  const [summary, setSummary] = useState<string>(
    editGame?.review?.summary || "",
  );

  // --- C. Erreurs ---
  const [formError, setFormError] = useState<string | null>(null);

  // =========================================================================
  // 3. GESTIONNAIRES DE LISTES DYNAMIQUES (PROS & CONS)
  // =========================================================================

  // --- A. Points Forts (Pros) ---
  const handleAddPro = () => {
    setPros([...pros, ""]);
  };

  const handleUpdatePro = (indexToUpdate: number, newValue: string) => {
    setPros(
      pros.map((item, index) => (index === indexToUpdate ? newValue : item)),
    );
  };

  const handleDeletePro = (indexToDelete: number) => {
    setPros(pros.filter((_, index) => index !== indexToDelete));
  };

  // --- B. Points Faibles (Cons) ---
  const handleAddCon = () => {
    setCons([...cons, ""]);
  };

  const handleUpdateCon = (indexToUpdate: number, newValue: string) => {
    setCons(
      cons.map((item, index) => (index === indexToUpdate ? newValue : item)),
    );
  };

  const handleDeleteCon = (indexToDelete: number) => {
    setCons(cons.filter((_, index) => index !== indexToDelete));
  };

  // =========================================================================
  // 4. SOUMISSION DU FORMULAIRE (SUBMIT)
  // =========================================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Sanitisation des tableaux (retrait des espaces & entrées vides)
    const cleanPros = pros.map((pro) => pro.trim()).filter((pro) => pro !== "");
    const cleanCons = cons.map((con) => con.trim()).filter((con) => con !== "");

    // 2. Sanitisation des valeurs numériques
    const cleanScore = score !== null && !isNaN(score) ? score : null;

    // TODO: Traitement BDD Supabase (étape suivante)
  };

  // =========================================================================
  // 5. VALEURS DE RETOUR (RETURN)
  // =========================================================================
  return {
    // États
    title,
    selectedFranchise,
    selectedConsole,
    selectedSupport,
    youtubeId,
    selectedDeveloper,
    selectedLanguage,
    releaseDate,
    selectedGenre,
    selectedPegi,
    estimatedPlaytime,
    description,
    completedDate,
    playtime,
    score,
    pros,
    cons,
    summary,
    formError,

    // Setters
    setTitle,
    setSelectedFranchise,
    setSelectedConsole,
    setSelectedSupport,
    setYoutubeId,
    setSelectedDeveloper,
    setSelectedLanguage,
    setReleaseDate,
    setSelectedGenre,
    setSelectedPegi,
    setEstimatedPlaytime,
    setDescription,
    setCompletedDate,
    setPlaytime,
    setScore,
    setPros,
    setCons,
    setSummary,

    // Handlers
    handleAddPro,
    handleUpdatePro,
    handleDeletePro,
    handleAddCon,
    handleUpdateCon,
    handleDeleteCon,
    handleSubmit,
  };
}
