import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Game } from "@/types/game";
import { OPTIONS_SORT } from "./sortOptions";

/**
 * Custom Hook : useGames
 *
 * Charge les jeux depuis l'API et gère les états de tous les filtres et du tri.
 * Valide également la cohérence des paramètres présents dans l'URL.
 */
export function useGames() {
  const searchParams = useSearchParams();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialisation avec lecture d'URL
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
    Number(searchParams.get("duration")) ?? 200,
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") ?? "alphabetical",
  );

  useEffect(() => {
    async function fetchGames() {
      try {
        const reponse = await fetch("/api/games");
        const data: Game[] = await reponse.json();
        setGames(data);

        if (data.length > 0) {
          // Validation de la durée
          const urlDuration = searchParams.get("duration");
          const playtimes = data.map((game) => game.estimatedPlaytime);
          const minTime = Math.min(...playtimes);
          const maxTime = Math.max(...playtimes);

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

          // Validation du style
          const validStyles = data.map((game) => game.genre);
          const urlStyle = searchParams.get("style");
          if (
            urlStyle &&
            urlStyle !== "Tous" &&
            !validStyles.includes(urlStyle)
          ) {
            setSelectedStyle("Tous");
          }

          // Validation de la console
          const validConsoles = data.map((game) => game.console);
          const urlConsole = searchParams.get("console");
          if (
            urlConsole &&
            urlConsole !== "Toutes" &&
            !validConsoles.includes(urlConsole)
          ) {
            setSelectedConsole("Toutes");
          }

          // Validation du tri
          const validSorts = OPTIONS_SORT.map((option) => option.value);
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

  return {
    games,
    loading,
    searchQuery,
    setSearchQuery,
    selectedConsole,
    setSelectedConsole,
    selectedStyle,
    setSelectedStyle,
    selectedStatus,
    setSelectedStatus,
    maxDuration,
    setMaxDuration,
    sortBy,
    setSortBy,
  };
}
