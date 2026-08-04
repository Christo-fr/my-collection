"use client";

import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import GameCard from "@/components/game/GameCard";
import FilterPanel from "@/components/game/FilterPanel";
import ListHeader from "@/components/game/ListHeader";

// Import unique depuis le module feature "game"
import {
  useGames,
  filterAndSortGames,
  getConsoleOptions,
  getStyleOptions,
  OPTIONS_STATUS,
} from "@/features/game";

export default function MaListe() {
  const router = useRouter();
  const pathname = usePathname();

  const {
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
  } = useGames();

  // Bornes de durée calculées sur les données chargées
  const maxEstimatedPlaytime =
    games.length > 0 ? Math.max(...games.map((g) => g.estimatedPlaytime)) : 200;
  const minEstimatedPlaytime =
    games.length > 0 ? Math.min(...games.map((g) => g.estimatedPlaytime)) : 0;

  // Options calculées
  const optionsConsole = useMemo(() => getConsoleOptions(games), [games]);
  const optionsStyle = useMemo(() => getStyleOptions(games), [games]);

  // Synchronisation des filtres avec l'URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedConsole !== "Toutes") params.set("console", selectedConsole);
    if (selectedStyle !== "Tous") params.set("style", selectedStyle);
    if (selectedStatus !== "all") params.set("status", selectedStatus);
    if (sortBy !== "alphabetical") params.set("sort", sortBy);
    if (maxDuration < maxEstimatedPlaytime) {
      params.set("duration", maxDuration.toString());
    }

    const search = params.toString();
    const query = search ? `?${search}` : "";
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

  // Filtrage et tri délégués
  const filteredGames = useMemo(
    () =>
      filterAndSortGames(games, {
        maxDuration,
        selectedConsole,
        selectedStyle,
        selectedStatus,
        searchQuery,
        sortBy,
      }),
    [
      games,
      maxDuration,
      selectedConsole,
      selectedStyle,
      selectedStatus,
      searchQuery,
      sortBy,
    ],
  );

  return (
    <div className="relative w-full h-full flex flex-col px-12 pt-4 pb-18 gap-4">
      <Heading as="h1" size="xl">
        Ma liste
      </Heading>

      <div className="w-full flex flex-col lg:flex-row gap-4 flex-1 min-h-0 p-2 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70">
        <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
          <FilterPanel>
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
              options={OPTIONS_STATUS}
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
          </FilterPanel>
        </section>

        <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
          <ListHeader
            totalResults={filteredGames.length}
            sortBy={sortBy}
            onSortChange={(val) => setSortBy(val)}
          />

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
      </div>
    </div>
  );
}
