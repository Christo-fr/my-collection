"use client";

import { useState } from "react";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";

export default function MaListe() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConsole, setSelectedConsole] = useState<string>("Toutes");
  const [selectedStyle, setSelectedStyle] = useState<string>("Tous");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [maxDuration, setMaxDuration] = useState<number>(200);

  return (
    <div className="relative w-full h-full flex flex-col px-12 py-8 gap-6">
      {/* Titre principal */}
      <Heading as="h1" size="2xl">
        Ma liste
      </Heading>

      {/* Conteneur principal flex */}
      <div className="w-full flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* PANNEAU GAUCHE (Filtres - 25% desktop, 100% mobile) */}
        <section className="w-full lg:w-1/4 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] pr-2 space-y-6 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          {/* En-tête Filtres + Compteur */}
          <div className="flex items-center justify-between border-b border-main/10 pb-2">
            <h2 className="text-lg font-semibold tracking-wide uppercase">
              Filtres
            </h2>
            <span className="text-sm text-main/60">(0 résultats)</span>
          </div>

          {/* Formulaire des filtres */}
          <div className="space-y-4">
            <Input
              placeholder="Rechercher un jeu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              label="Console"
              options={[{ label: "Toutes", value: "Toutes" }]}
              selectedValue={selectedConsole}
              onChange={(val) => setSelectedConsole(val)}
            />

            <Select
              label="Style"
              options={[{ label: "Tous", value: "Tous" }]}
              selectedValue={selectedStyle}
              onChange={(val) => setSelectedStyle(val)}
            />

            <Select
              label="Statut"
              options={[{ label: "Tous", value: "Tous" }]}
              selectedValue={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
            />

            <RangeInput
              label="Durée de vie maximale"
              value={maxDuration}
              onChange={(val) => setMaxDuration(val)}
              min={5}
              max={200}
              step={5}
              unit="h"
            />
          </div>
        </section>

        {/* PANNEAU DROIT (Grille de jeux - 75% desktop, 100% mobile) */}
        <div className="w-full lg:w-3/4 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] pr-2 space-y-6 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          <p className="text-main/60 text-sm">TEST GRILLE</p>
        </div>
      </div>
    </div>
  );
}
