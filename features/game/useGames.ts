import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGamesContext } from "@/components/providers/GamesProvider";
import * as gameUtils from "./gameUtils";

// =========================================================================
// 1. HOOK MAIN & INITIALISATION
// =========================================================================
/** Hook orchestrateur gérant les filtres, le tri, le calcul mémoïsé et la sync URL de la liste */
export function useGames() {
  // searchParams : permet de lire les clés/valeurs présentés dans l'URL (ex: ?console=PS5&sort=score_descending)
  const searchParams = useSearchParams();
  // router : permet de modifier l'URL du navigateur dynamiquement sans recharger la page
  const router = useRouter();
  // pathname : renvoie le chemin actuel (ex: "/ma-liste")
  const pathname = usePathname();

  // Données issues du provider GamesProvider (chargées depuis l'API)
  const { games, consoles, loading } = useGamesContext();

  // =========================================================================
  // 2. ÉTATS LOCAUX (Initialisés depuis les paramètres d'URL)
  // =========================================================================
  // Initialise la recherche textuelle avec la valeur de l'URL ("q") ou une chaîne vide
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") ?? "",
  );
  // Initialise la console sélectionnée ("console") ou bascule sur la valeur par défaut
  const [selectedConsole, setSelectedConsole] = useState<string>(
    searchParams.get("console") ?? "Toutes",
  );
  // Initialise le genre sélectionné ("genre") ou bascule sur la valeur par défaut
  const [selectedGenre, setSelectedGenre] = useState<string>(
    searchParams.get("genre") ?? "Tous",
  );
  // Initialise le statut de complétion ("status") ou bascule sur la valeur par défaut
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("status") ?? "all",
  );
  // Extrait la durée maximale de l'URL ou applique le plafond par défaut (200 h)
  const [maxDuration, setMaxDuration] = useState<number>(
    searchParams.get("duration") && !isNaN(Number(searchParams.get("duration")))
      ? Number(searchParams.get("duration"))
      : 200,
  );
  // Initialise le critère de tri ("sort") ou applique le tri alphabétique par défaut
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") ?? "alphabetical",
  );

  // =========================================================================
  // 3. EFFETS DE SYNCHRONISATION (useEffect)
  // =========================================================================

  // Effet A : Validation de la cohérence de l'URL une fois les jeux chargés dans le Context
  useEffect(() => {
    if (games.length === 0) return;

    // Ajuste la durée maximale pour qu'elle reste comprise dans les bornes réelles de la BDD
    const { min: minTime, max: maxTime } = gameUtils.getPlaytimeBounds(games);
    const urlDuration = searchParams.get("duration");

    if (urlDuration) {
      const parsedDuration = Number(urlDuration);
      if (!isNaN(parsedDuration) && parsedDuration >= minTime) {
        setMaxDuration(Math.min(parsedDuration, maxTime));
      } else {
        setMaxDuration(maxTime);
      }
    } else {
      setMaxDuration(maxTime);
    }

    // Réinitialise le filtre de statut si la valeur dans l'URL est inconnue
    const validStatuses = gameUtils.OPTIONS_STATUS.map(
      (option) => option.value,
    );
    const urlStatus = searchParams.get("status");
    if (urlStatus && !validStatuses.includes(urlStatus)) {
      setSelectedStatus("all");
    }

    // Réinitialise le filtre de genre si la valeur dans l'URL n'existe pas dans le catalogue
    const validGenres = games.map((game) => game.genre);
    const urlGenre = searchParams.get("genre");
    if (urlGenre && urlGenre !== "Tous" && !validGenres.includes(urlGenre)) {
      setSelectedGenre("Tous");
    }

    // Réinitialise la console si la valeur dans l'URL est introuvable
    const validConsoles = games.map((game) => game.console);
    const urlConsole = searchParams.get("console");
    if (
      urlConsole &&
      urlConsole !== "Toutes" &&
      !validConsoles.includes(urlConsole)
    ) {
      setSelectedConsole("Toutes");
    }

    // Réinitialise le tri si le critère précisé dans l'URL n'existe pas
    const validSorts = gameUtils.OPTIONS_SORT.map((option) => option.value);
    const urlSort = searchParams.get("sort");
    if (urlSort && !validSorts.includes(urlSort)) {
      setSortBy("alphabetical");
    }
  }, [games, searchParams]);

  // Effet B : Synchronisation inverse (du State vers l'URL)
  // À chaque fois qu'un filtre change dans l'application, on met à jour la barre d'adresse
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedConsole !== "Toutes") params.set("console", selectedConsole);
    if (selectedGenre !== "Tous") params.set("genre", selectedGenre);
    if (selectedStatus !== "all") params.set("status", selectedStatus);
    if (sortBy !== "alphabetical") params.set("sort", sortBy);

    const { max: maxPlaytime } = gameUtils.getPlaytimeBounds(games);
    if (maxDuration < maxPlaytime) {
      params.set("duration", maxDuration.toString());
    }

    const search = params.toString();
    const query = search ? `?${search}` : "";
    // Met à jour l'URL du navigateur sans déclencher d'actualisation
    window.history.replaceState(null, "", `${pathname}${query}`);
  }, [
    searchQuery,
    selectedConsole,
    selectedGenre,
    selectedStatus,
    maxDuration,
    sortBy,
    games,
    pathname,
    router,
  ]);

  // =============================================================
  // 4. VALEURS CALCULÉES ET OPTIMISÉES (useMemo)
  // =============================================================
  // PORQUOI UTILISER useMemo ICI ?
  // Sans useMemo, React réexécuterait ces calculs lourds (ex: boucler sur des centaines de jeux,
  // filtrer et trier) à CHAQUE ré-affichage du composant parent.

  // =========================================================================
  // 4. CALCULS MÉMOÏSÉS (useMemo) useMemo met le résultat en "mise en cache" et ne le re-calcule QUE si l'une des dépendances change.
  // =========================================================================
  // Calcule les bornes minimales et maximales de durée uniquement si la liste brute de jeux change
  // 1. Bornes du slider (Min/Max) : Re-calculé UNIQUEMENT si le tableau initial "games" change.
  const bounds = useMemo(() => gameUtils.getPlaytimeBounds(games), [games]);

  // 2. Génère la liste des options du Select Console uniquement si le tableau des consoles change
  const consoleOptions = useMemo(
    () => gameUtils.getConsoleOptions(consoles),
    [consoles],
  );

  // 3. Génère la liste des genres uniques extraits des jeux
  const genreOptions = useMemo(() => gameUtils.getGenreOptions(games), [games]);

  // 4. Effectue le filtrage et le tri principal uniquement si les jeux ou l'un des critères de filtre évoluent
  const filteredGames = useMemo(
    () =>
      gameUtils.filterGames(games, {
        searchQuery,
        selectedConsole,
        selectedGenre,
        selectedStatus,
        maxDuration,
        sortBy,
      }),
    [
      games,
      searchQuery,
      selectedConsole,
      selectedGenre,
      selectedStatus,
      maxDuration,
      sortBy,
    ],
  );

  // =========================================================================
  // 5. RETOUR
  // =========================================================================
  // Exporte les données calculées et les fonctions d'action vers le composant de vue
  return {
    games: filteredGames,
    loading,
    bounds,
    consoleOptions,
    genreOptions,
    filters: {
      searchQuery,
      selectedConsole,
      selectedGenre,
      selectedStatus,
      maxDuration,
      sortBy,
    },
    setters: {
      setSearchQuery,
      setSelectedConsole,
      setSelectedGenre,
      setSelectedStatus,
      setMaxDuration,
      setSortBy,
    },
  };
}
