import { Game } from "@/types/game";
import { Console } from "@/types/console";

// =========================================================================
// 1. OPTIONS STATIQUES (Listes fixes partagées)
// =========================================================================

/** Options de filtrage par état de complétion d'un jeu */
export const OPTIONS_STATUS = [
  { label: "Tous", value: "all" },
  { label: "Terminé", value: "completed" },
  { label: "Non terminé", value: "not_completed" },
];

/** Options des différents critères de tri disponibles pour le catalogue */
export const OPTIONS_SORT = [
  { label: "Nom : Alphabétique", value: "alphabetical" },
  { label: "Nom : Anti-Alphabétique", value: "anti_alphabetical" },
  { label: "Date de sortie : Croissante", value: "releaseDate_ascending" },
  { label: "Date de sortie : Décroissante", value: "releaseDate_descending" },
  { label: "Durée de vie : Croissante", value: "estimatedPlaytime_ascending" },
  {
    label: "Durée de vie : Décroissante",
    value: "estimatedPlaytime_descending",
  },
  { label: "Note : Croissante", value: "score_ascending" },
  { label: "Note : Décroissante", value: "score_descending" },
];

/** Métriques de comparaison utilisables dans le panneau des records des statistiques */
export const OPTIONS_RECORD_METRICS = [
  { label: "Notes attribuées", value: "score" },
  { label: "Temps de jeu", value: "playtime" },
  { label: "Écart de temps", value: "playtime_gap" },
  { label: "Date de complétion", value: "completion_date" },
];

// =========================================================================
// 2. OPTIONS DYNAMIQUES (Select & RangeInput)
// =========================================================================

/** Calcule les limites min et max de durée de vie estimée parmi les jeux */
export function getPlaytimeBounds(games: Game[]) {
  // Recherche la valeur maximale avec fallback de sécurité à 200 h
  const maxEstimatedPlaytime =
    games.length > 0
      ? Math.max(...games.map((game) => game.estimatedPlaytime))
      : 200;

  // Recherche la valeur minimale avec fallback de sécurité à 0 h
  const minEstimatedPlaytime =
    games.length > 0
      ? Math.min(...games.map((game) => game.estimatedPlaytime))
      : 0;

  return { min: minEstimatedPlaytime, max: maxEstimatedPlaytime };
}

/** Transforme la liste des consoles en un tableau d'options pour le composant Select */
export function getConsoleOptions(consoles: Console[]) {
  return [
    { label: "Toutes", value: "Toutes" },
    ...consoles.map((console) => ({
      label: console.full_name || console.short_name,
      value: console.short_name,
    })),
  ];
}

/** Génère les onglets de consoles sous forme de tableau simplifié */
export function getConsoleTabs(consoles: Console[]) {
  return [
    { label: "Toutes", value: "Toutes" },
    ...consoles.map((c) => ({
      label: c.short_name,
      value: c.short_name,
    })),
  ];
}

/** Extrait et trie la liste unique des genres présents dans le catalogue */
export function getGenreOptions(games: Game[]) {
  return [
    { label: "Tous", value: "Tous" },
    // Déduplique les genres avec Set et effectue un tri alphabétique sur les labels
    ...Array.from(new Set(games.map((jeu) => jeu.genre)))
      .map((nomGenre) => ({
        label: nomGenre,
        value: nomGenre,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
}

// =========================================================================
// 3. FEATURE : /list
// =========================================================================

/** Contrat d'interface regroupant les critères de filtrage actifs */
export interface GameFilters {
  searchQuery: string;
  selectedConsole: string;
  selectedGenre: string;
  selectedStatus: string;
  maxDuration: number;
  sortBy: string;
}

/** Filtre et trie séquentiellement la liste des jeux selon les critères appliqués */
export function filterGames(games: Game[], filters: GameFilters): Game[] {
  return games
    .filter(
      (game) =>
        // Filtre la durée maximale
        game.estimatedPlaytime <= filters.maxDuration &&
        // Filtre la console supportée
        (filters.selectedConsole === "Toutes" ||
          game.console === filters.selectedConsole) &&
        // Filtre le genre du jeu
        (filters.selectedGenre === "Tous" ||
          game.genre === filters.selectedGenre) &&
        // Filtre le statut de complétion (terminé / non terminé)
        (filters.selectedStatus === "all" ||
          (filters.selectedStatus === "completed" &&
            game.review?.score != null) ||
          (filters.selectedStatus === "not_completed" &&
            game.review?.score == null)) &&
        // Recherche textuelle insensible à la casse
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
      // Applique un tri alphabétique secondaire en cas d'égalité stricte
      return diff !== 0 ? diff : a.title.localeCompare(b.title);
    });
}

// =========================================================================
// 4. FEATURE : /game/[id]
// =========================================================================

/** Extrait un sous-ensemble de 3 jeux proches au sein d'une même franchise */
export function getRelatedFranchiseGames(
  currentGame: Game,
  franchiseGames: Game[],
): Game[] {
  // Ordonne les jeux de la franchise par date de sortie croissante
  const sortedGames = [...franchiseGames].sort(
    (a, b) =>
      new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
  );

  // Recherche la position de l'opus sélectionné
  const currentIndex = sortedGames.findIndex((g) => g.id === currentGame.id);
  if (currentIndex === -1) return [];

  // Isole les opus sortis avant et après l'opus courant
  const gamesBefore = sortedGames.slice(0, currentIndex);
  const gamesAfter = sortedGames.slice(currentIndex + 1);

  let countBefore = 1;
  let countAfter = 2;

  // Réajuste les quotas si un côté manque de jeux
  if (gamesBefore.length < 1) {
    countAfter += 1 - gamesBefore.length;
  }
  if (gamesAfter.length < 2) {
    countBefore += 2 - gamesAfter.length;
  }

  // Extrait les jeux correspondants aux quotas ajustés
  const selectedBefore = gamesBefore.slice(-countBefore);
  const selectedAfter = gamesAfter.slice(0, countAfter);

  return [...selectedBefore, ...selectedAfter];
}

/** Formate une date YYYY-MM en chaîne littérale française (ex: "Mars 2024") */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  // Découpe l'année et le mois pour ignorer les décalages de fuseaux horaires UTC
  const [year, month] = dateString.split("-").map(Number);
  if (!year || !month) return dateString;

  const date = new Date(year, month - 1);
  const formatted = date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  // Met en majuscule l'initiale du mois
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// =========================================================================
// 5. FEATURE : /suggestion
// =========================================================================

/** Contrat représentant les critères de tirage saisis par l'utilisateur */
export interface SuggestionCriteria {
  selectedConsole: string;
  selectedGenre: string;
  selectedStatus: string;
  maxDuration: number;
}

/** Structure du résultat retourné après exécution d'un tirage gacha */
export interface SuggestionResult {
  game: Game | null;
  isMatch: boolean;
  warningMessage?: string;
}

/** Effectue un tirage aléatoire en assouplissant progressivement les critères en cas de vide */
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

  // Définit la suite des règles de repli (du filtrage strict vers le plus permissif)
  const steps = [
    {
      console: criteria.selectedConsole,
      genre: criteria.selectedGenre,
      status: criteria.selectedStatus,
      duration: criteria.maxDuration,
      isMatch: true,
    },
    {
      console: "Toutes",
      genre: criteria.selectedGenre,
      status: criteria.selectedStatus,
      duration: criteria.maxDuration,
      isMatch: false,
    },
    {
      console: "Toutes",
      genre: criteria.selectedGenre,
      status: criteria.selectedStatus,
      duration: Infinity,
      isMatch: false,
    },
    {
      console: "Toutes",
      genre: criteria.selectedGenre,
      status: "all",
      duration: Infinity,
      isMatch: false,
    },
    {
      console: "Toutes",
      genre: "Tous",
      status: "all",
      duration: Infinity,
      isMatch: false,
    },
  ];

  // Parcourt les niveaux d'assouplissement jusqu'à trouver une réserve de jeux valide
  for (const step of steps) {
    const pool = filterGames(games, {
      searchQuery: "",
      selectedConsole: step.console,
      selectedGenre: step.genre,
      selectedStatus: step.status,
      maxDuration: step.duration,
      sortBy: "alphabetical",
    });

    if (pool.length > 0) {
      // Tire un élément au hasard au sein du réservoir valide
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

  return {
    game: null,
    isMatch: false,
    warningMessage:
      "Aucun jeu ne correspond, même après assouplissement des critères.",
  };
}

// =========================================================================
// 6. FEATURE : /statistiques
// =========================================================================

/** Extrait le classement Top 3 selon une propriété textuelle donnée (ex: genre ou franchise) */
export function getTopPodium(
  games: Game[],
  getValue: (game: Game) => string | undefined,
): [string, number][] {
  // Compte l'occurrence de chaque catégorie
  const keyCounts = games.reduce(
    (counter, game) => {
      const key = getValue(game);
      if (!key) return counter;

      counter[key] = (counter[key] ?? 0) + 1;
      return counter;
    },
    {} as Record<string, number>,
  );

  // Regroupe les valeurs identiques sous une même occurrence
  const groupedByCount: Record<number, string[]> = {};
  for (const [key, count] of Object.entries(keyCounts)) {
    if (!groupedByCount[count]) {
      groupedByCount[count] = [];
    }
    groupedByCount[count].push(key);
  }

  // Conserve uniquement les 3 scores distincts les plus élevés
  let topCounts = Object.keys(groupedByCount)
    .map(Number)
    .sort((a, b) => b - a)
    .slice(0, 3);

  // Masque le 3e niveau si la valeur associée est égale à 1
  if (topCounts.length === 3 && topCounts[2] === 1) {
    topCounts = topCounts.slice(0, 2);
  }

  // Construit les paires finales (noms regroupés par slash / nombre)
  return topCounts.map((count) => {
    const names = groupedByCount[count].sort((a, b) => a.localeCompare(b));
    return [names.join(" / "), count];
  });
}

/** Recherche la liste des jeux détenant une valeur extrême (maximale ou minimale) */
export function getRecordGames(
  games: Game[],
  getValue: (game: Game) => number | null | undefined,
  type: "max" | "min",
): Game[] {
  // Filtre les jeux possédant une métrique numérique valide
  const validGames = games.filter((game) => {
    const key = getValue(game);
    return key != null && !Number.isNaN(key);
  });

  if (validGames.length === 0) return [];

  // Calcule la valeur cible extrême (min ou max)
  const values = validGames.map((game) => getValue(game) as number);
  const targetValue =
    type === "max" ? Math.max(...values) : Math.min(...values);

  // Isole les ex æquo et trie par ordre alphabétique
  return validGames
    .filter((game) => getValue(game) === targetValue)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Formate l'intitulé dynamique d'un en-tête de colonne de record pour les statistiques */
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
        return type === "max" ? "Meilleurs avis" : "Avis modestes";
      }
      return type === "max"
        ? `Meilleurs avis (${score}/10)`
        : `Avis modestes (${score}/10)`;
    }

    case "playtime": {
      const hours = game.review?.playtime ?? 0;
      return type === "max"
        ? `Temps de jeu le plus élevé (${hours} h)`
        : `Temps de jeu le plus faible (${hours} h)`;
    }

    case "playtime_gap": {
      const actual = game.review?.playtime ?? 0;
      const estimated = game.estimatedPlaytime ?? 0;
      const gap = actual - estimated;
      const formattedGap = gap > 0 ? `+${gap} h` : `${gap} h`;

      return type === "max"
        ? `Plus gros dépassement d'estimation (${formattedGap})`
        : `Plus grande avance sur l'estimation (${formattedGap})`;
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
        : `Premiers jeux terminés (${dateStr})`;
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
