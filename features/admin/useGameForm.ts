"use client";

// =========================================================================
// 1. IMPORTS & TYPAGE
// =========================================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/types/game";
import { createClient } from "@/lib/supabase/client";
import {
  getUniqueGameOptions,
  getConsoleFormOptions,
  OPTIONS_PEGI,
  OPTIONS_SUPPORT,
} from "@/features/admin/gameFormOptionsUtils";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { toast } from "sonner";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

export function useGameForm({ mode, editGame }: GameFormProps) {
  // =========================================================================
  // 2. CONTEXTE & OPTIONS DYNAMIQUES
  // =========================================================================
  const router = useRouter();
  const { games, consoles, refetchGames } = useGamesContext();

  const franchiseOptions = getUniqueGameOptions(games, "franchise");
  const consoleOptions = getConsoleFormOptions(consoles);
  const developerOptions = getUniqueGameOptions(games, "developer");
  const languageOptions = getUniqueGameOptions(games, "language");
  const genreOptions = getUniqueGameOptions(games, "genre");

  const supabase = createClient();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // =========================================================================
  // 3. ÉTATS DU FORMULAIRE (STATES)
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

  // --- B. Visuels (Images) ---
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

  // --- C. Critique (Avis) ---
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

  // --- D. Gestion des Erreurs ---
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // --- E. Génération IA ---
  const [fieldAIGenerated, setFieldAIGenerated] = useState<
    Record<string, boolean>
  >({});
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // =========================================================================
  // 4. GESTIONNAIRES DE LISTES DYNAMIQUES (PROS & CONS)
  // =========================================================================
  const handleAddPro = () => setPros([...pros, ""]);
  const handleUpdatePro = (indexToUpdate: number, newValue: string) => {
    setPros(
      pros.map((item, index) => (index === indexToUpdate ? newValue : item)),
    );
  };
  const handleDeletePro = (indexToDelete: number) => {
    setPros(pros.filter((_, index) => index !== indexToDelete));
  };

  const handleAddCon = () => setCons([...cons, ""]);
  const handleUpdateCon = (indexToUpdate: number, newValue: string) => {
    setCons(
      cons.map((item, index) => (index === indexToUpdate ? newValue : item)),
    );
  };
  const handleDeleteCon = (indexToDelete: number) => {
    setCons(cons.filter((_, index) => index !== indexToDelete));
  };

  // =========================================================================
  // 5. HELPER CONVERSION WEBP & UPLOAD SUPABASE
  // =========================================================================
  const uploadImageToSupabase = async (
    source: File | string,
    bucket: string,
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      if (typeof source === "string") {
        formData.append("url", source);
      } else {
        formData.append("file", source);
      }

      const response = await fetch("/api/webp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur de conversion de l'image.");
      }

      const blob = await response.blob();
      const webpFile = new File([blob], `${Date.now()}.webp`, {
        type: "image/webp",
      });

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(webpFile.name, webpFile);

      if (error) {
        console.error(
          `Erreur d'upload sur le bucket "${bucket}" :`,
          error.message,
        );
        return null;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erreur durant le traitement de l'image :", error);
      return null;
    }
  };

  // =========================================================================
  // 6. TRAITEMENT DES ENCARTS ERREURS ET IA
  // =========================================================================
  const clearField = (fieldKey: string) => {
    setFieldErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[fieldKey];
      if (Object.keys(nextErrors).length === 0) {
        setFormError(null);
      }
      return nextErrors;
    });

    setFieldAIGenerated((prev) => {
      const nextAIGenerated = { ...prev };
      delete nextAIGenerated[fieldKey];
      return nextAIGenerated;
    });
  };

  // =========================================================================
  // 7. GESTION DE LA GÉNÉRATION IA (GEMINI)
  // =========================================================================
  const handleGenerateAI = async () => {
    const cleanTitle = title.trim();
    setFieldAIGenerated({});

    if (!cleanTitle) {
      setFieldErrors((prev) => ({
        ...prev,
        title: "Saisissez un titre pour générer les infos avec l'IA.",
      }));
      return;
    }

    setIsGeneratingAI(true);
    setFormError(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          console: selectedConsole.trim() || undefined,
          existingOptions: {
            genres: genreOptions.map((opt) => opt.value),
            developers: developerOptions.map((opt) => opt.value),
            franchises: franchiseOptions.map((opt) => opt.value),
            languages: languageOptions.map((opt) => opt.value),
            consoles: consoleOptions.map((opt) => opt.value),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération IA.");
      }

      const newAiFields: Record<string, boolean> = {};

      if (data.developer && !selectedDeveloper) {
        setSelectedDeveloper(data.developer);
        newAiFields.selectedDeveloper = true;
      }
      if (data.console && !selectedConsole) {
        setSelectedConsole(data.console);
        newAiFields.selectedConsole = true;
      }
      if (data.genre && !selectedGenre) {
        setSelectedGenre(data.genre);
        newAiFields.selectedGenre = true;
      }
      if (data.language && !selectedLanguage) {
        setSelectedLanguage(data.language);
        newAiFields.selectedLanguage = true;
      }
      if (data.releaseDate && !releaseDate) {
        setReleaseDate(data.releaseDate);
        newAiFields.releaseDate = true;
      }
      if (data.description && !description) {
        setDescription(data.description);
        newAiFields.description = true;
      }
      if (data.franchise && !selectedFranchise) {
        setSelectedFranchise(data.franchise);
        newAiFields.selectedFranchise = true;
      }
      if (data.youtubeId && !youtubeId) {
        setYoutubeId(data.youtubeId);
        newAiFields.youtubeId = true;
      }
      if (data.pegi && (selectedPegi === 3 || !selectedPegi)) {
        setSelectedPegi(Number(data.pegi));
        newAiFields.selectedPegi = true;
      }
      if (
        data.estimatedPlaytime &&
        (estimatedPlaytime === 1 || !estimatedPlaytime)
      ) {
        setEstimatedPlaytime(Number(data.estimatedPlaytime));
        newAiFields.estimatedPlaytime = true;
      }

      setFieldAIGenerated(newAiFields);
      setFieldErrors({});
    } catch (error: any) {
      console.error("Erreur génération IA :", error);
      setFormError(
        error.message || "Impossible de récupérer les métadonnées avec l'IA.",
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // =========================================================================
  // 8. SOUMISSION & VALIDATION DU FORMULAIRE (SUBMIT)
  // =========================================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldAIGenerated({});

    // -----------------------------------------------------------------------
    // A. SANITISATION DES DONNÉES
    // -----------------------------------------------------------------------
    const cleanTitle = title.trim();
    const cleanConsole = selectedConsole.trim();
    const cleanDeveloper = selectedDeveloper.trim();
    const cleanLanguage = selectedLanguage.trim();
    const cleanGenre = selectedGenre.trim();
    const cleanDescription = description.trim();
    const cleanFranchise = selectedFranchise.trim();
    const cleanYoutubeId = youtubeId.trim();
    const cleanPros = pros.map((p) => p.trim()).filter(Boolean);
    const cleanCons = cons.map((c) => c.trim()).filter(Boolean);

    const newErrors: Record<string, string> = {};

    // -----------------------------------------------------------------------
    // B. VALIDATION DES TEXTES OBLIGATOIRES
    // -----------------------------------------------------------------------
    if (!cleanTitle) newErrors.title = "Le titre est obligatoire";
    if (!cleanConsole) newErrors.selectedConsole = "La console est obligatoire";
    if (!cleanFranchise)
      newErrors.selectedFranchise = "La franchise est obligatoire";
    if (!cleanYoutubeId)
      newErrors.youtubeId = "L'ID vidéo YouTube est obligatoire";
    if (!cleanDeveloper)
      newErrors.selectedDeveloper = "Le développeur est obligatoire";
    if (!selectedSupport)
      newErrors.selectedSupport = "Le support est obligatoire";
    if (!selectedPegi) newErrors.selectedPegi = "Le PEGI est obligatoire";
    if (!cleanLanguage)
      newErrors.selectedLanguage = "La langue est obligatoire";
    if (!cleanGenre) newErrors.selectedGenre = "Le genre est obligatoire";
    if (!cleanDescription)
      newErrors.description = "La description est obligatoire";

    if (!releaseDate || isNaN(Date.parse(releaseDate))) {
      newErrors.releaseDate = "La date de sortie est invalide ou manquante";
    }

    if (
      !estimatedPlaytime ||
      isNaN(estimatedPlaytime) ||
      estimatedPlaytime < 1
    ) {
      newErrors.estimatedPlaytime = "Durée estimée invalide (1 h min.)";
    }

    const isValidHttpUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    };

    if (logoSourceType === "file") {
      if (!uploadLogo) newErrors.logo = "Le logo est obligatoire";
    } else {
      if (!urlLogo.trim()) newErrors.logo = "L'URL du logo est obligatoire";
      else if (!isValidHttpUrl(urlLogo.trim()))
        newErrors.logo = "L'URL du logo est invalide";
    }

    if (coverSourceType === "file") {
      if (!uploadCover) newErrors.cover = "La cover est obligatoire";
    } else {
      if (!urlCover.trim())
        newErrors.cover = "L'URL de la cover est obligatoire";
      else if (!isValidHttpUrl(urlCover.trim()))
        newErrors.cover = "L'URL de la cover est invalide";
    }

    if (parallaxSourceType === "file") {
      if (!uploadParallax) newErrors.parallax = "Le parallax est obligatoire";
    } else {
      if (!urlParallax.trim())
        newErrors.parallax = "L'URL du parallax est obligatoire";
      else if (!isValidHttpUrl(urlParallax.trim()))
        newErrors.parallax = "L'URL du parallax est invalide";
    }

    if (completedDate && isNaN(Date.parse(completedDate))) {
      newErrors.completedDate = "La date de complétion est invalide";
    }
    if (score !== null && (isNaN(score) || score < 0 || score > 10)) {
      newErrors.score = "La note doit être comprise entre 0 et 10";
    }
    if (playtime !== null && (isNaN(playtime) || playtime < 1)) {
      newErrors.playtime = "Le temps de jeu doit être d'au moins 1 heure";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setFormError("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setIsSaving(true);

    // -----------------------------------------------------------------------
    // C. CONVERSION & UPLOAD DES IMAGES DANS SUPABASE
    // -----------------------------------------------------------------------
    const logoSource = logoSourceType === "file" ? uploadLogo! : urlLogo.trim();
    const coverSource =
      coverSourceType === "file" ? uploadCover! : urlCover.trim();
    const parallaxSource =
      parallaxSourceType === "file" ? uploadParallax! : urlParallax.trim();

    const [logoPublicUrl, coverPublicUrl, parallaxPublicUrl] =
      await Promise.all([
        uploadImageToSupabase(logoSource, "logos"),
        uploadImageToSupabase(coverSource, "covers"),
        uploadImageToSupabase(parallaxSource, "parallaxes"),
      ]);

    if (!logoPublicUrl || !coverPublicUrl || !parallaxPublicUrl) {
      setFormError(
        "Une erreur est survenue lors de la conversion ou de l'upload des images.",
      );
      return;
    }

    const imagesPayload = {
      logo: logoPublicUrl,
      cover: coverPublicUrl,
      parallax: {
        url: parallaxPublicUrl,
        truncated: parallaxTruncated,
      },
    };

    // -----------------------------------------------------------------------
    // D. FORMATAGE DE L'AVIS (OPTIONNEL)
    // -----------------------------------------------------------------------
    const hasReview =
      completedDate ||
      playtime ||
      score !== null ||
      cleanPros.length > 0 ||
      cleanCons.length > 0 ||
      summary.trim();

    const reviewPayload = hasReview
      ? {
          playtime: playtime || undefined,
          completedDate: completedDate || undefined,
          score: score !== null ? score : undefined,
          pros: cleanPros.length > 0 ? cleanPros : undefined,
          cons: cleanCons.length > 0 ? cleanCons : undefined,
          summary: summary.trim() || undefined,
        }
      : null;

    // -----------------------------------------------------------------------
    // E. ASSEMBLAGE DU PAYLOAD FINAL
    // -----------------------------------------------------------------------
    const gamePayload = {
      title: cleanTitle,
      franchise: cleanFranchise,
      console: cleanConsole,
      format: selectedSupport,
      developer: cleanDeveloper,
      genre: cleanGenre,
      pegi: Number(selectedPegi),
      language: cleanLanguage,
      releaseDate,
      estimatedPlaytime: Number(estimatedPlaytime),
      description: cleanDescription,
      youtubeId: cleanYoutubeId,
      images: imagesPayload,
      review: reviewPayload,
    };

    // -----------------------------------------------------------------------
    // F. ENREGISTREMENT EN BASE DE DONNÉES SUPABASE
    // -----------------------------------------------------------------------
    let error = null;

    if (mode === "insert") {
      const res = await supabase.from("games").insert([gamePayload]);
      error = res.error;
    } else if (mode === "update" && editGame?.id) {
      const res = await supabase
        .from("games")
        .update(gamePayload)
        .eq("id", editGame.id);
      error = res.error;
    }

    if (error) {
      console.error("Erreur BDD :", error.message);
      setFormError(error.message);
      setIsSaving(false);
    } else {
      toast.success(
        mode === "insert"
          ? "Jeu ajouté avec succès !"
          : "Jeu mis à jour avec succès !",
      );
      await refetchGames();
      router.push("/administration");
      setIsSaving(false);
    }
  };

  // =========================================================================
  // 9. VALEURS DE RETOUR (RETURN)
  // =========================================================================
  return {
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
    isSaving,
    isGeneratingAI,
    OPTIONS_PEGI,
    OPTIONS_SUPPORT,
    franchiseOptions,
    consoleOptions,
    developerOptions,
    languageOptions,
    genreOptions,
    formError,
    fieldErrors,
    fieldAIGenerated,

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
    setIsGeneratingAI,
    setSummary,

    clearField,
    handleAddPro,
    handleUpdatePro,
    handleDeletePro,
    handleAddCon,
    handleUpdateCon,
    handleDeleteCon,
    uploadImageToSupabase,
    handleGenerateAI,
    handleSubmit,
  };
}
