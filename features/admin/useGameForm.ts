"use client";

// =========================================================================
// 1. IMPORTS & TYPAGE
// =========================================================================
import { useState } from "react";
import { Game } from "@/types/game";
import { createClient } from "@/lib/supabase/client";
import {
  getUniqueGameOptions,
  getConsoleFormOptions,
  OPTIONS_PEGI,
  OPTIONS_SUPPORT,
} from "@/features/admin/gameFormOptionsUtils";
import { useGamesContext } from "@/components/providers/GamesProvider";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

export function useGameForm({ mode, editGame }: GameFormProps) {
  // 1. Récupération des données du Context
  const { games, consoles } = useGamesContext();

  // 2. Options dynamiques pour les Combobox
  const franchiseOptions = getUniqueGameOptions(games, "franchise");
  const consoleOptions = getConsoleFormOptions(consoles);
  const developerOptions = getUniqueGameOptions(games, "developer");
  const languageOptions = getUniqueGameOptions(games, "language");
  const genreOptions = getUniqueGameOptions(games, "genre");

  // =========================================================================
  // 2. ÉTATS DU FORMULAIRE (STATES)
  // =========================================================================
  const supabase = createClient();

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

  // --- A.2 Images (Informations) ---

  const [uploadCover, setUploadCover] = useState<File | null>(null);
  const [urlCover, setUrlCover] = useState<string>(
    editGame?.images?.cover || "",
  );

  const [uploadLogo, setUploadLogo] = useState<File | null>(null);
  const [urlLogo, setUrlLogo] = useState<string>(editGame?.images?.logo || "");

  const [uploadParallax, setUploadParallax] = useState<File | null>(null);
  const [urlParallax, setUrlParallax] = useState<string>(
    editGame?.images?.parallax?.url || "",
  );
  const [parallaxTruncated, setParallaxTruncated] = useState<boolean>(
    editGame?.images?.parallax?.truncated || false,
  );

  const [logoSourceType, setLogoSourceType] = useState<"file" | "url">("file");
  const [coverSourceType, setCoverSourceType] = useState<"file" | "url">(
    "file",
  );
  const [parallaxSourceType, setParallaxSourceType] = useState<"file" | "url">(
    "file",
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

  /**
   * Upload une image dans un bucket Supabase Storage et retourne son URL publique.
   * @param file Le fichier issu du champ <input type="file" />
   * @param bucket Le nom du bucket Supabase ("logos", "covers" ou "parallaxes")
   */
  const uploadImageToSupabase = async (file: File, bucket: string) => {
    // 1. HORODATAGE : On crée un nom unique (ex: "1723456789-mon_image.png")
    // Date.now() renvoie le nombre de millisecondes actuelles, garantissant l'unicité du fichier.
    const fileName = `${Date.now()}-${file.name}`;

    // 2. TÉLÉVERSEMENT : On envoie le fichier binaire sur les serveurs de Supabase.
    // supabase.storage.from() cible le bon bucket.
    // .upload() prend le chemin visé (fileName) et le fichier brut.
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    // 3. SÉCURITÉ : Si Supabase renvoie une erreur (permissions, quota, réseau),
    // on l'affiche en console et on stoppe la fonction en renvoyant null.
    if (error) {
      console.error(
        `Erreur d'upload sur le bucket "${bucket}" :`,
        error.message,
      );
      return null;
    }

    // 4. CONVERSION EN URL : L'upload a réussi ! 'data.path' contient le chemin relatif.
    // .getPublicUrl() convertit ce chemin en une URL HTTP utilisable sur le web.
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    // 5. RETOUR : On renvoie l'URL publique sous forme de string (ex: "https://...supabase.co/.../image.png")
    return urlData.publicUrl;
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
    uploadCover,
    urlCover,
    uploadLogo,
    urlLogo,
    uploadParallax,
    urlParallax,
    parallaxTruncated,
    logoSourceType,
    coverSourceType,
    parallaxSourceType,
    completedDate,
    playtime,
    score,
    pros,
    cons,
    summary,
    OPTIONS_PEGI,
    OPTIONS_SUPPORT,
    franchiseOptions,
    consoleOptions,
    developerOptions,
    languageOptions,
    genreOptions,
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
    setLogoSourceType,
    setCoverSourceType,
    setParallaxSourceType,
    setUploadCover,
    setUrlCover,
    setUploadLogo,
    setUrlLogo,
    setUploadParallax,
    setUrlParallax,
    setParallaxTruncated,
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
