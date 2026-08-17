"use client";

import { useGames } from "@/features/game/useGames";
import ListHeader from "@/components/game/ListHeader";
import { OPTIONS_SORT, OPTIONS_STATUS } from "@/features/game/gameUtils";

import LayoutFull from "@/components/layout/LayoutFull";
import FilterPanel from "@/components/game/FilterPanel";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Gamepad, FilePlus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import AdminGameCard from "@/components/admin/AdminGameCard";

export default function Administration() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const {
    games,
    loading,
    bounds,
    consoleOptions,
    styleOptions,
    filters,
    setters,
  } = useGames();

  // Clé composite pour rejouer l'animation de fondu à chaque changement de filtre
  const gridKey = `${filters.selectedConsole}-${filters.selectedStyle}-${filters.selectedStatus}-${filters.sortBy}-${filters.searchQuery}-${filters.maxDuration}`;

  // =========================================================================
  // 2. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <LayoutFull title="Administration">
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
          {/* CHIFFRES CLÉS */}
          <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 ">
            <Heading
              as="h2"
              size="md"
              className="font-semibold tracking-wide uppercase"
            >
              Actions
            </Heading>
          </div>
          <div className="pr-2 pt-2 gap-4 text-main flex flex-col">
            <Button
              variant="secondary"
              href="/suggestion"
              icon={<FilePlus className="w-5 h-5" />}
            >
              Nouveau jeu
            </Button>
            <Button
              variant="secondary"
              href="/administration/consoles"
              icon={<Gamepad className="w-5 h-5" />}
            >
              Gestion des consoles
            </Button>
          </div>
        </FilterPanel>
      </section>

      {/* PANNEAU DROIT : LISTE & TRI */}
      <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
        {/* En-tête*/}
        <ListHeader
          title="Liste de jeux"
          totalResults={games.length}
          sortBy={filters.sortBy}
          onSortChange={setters.setSortBy}
          optionsSort={OPTIONS_SORT}
        />

        {/* Grille de jeux */}
        <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          {loading ? (
            <p className="p-8 text-gray-400">Chargement des jeux...</p>
          ) : games.length === 0 ? (
            <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
          ) : (
            <div
              key={gridKey}
              className="flex flex-col gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
            >
              {games.map((game, index) => (
                <AdminGameCard key={game.id} game={game} priority={index < 5} />
              ))}
            </div>
          )}
        </div>
      </section>
    </LayoutFull>
  );
}
