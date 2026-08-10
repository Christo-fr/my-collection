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

export const OPTIONS_RECORD_METRICS = [
  { label: "Notes attribuées", value: "score" },
  { label: "Temps de jeu", value: "playtime" },
  { label: "Écart de temps", value: "playtime_gap" },
  { label: "Date de complétion", value: "completion_date" },
  { label: "Bilan annuel", value: "yearly_summary" },
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

// =============================================================
//  SELECTION DE JEU DE LA SUGGESTION
// =============================================================

// 1. Les critères envoyés par le formulaire
export interface SuggestionCriteria {
  selectedConsole: string;
  selectedStyle: string;
  selectedStatus: string;
  maxDuration: number;
}

// 2. Le paquet retourné après le tirage
export interface SuggestionResult {
  game: Game | null;
  isMatch: boolean;
  warningMessage?: string;
}

export function getGachaSuggestion(
  criteria: SuggestionCriteria,
  games: Game[],
): SuggestionResult {
  if (games.length === 0) {
    return {
      game: null,
      isMatch: false,
      warningMessage: "Liste de jeu non implémentée",
    };
  }

  // 1. On liste nos étapes de dégradation (du plus strict au plus souple)
  const steps = [
    {
      console: criteria.selectedConsole,
      style: criteria.selectedStyle,
      status: criteria.selectedStatus,
      duration: criteria.maxDuration,
      isMatch: true,
    },
    {
      console: "Toutes", // On saute la console
      style: criteria.selectedStyle,
      status: criteria.selectedStatus,
      duration: criteria.maxDuration,
      isMatch: false,
    },
    {
      console: "Toutes",
      style: criteria.selectedStyle,
      status: criteria.selectedStatus,
      duration: Infinity, // On saute la durée
      isMatch: false,
    },
    {
      console: "Toutes",
      style: criteria.selectedStyle,
      status: "all", // On saute le statut
      duration: Infinity,
      isMatch: false,
    },
    {
      console: "Toutes",
      style: "Tous", // On saute le genre (dernier recours)
      status: "all",
      duration: Infinity,
      isMatch: false,
    },
  ];

  for (const step of steps) {
    const pool = filterGames(games, {
      searchQuery: "",
      selectedConsole: step.console,
      selectedStyle: step.style,
      selectedStatus: step.status,
      maxDuration: step.duration,
      sortBy: "alphabetical",
    });
    if (pool.length > 0) {
      const poolIndex = Math.floor(Math.random() * pool.length);

      return {
        game: pool[poolIndex],
        isMatch: step.isMatch,
        warningMessage: step.isMatch
          ? ""
          : "Aucun jeu n'a correspondu à l'ensemble de vos critères. \n Mais nous vous proposons celui qui répond le mieux à vos attentes...",
      };
    }
  }
  // 3. Repli ultime si la réserve de jeux est vide après tous les filtres
  return {
    game: null,
    isMatch: false,
    warningMessage:
      "Aucun jeu ne correspond, même après assouplissement des critères.",
  };
}

// =============================================================
//  PRECHARGE L'IMAGE DE GAMECARD LORS DU TIRAGE DE LA SUGGESTION
// =============================================================

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve(); // En cas d'erreur réseau, on ne bloque pas le jeu
  });
};

// =============================================================
// RETOURNE LE TOP 3 D'UN CRITÈRE (GENRE OU FRANCHISE)
// =============================================================
export function getTopPodium(
  games: Game[],
  getValue: (game: Game) => string | undefined,
): [string, number][] {
  // 1. Comptage des occurrences par catégorie
  const keyCounts = games.reduce(
    (counter, game) => {
      const key = getValue(game);
      if (!key) return counter;

      counter[key] = (counter[key] ?? 0) + 1;
      return counter;
    },
    {} as Record<string, number>,
  );

  // 2. Regroupement des noms par score
  const groupedByCount: Record<number, string[]> = {};
  for (const [key, count] of Object.entries(keyCounts)) {
    if (!groupedByCount[count]) {
      groupedByCount[count] = [];
    }
    groupedByCount[count].push(key);
  }

  // 3. Récupération des 3 meilleurs scores distincts
  let topCounts = Object.keys(groupedByCount)
    .map(Number)
    .sort((a, b) => b - a)
    .slice(0, 3);

  // 4. Masquage de la 3e position si elle est à 1 jeu
  if (topCounts.length === 3 && topCounts[2] === 1) {
    topCounts = topCounts.slice(0, 2);
  }

  // 5. Construction des lignes (tous les noms séparés par des virgules)
  return topCounts.map((count) => {
    const names = groupedByCount[count].sort((a, b) => a.localeCompare(b));

    return [names.join(" / "), count];
  });
}

// =============================================================
// RETOUR LISTE JEU D'UN EXTREME
// =============================================================
export function getRecordGames(
  games: Game[],
  getValue: (game: Game) => number | null | undefined,
  type: "max" | "min",
): Game[] {
  // 1. Isolation des jeux ayant une valeur numérique valide
  const validGames = games.filter((game) => {
    const key = getValue(game);
    return key != null && !Number.isNaN(key);
  });

  if (validGames.length === 0) return [];

  // 2. Calcul du pôle (valeur maximale ou minimale)
  const values = validGames.map((game) => getValue(game) as number);
  const targetValue =
    type === "max" ? Math.max(...values) : Math.min(...values);

  // 3. Filtrage des ex æquo et tri alphabétique par titre
  return validGames
    .filter((game) => getValue(game) === targetValue)
    .sort((a, b) => a.title.localeCompare(b.title));
}

// =============================================================
// INTITULÉS DES CRITÈRES DE RECORDS POUR L'AFFICHAGE
// =============================================================

export function getRecordColumnTitle(
  metric: string,
  game?: Game,
  type: "max" | "min" = "max",
): string {
  if (!game) {
    return type === "max"
      ? "Valeurs les plus hautes"
      : "Valeurs les plus basses";
  }

  switch (metric) {
    case "score": {
      const score = game.review?.score;
      if (score === undefined) {
        return type === "max" ? "Meilleures avis" : "Avis modestes";
      }
      return type === "max"
        ? `Meilleures notes (${score}/10)`
        : `Notes les plus modestes (${score}/10)`;
    }

    case "playtime": {
      const hours = game.review?.playtime ?? 0;
      return type === "max"
        ? `Plus long temps de jeu (${hours} h)`
        : `Plus court temps de jeu (${hours} h)`;
    }

    case "playtime_gap": {
      const actual = game.review?.playtime ?? 0;
      const estimated = game.estimatedPlaytime ?? 0;
      const gap = actual - estimated;
      const formattedGap = gap > 0 ? `+${gap} h` : `${gap} h`;

      return type === "max"
        ? `Plus gros dépassement (${formattedGap})`
        : `Jeux pliés le plus rapidement (${formattedGap})`;
    }

    case "completion_date": {
      const rawDate = game.review?.completedDate;
      const dateStr = rawDate
        ? new Date(rawDate).toLocaleDateString("fr-FR", {
            month: "short",
            year: "numeric",
          })
        : "";

      return type === "max"
        ? `Derniers jeux terminés (${dateStr})`
        : `Plus anciens jeux terminés (${dateStr})`;
    }

    case "yearly_summary": {
      const rawDate = game.review?.completedDate;
      const year = rawDate
        ? new Date(rawDate).getFullYear()
        : new Date().getFullYear();

      return `Bilan de l'année ${year}`;
    }

    default:
      return type === "max"
        ? "Valeurs les plus hautes"
        : "Valeurs les plus basses";
  }
}
