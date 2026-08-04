"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import LayoutFull from "@/components/layout/LayoutFull";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import GameCard from "@/components/game/GameCard";
import { Game } from "@/types/game";

export default function MaListe() {
  // =============================================================
  // 1. NAVIGATION & NEXT.JS HOOKS
  // =============================================================
  // permet de lire les paramètres actuels de l'URL
  const searchParams = useSearchParams();
  // permet de mettre à jour l'URL sans recharger la page
  const router = useRouter();
  // donne le chemin actuel
  const pathname = usePathname();

  // =============================================================
  // 2. ÉTATS DU COMPOSANT (useState)
  // =============================================================
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

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

  // =============================================================
  // 3. OPTIONS STATIQUES (Listes fixes)
  // =============================================================
  // 4. Options pour le tri des jeux
  const optionsSort = [
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

  // 3. Options pour le statut des jeux
  const optionsStatut = [
    { label: "Tous", value: "all" },
    { label: "Terminé", value: "completed" },
    { label: "Non terminé", value: "not_completed" },
  ];

  // =============================================================
  // 4. CALCULS SIMPLES (Sur les données reçues)
  // =============================================================
  // Calcul de la durée de vie maximale parmi tous les jeux pour définir la valeur maximale du RangeInput
  const maxEstimatedPlaytime =
    // Sécurité si les données ne sont pas encore chargés
    games.length > 0
      ? Math.max(...games.map((game) => game.estimatedPlaytime))
      : 200;

  // Calcul de la durée de vie minimale parmi tous les jeux pour définir la valeur minimale du RangeInput
  const minEstimatedPlaytime =
    // Sécurité si les données ne sont pas encore chargés
    games.length > 0
      ? Math.min(...games.map((game) => game.estimatedPlaytime))
      : 0;

  // =============================================================
  // 5. EFFETS (useEffect)
  // =============================================================
  // Chargement des jeux depuis l'API et validation des paramètres d'URL
  useEffect(() => {
    async function fetchGames() {
      try {
        const reponse = await fetch("/api/games"); // Appel l'adresse web
        const data: Game[] = await reponse.json(); // Receptionne la réponse et la transforme en tableau d'objets
        setGames(data); // Elle dépose les valeurs grâce à setGames
        if (data.length > 0) {
          // 1. Validation de la durée
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
          // 2. Validation du style
          const validStyles = data.map((game) => game.genre);
          const urlStyle = searchParams.get("style");
          if (
            urlStyle &&
            urlStyle !== "Tous" &&
            !validStyles.includes(urlStyle)
          ) {
            setSelectedStyle("Tous");
          }

          // 3. Validation de la console
          const validConsoles = data.map((game) => game.console);
          const urlConsole = searchParams.get("console");
          if (
            urlConsole &&
            urlConsole !== "Toutes" &&
            !validConsoles.includes(urlConsole)
          ) {
            setSelectedConsole("Toutes");
          }
          // 4. Validation du tri
          const validSorts = optionsSort.map((option) => option.value);
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

  // Mise à jour de l'URL en fonction des filtres sélectionnés
  useEffect(() => {
    const params = new URLSearchParams();

    // 1. Recherche textuelle
    if (searchQuery) {
      params.set("q", searchQuery);
    }

    if (selectedConsole !== "Toutes") {
      params.set("console", selectedConsole);
    }

    if (selectedStyle !== "Tous") {
      params.set("style", selectedStyle);
    }

    if (selectedStatus !== "all") {
      params.set("status", selectedStatus);
    }

    if (sortBy !== "alphabetical") {
      params.set("sort", sortBy);
    }

    // 6. Durée max (si maxDuration est défini)
    if (maxDuration < maxEstimatedPlaytime) {
      params.set("duration", maxDuration.toString());
    }

    // Mise à jour de l'URL
    const search = params.toString();
    const query = search ? `?${search}` : "";
    // replace permet de mettre à jour l'URL à la volée, et evite aussi le scroll to top
    router.replace(`${pathname}${query}`, { scroll: false });
  }, [
    searchQuery,
    selectedConsole,
    selectedStyle,
    selectedStatus,
    maxDuration,
    sortBy,
    maxEstimatedPlaytime,
    pathname,
    router,
  ]);

  // =============================================================
  // 6. OPTIONS DYNAMIQUES (Calculées depuis les données API)
  // =============================================================
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

  // =============================================================
  // 7. FILTRAGE ET TRI DES JEUX (useMemo)
  // =============================================================
  // Filtrage et tri des jeux en fonction des critères sélectionnés
  // useMemo : React garde le tableau filtré en mémoire et ne ré-exécute le filtrage/tri QUE si l'une des dépendances change
  const filteredGames = useMemo(
    () =>
      games
        .filter(
          (game) =>
            // 1. Filtre sur la durée
            game.estimatedPlaytime <= maxDuration &&
            // 2. Filtre sur la console
            (selectedConsole === "Toutes" ||
              game.console === selectedConsole) &&
            // 3. Filtre sur le style/genre
            (selectedStyle === "Tous" || game.genre === selectedStyle) &&
            // 4. Filtre sur le statut (terminé / non terminé)
            (selectedStatus === "all" ||
              (selectedStatus === "completed" && game.review?.score != null) ||
              (selectedStatus === "not_completed" &&
                game.review?.score == null)) &&
            // 5. Filtre sur la recherche textuelle
            game.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
          let diff = 0;
          switch (sortBy) {
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
  // 8. RENDU JSX
  // =============================================================
  return (
    <LayoutFull title="Ma liste">
      <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
        {/* En-tête fixe */}
        <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
          <h2 className="text-lg font-semibold tracking-wide uppercase">
            Filtres
          </h2>
        </div>

        {/* Formulaire : scroll uniquement sur Desktop */}
        <div className="space-y-4 px-2 py-4 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          <Input
            placeholder="Rechercher un jeu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            label="Console"
            options={optionsConsole}
            selectedValue={selectedConsole}
            onChange={(val) => setSelectedConsole(val)}
          />

          <Select
            label="Style"
            options={optionsStyle}
            selectedValue={selectedStyle}
            onChange={(val) => setSelectedStyle(val)}
          />

          <Select
            label="Statut"
            options={optionsStatut}
            selectedValue={selectedStatus}
            onChange={(val) => setSelectedStatus(val)}
          />

          <RangeInput
            label="Durée de vie maximale"
            value={maxDuration}
            onChange={(val) => setMaxDuration(val)}
            min={minEstimatedPlaytime}
            max={maxEstimatedPlaytime}
            step={1}
            unit="h"
          />
        </div>
      </section>
      {/* PANNEAU DROIT */}
      <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
        {/* En-tête fixe */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-main/10 px-2 md:h-12 lg:flex-shrink-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold tracking-wide uppercase">
              Liste de jeux
            </h2>
            <span className="text-sm text-main/60">
              ({filteredGames.length} résultats)
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="text-xs font-medium text-main/80">Tri </label>
            <div className="w-full md:w-60">
              <Select
                options={optionsSort}
                selectedValue={sortBy}
                onChange={(val) => setSortBy(val)}
              />
            </div>
          </div>
        </div>

        {/* Grille : scroll uniquement sur Desktop */}
        <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          {loading ? (
            <p className="p-8 text-gray-400">Chargement des jeux...</p>
          ) : filteredGames.length === 0 ? (
            <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </section>
    </LayoutFull>
  );
}
