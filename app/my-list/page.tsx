"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useGames } from "@/features/game/useGames";
import ListHeader from "@/components/game/ListHeader";
import { OPTIONS_SORT, OPTIONS_STATUS } from "@/features/game/gameUtils";

import LayoutFull from "@/components/layout/LayoutFull";
import FilterPanel from "@/components/game/FilterPanel";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import GameCard from "@/components/game/GameCard";

export default function MaListe() {
  const [animation] = useAutoAnimate();
  const {
    games,
    loading,
    bounds,
    consoleOptions,
    styleOptions,
    filters,
    setters,
  } = useGames();

  return (
    <LayoutFull title="Ma liste">
      {/* PANNEAU GAUCHE : FILTRES */}
      <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
        <FilterPanel>
          <Input
            placeholder="Rechercher un jeu..."
            value={filters.searchQuery}
            onChange={(e) => setters.setSearchQuery(e.target.value)}
          />
          <Select
            label="Console"
            options={consoleOptions}
            selectedValue={filters.selectedConsole}
            onChange={setters.setSelectedConsole}
          />
          <Select
            label="Style"
            options={styleOptions}
            selectedValue={filters.selectedStyle}
            onChange={setters.setSelectedStyle}
          />
          <Select
            label="Statut"
            options={OPTIONS_STATUS}
            selectedValue={filters.selectedStatus}
            onChange={setters.setSelectedStatus}
          />
          <RangeInput
            label="Durée de vie maximale"
            value={filters.maxDuration}
            onChange={setters.setMaxDuration}
            min={bounds.min}
            max={bounds.max}
            step={1}
            unit="h"
          />
        </FilterPanel>
      </section>

      {/* PANNEAU DROIT : LISTE & TRI */}
      <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
        {/* En-tête fixe réutilisable */}
        <ListHeader
          title="Liste de jeux"
          totalResults={games.length}
          sortBy={filters.sortBy}
          onSortChange={setters.setSortBy}
          optionsSort={OPTIONS_SORT}
        />

        {/* Grille de jeux */}
        <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          {loading ? (
            <p className="p-8 text-gray-400">Chargement des jeux...</p>
          ) : games.length === 0 ? (
            <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 "
              ref={animation}
            >
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </section>
    </LayoutFull>
  );
}
