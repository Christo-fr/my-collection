import { useState } from "react";
import { Game } from "@/types/game";
import {
  getUniqueGameOptions,
  getConsoleFormOptions,
  OPTIONS_PEGI,
  OPTIONS_SUPPORT,
} from "@/utils/admin/gameForm/gameFormOptionsUtils";
import { useGamesContext } from "@/components/providers/GamesProvider";

export function useGameInformations(editGame?: Game) {
  // Récupération de la liste existante des jeux et consoles pour alimenter les listes déroulantes (Combobox)
  const { games, consoles } = useGamesContext();

  // =========================================================================
  // 1. OPTIONS DYNAMIQUES POUR LES SELECT / COMBOBOX
  // =========================================================================
  // On extrait dynamiquement les valeurs uniques déjà enregistrées en BDD
  const franchiseOptions = getUniqueGameOptions(games, "franchise");
  const consoleOptions = getConsoleFormOptions(consoles);
  const developerOptions = getUniqueGameOptions(games, "developer");
  const languageOptions = getUniqueGameOptions(games, "language");
  const genreOptions = getUniqueGameOptions(games, "genre");

  // =========================================================================
  // 2. ÉTATS DU FORMULAIRE (STATES)
  // =========================================================================
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

  // =========================================================================
  // 4. VALEURS DE RETOUR (RETURN)
  // =========================================================================
  return {
    // --- États et Setters ---
    title,
    setTitle,
    selectedFranchise,
    setSelectedFranchise,
    selectedConsole,
    setSelectedConsole,
    selectedSupport,
    setSelectedSupport,
    youtubeId,
    setYoutubeId,
    selectedDeveloper,
    setSelectedDeveloper,
    selectedLanguage,
    setSelectedLanguage,
    releaseDate,
    setReleaseDate,
    selectedGenre,
    setSelectedGenre,
    selectedPegi,
    setSelectedPegi,
    estimatedPlaytime,
    setEstimatedPlaytime,
    description,
    setDescription,

    // --- Options des listes déroulantes ---
    OPTIONS_PEGI,
    OPTIONS_SUPPORT,
    franchiseOptions,
    consoleOptions,
    developerOptions,
    languageOptions,
    genreOptions,
  };
}
