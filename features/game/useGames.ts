import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Game } from "@/types/game";
import * as gameUtils from "./gameUtils";

/**
 * Custom Hook : useGames
 *
 * OBJECTIF ET RÔLE :
 * Ce hook sert de "chef d'orchestre" pour toute la logique de la page.
 * Plutôt que de tout mélanger dans un composant d'affichage (MaListe.tsx), ce hook :
 * 1. Maintient l'état local des filtres (recherche, console, style, statut, durée, tri).
 * 2. Récupère la donnée brute depuis l'API (/api/games) au chargement.
 * 3. Valide et synchronise en temps réel les filtres avec les paramètres d'URL (URLSearchParams).
 * 4. Effectue le filtrage/tri de manière optimisée (useMemo) avant de livrer le résultat.
 */
export function useGames() {
  // =============================================================
  // 1. NAVIGATION & HOOKS NEXT.JS
  // =============================================================
  // searchParams : permet de lire les clés/valeurs présentés dans l'URL (ex: ?console=PS5&sort=score_descending)
  const searchParams = useSearchParams();
  // router : permet de modifier l'URL du navigateur dynamiquement sans recharger la page
  const router = useRouter();
  // pathname : renvoie le chemin actuel (ex: "/ma-liste")
  const pathname = usePathname();

  // =============================================================
  // 2. ÉTATS DU COMPOSANT (useState)
  // =============================================================
  // Données brutes issues de l'API
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialisation des filtres : si un paramètre existe déjà dans l'URL à l'arrivée,
  // on l'utilise direct comme valeur initiale, sinon on applique la valeur par défaut.
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") ?? "",
  );
  const [selectedConsole, setSelectedConsole] = useState<string>(
    searchParams.get("console") ?? "Toutes",
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(
    searchParams.get("style") ?? "Tous",
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("status") ?? "all",
  );
  const [maxDuration, setMaxDuration] = useState<number>(
    searchParams.get("duration") && !isNaN(Number(searchParams.get("duration")))
      ? Number(searchParams.get("duration"))
      : 200,
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") ?? "alphabetical",
  );

  // =============================================================
  // 3. EFFETS (useEffect)
  // =============================================================

  // Effet A : Chargement initial des jeux + Validation de la cohérence de l'URL
  useEffect(() => {
    async function fetchGames() {
      try {
        const reponse = await fetch("/api/games");
        const data: Game[] = await reponse.json();
        setGames(data);

        // Sécurité URL : si l'utilisateur saisit manuellement une valeur invalide dans l'URL (ex: ?style=Inexistant)
        if (data.length > 0) {
          const { min: minTime, max: maxTime } =
            gameUtils.getPlaytimeBounds(data);
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

          const validStyles = data.map((game) => game.genre);
          const urlStyle = searchParams.get("style");
          if (
            urlStyle &&
            urlStyle !== "Tous" &&
            !validStyles.includes(urlStyle)
          ) {
            setSelectedStyle("Tous");
          }

          const validConsoles = data.map((game) => game.console);
          const urlConsole = searchParams.get("console");
          if (
            urlConsole &&
            urlConsole !== "Toutes" &&
            !validConsoles.includes(urlConsole)
          ) {
            setSelectedConsole("Toutes");
          }

          const validSorts = gameUtils.OPTIONS_SORT.map(
            (option) => option.value,
          );
          const urlSort = searchParams.get("sort");
          if (urlSort && !validSorts.includes(urlSort)) {
            setSortBy("alphabetical");
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des jeux :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  // Effet B : Synchronisation inverse (du State vers l'URL)
  // À chaque fois qu'un filtre change dans l'application, on met à jour la barre d'adresse
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedConsole !== "Toutes") params.set("console", selectedConsole);
    if (selectedStyle !== "Tous") params.set("style", selectedStyle);
    if (selectedStatus !== "all") params.set("status", selectedStatus);
    if (sortBy !== "alphabetical") params.set("sort", sortBy);

    const { max: maxPlaytime } = gameUtils.getPlaytimeBounds(games);
    if (maxDuration < maxPlaytime) {
      params.set("duration", maxDuration.toString());
    }

    const search = params.toString();
    const query = search ? `?${search}` : "";
    // replace met à jour l'URL à la volée sans ajouter d'entrée inutile dans l'historique de retour
    router.replace(`${pathname}${query}`, { scroll: false });
  }, [
    searchQuery,
    selectedConsole,
    selectedStyle,
    selectedStatus,
    maxDuration,
    sortBy,
    games,
    pathname,
    router,
  ]);

  // Effet C : Sauvegarde de l'URL complète actuelle dans le sessionStorage
  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`;
    sessionStorage.setItem("lastCatalogUrl", currentUrl);
  }, [pathname, searchParams]);

  // =============================================================
  // 4. VALEURS CALCULÉES ET OPTIMISÉES (useMemo)
  // =============================================================
  // PORQUOI UTILISER useMemo ICI ?
  // Sans useMemo, React réexécuterait ces calculs lourds (ex: boucler sur des centaines de jeux,
  // filtrer et trier) à CHAQUE ré-affichage du composant parent.
  // useMemo met le résultat en "mise en cache" et ne le re-calcule QUE si l'une des dépendances change.

  // 1. Bornes du slider (Min/Max) : Re-calculé UNIQUEMENT si le tableau initial "games" change.
  const bounds = useMemo(() => gameUtils.getPlaytimeBounds(games), [games]);

  // 2. Options dynamiques de Select : Extraient la liste unique des consoles/styles
  // Re-calculées UNIQUEMENT si la liste des jeux bruts change.
  const consoleOptions = useMemo(
    () => gameUtils.getConsoleOptions(games),
    [games],
  );

  const styleOptions = useMemo(() => gameUtils.getStyleOptions(games), [games]);

  // 3. Liste finale filtrée et triée :
  // Re-calculée uniquement si "games" OU l'un des critères de filtrage/tri change.
  const filteredGames = useMemo(
    () =>
      gameUtils.filterGames(games, {
        searchQuery,
        selectedConsole,
        selectedStyle,
        selectedStatus,
        maxDuration,
        sortBy,
      }),
    [
      games,
      searchQuery,
      selectedConsole,
      selectedStyle,
      selectedStatus,
      maxDuration,
      sortBy,
    ],
  );

  // =============================================================
  // 5. RETOUR DU HOOK ("Le Paquet Cadeau")
  // =============================================================
  // Un hook ne peut faire qu'UN SEUL return d'un objet.
  // On regroupe tout ce dont les composants React (ex: MaListe.tsx) auront besoin :
  // - Les données nettoyées/filtrées (games, bounds, consoleOptions, etc.)
  // - L'état de chargement (loading)
  // - Les valeurs actuelles des filtres regroupées sous "filters"
  // - Les fonctions de mise à jour regroupées sous "setters"
  return {
    games: filteredGames,
    loading,
    bounds,
    consoleOptions,
    styleOptions,
    filters: {
      searchQuery,
      selectedConsole,
      selectedStyle,
      selectedStatus,
      maxDuration,
      sortBy,
    },
    setters: {
      setSearchQuery,
      setSelectedConsole,
      setSelectedStyle,
      setSelectedStatus,
      setMaxDuration,
      setSortBy,
    },
  };
}
