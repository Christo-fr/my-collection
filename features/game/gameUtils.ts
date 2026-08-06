import { Game } from "@/types/game";

// =============================================================
// OPTIONS STATIQUES (Listes fixes)
// =============================================================

// Select pour le filtrage par statut (terminé / non terminé)
export const OPTIONS_STATUS = [
  { label: "Tous", value: "all" },
  { label: "Terminé", value: "completed" },
  { label: "Non terminé", value: "not_completed" },
];

// Select pour le tri des jeux
export const OPTIONS_SORT = [
  { label: "Alphabétique", value: "alphabetical" },
  { label: "Anti-Alphabétique", value: "anti_alphabetical" },
  { label: "Date de sortie - croissante", value: "releaseDate_ascending" },
  { label: "Date de sortie - décroissante", value: "releaseDate_descending" },
  { label: "Durée de vie - croissant", value: "estimatedPlaytime_ascending" },
  {
    label: "Durée de vie - décroissant",
    value: "estimatedPlaytime_descending",
  },
  { label: "Note - croissante", value: "score_ascending" },
  { label: "Note - décroissante", value: "score_descending" },
];

// =============================================================
//  OPTIONS DYNAMIQUES (SELECT / RANGEINPUT)
// =============================================================

export function getPlaytimeBounds(games: Game[]) {
  // Calcul de la durée de vie maximale parmi tous les jeux pour définir la valeur maximale du RangeInput
  const maxEstimatedPlaytime = // Sécurité si les données ne sont pas encore chargés
    games.length > 0
      ? Math.max(...games.map((game) => game.estimatedPlaytime))
      : 200; // Calcul de la durée de vie minimale parmi tous les jeux pour définir la valeur minimale du RangeInput

  const minEstimatedPlaytime = // Sécurité si les données ne sont pas encore chargés
    games.length > 0
      ? Math.min(...games.map((game) => game.estimatedPlaytime))
      : 0;

  return { min: minEstimatedPlaytime, max: maxEstimatedPlaytime };
}

export function getConsoleOptions(games: Game[]) {
  // 1. Options pour les Consoles
  const optionsConsole = [
    // Option par défaut pour désactiver le filtre
    { label: "Toutes", value: "Toutes" },
    // 1. Premier .map() + Set : extraction et suppression des doublons
    // 2. Second .map() : mise au format { label, value } pour le composant <Select />
    ...Array.from(new Set(games.map((jeu) => jeu.console)))
      .map((nomConsole) => ({
        label: nomConsole,
        value: nomConsole,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)), // Tri alphabétique par label
  ];
  return optionsConsole;
}

export function getStyleOptions(games: Game[]) {
  // 2. Options pour les genres de jeux
  const optionsStyle = [
    { label: "Tous", value: "Tous" },
    ...Array.from(new Set(games.map((jeu) => jeu.genre)))
      .map((nomGenre) => ({
        label: nomGenre,
        value: nomGenre,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)), // Tri alphabétique par label
  ];
  return optionsStyle;
}

// =============================================================
//  FILTRAGE ET TRI DES JEUX
// =============================================================

export interface GameFilters {
  searchQuery: string;
  selectedConsole: string;
  selectedStyle: string;
  selectedStatus: string;
  maxDuration: number;
  sortBy: string;
}

export function filterGames(games: Game[], filters: GameFilters): Game[] {
  return games
    .filter(
      (game) =>
        // 1. Filtre sur la durée
        game.estimatedPlaytime <= filters.maxDuration &&
        // 2. Filtre sur la console
        (filters.selectedConsole === "Toutes" ||
          game.console === filters.selectedConsole) &&
        // 3. Filtre sur le style/genre
        (filters.selectedStyle === "Tous" ||
          game.genre === filters.selectedStyle) &&
        // 4. Filtre sur le statut (terminé / non terminé)
        (filters.selectedStatus === "all" ||
          (filters.selectedStatus === "completed" &&
            game.review?.score != null) ||
          (filters.selectedStatus === "not_completed" &&
            game.review?.score == null)) &&
        // 5. Filtre sur la recherche textuelle
        game.title.toLowerCase().includes(filters.searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      let diff = 0;
      switch (filters.sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "anti_alphabetical":
          return b.title.localeCompare(a.title);
        case "releaseDate_ascending":
          diff =
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime();
          break;
        case "releaseDate_descending":
          diff =
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime();
          break;
        case "estimatedPlaytime_ascending":
          diff = a.estimatedPlaytime - b.estimatedPlaytime;
          break;
        case "estimatedPlaytime_descending":
          diff = b.estimatedPlaytime - a.estimatedPlaytime;
          break;
        case "score_ascending":
          diff = (a.review?.score ?? 0) - (b.review?.score ?? 0);
          break;
        case "score_descending":
          diff = (b.review?.score ?? 0) - (a.review?.score ?? 0);
          break;
        default:
          break;
      }
      return diff !== 0 ? diff : a.title.localeCompare(b.title);
    });
}

// =============================================================
//  RENVOIE 3 JEUX D'UNE MêME FRANCHISE (1 avant, 2 après)
// =============================================================

export function getRelatedFranchiseGames(
  currentGame: Game,
  franchiseGames: Game[],
): Game[] {
  // 1. Tri croissant par date de sortie
  const sortedGames = [...franchiseGames].sort(
    (a, b) =>
      new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
  );

  // 2. Position du jeu actuel dans la saga
  const currentIndex = sortedGames.findIndex((g) => g.id === currentGame.id);

  // Si le jeu n'est pas trouvé dans la liste, sécurité
  if (currentIndex === -1) return [];

  // 3. Découpage naturel des deux sous-listes
  const gamesBefore = sortedGames.slice(0, currentIndex);
  const gamesAfter = sortedGames.slice(currentIndex + 1);

  // 3. Quotas par défaut
  let countBefore = 1;
  let countAfter = 2;

  // 4. Report du manque d'un côté vers l'autre
  if (gamesBefore.length < 1) {
    countAfter += 1 - gamesBefore.length; // Si 0 avant -> countAfter devient 3
  }
  if (gamesAfter.length < 2) {
    countBefore += 2 - gamesAfter.length; // Si 0 après -> countBefore devient 3, si 1 après -> 2
  }

  // 5. Extraction finale
  const selectedBefore = gamesBefore.slice(-countBefore);
  const selectedAfter = gamesAfter.slice(0, countAfter);

  return [...selectedBefore, ...selectedAfter];
}

// =============================================================
//  TRADUCTION DES DATES EN FRANÇAIS
// =============================================================

export function formatDate(dateString: string): string {
  if (!dateString) return "";

  // Découpage pour éviter les décalages de fuseau horaire UTC
  const [year, month] = dateString.split("-").map(Number);
  if (!year || !month) return dateString;

  // Création de la date (les mois commencent à 0 en JS)
  const date = new Date(year, month - 1);

  const formatted = date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  // Met la première lettre du mois en majuscule (ex: "mars 2024" -> "Mars 2024")
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
