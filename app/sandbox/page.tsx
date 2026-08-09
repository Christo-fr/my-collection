"use client";

import { useState } from "react";
import Link from "next/link";
import { List, Sparkles } from "lucide-react";

// 📦 Imports des Composants UI Atomiques
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import RangeInput from "@/components/ui/RangeInput";
import Tabs from "@/components/ui/Tabs";
import Select from "@/components/ui/Select";
import Dialog from "@/components/ui/Dialog";
import Heading from "@/components/ui/Heading";

// 🎮 Imports Métier & Layout
import GameCard from "@/components/game/GameCard";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import gamesData from "@/data/games.json";
import { Game } from "@/types/game";

export default function SandboxPage() {
  // ---------------------------------------------------------------------------
  // 1. ÉTATS LOCAUX & DONNÉES DE TEST (MOCKS)
  // ---------------------------------------------------------------------------
  const sampleGame = gamesData[0] as Game;
  const anotherGame = gamesData[1] as Game;
  const veryGame = gamesData[2] as Game;

  // State local pour valider le RangeInput
  const [duration, setDuration] = useState(25);

  // State local pour valider le Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Données de test pour le composant Tabs
  const sampleTabs = [
    {
      label: "Informations",
      content: (
        <p className="text-main/80 text-sm">
          Voici les informations détaillées du jeu...
        </p>
      ),
    },
    {
      label: "Avis",
      content: (
        <p className="text-main/80 text-sm">
          Voici mon avis personnel sur le jeu...
        </p>
      ),
    },
    {
      label: "Trailer",
      content: (
        <p className="text-main/80 text-sm">
          Intégration de la vidéo YouTube ici.
        </p>
      ),
    },
  ];

  // 1. Le State local pour garder en mémoire la console sélectionnée (initialisé à vide "")
  const [selectedConsole, setSelectedConsole] = useState<string>("");

  // 2. La constante contenant la liste des options pour le menu déroulant
  const consoleOptions = [
    { label: "PlayStation 5", value: "ps5" },
    { label: "Nintendo Switch", value: "switch" },
    { label: "PC", value: "pc" },
    { label: "Xbox Series X", value: "xbox" },
  ];

  return (
    <div className="relative w-full h-full flex justify-between px-12 py-8 gap-8">
      {/* ========================================================================
        ZONE GAUCHE (50%) : Catalogue de nos composants UI
        ========================================================================
      */}
      {/* ZONE GAUCHE (50% desktop, 100% mobile avec scroll natif) */}
      <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)] pr-4 space-y-8 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
        {/* EN-TÊTE DE LA SANDBOX */}
        <header className="space-y-1 border-b border-main/10 pb-4">
          <Heading as="h1" size="3xl">
            🧪 Sandbox UI
          </Heading>

          <p className="text-main/60 text-sm">
            Atelier de validation visuelle et interactive des composants
            atomiques.
          </p>
        </header>
        {/* -------------------------------------------------------------------
            SECTION 1 : BOUTONS (<Button />)
            ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            1. Boutons (Primary & Secondary)
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="primary"
              href="/liste"
              icon={<List className="w-5 h-5" />}
            >
              Ma Liste
            </Button>

            <Button
              variant="secondary"
              href="/suggestion"
              icon={<Sparkles className="w-5 h-5" />}
            >
              Suggestion
            </Button>
          </div>
        </section>
        {/* -------------------------------------------------------------------
            SECTION 2 : BARRE DE PROGRESSION (<ProgressBar />)
            ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            2. Barre de progression (ProgressBar)
          </h2>
          <ProgressBar
            value={60}
            labelLeft="Jeux terminés"
            labelRight="Jeux non terminés"
            showPercentage={true}
          />
        </section>
        {/* -------------------------------------------------------------------
            SECTION 3 : INPUTS TEXTE & TEXTAREAS (<Input />, <Textarea />)
            ------------------------------------------------------------------- */}
        <section className="relative overflow-hidden isolate space-y-3 bg-main/5 p-4 rounded-xl border border-main/10 before:content-[''] before:absolute before:-top-16 before:-left-16 before:w-40 before:h-40 before:bg-[var(--color-secondary)] before:rounded-full before:blur-2xl before:pointer-events-none">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            3. Champs de saisie (Input & Textarea)
          </h2>
          <div className="space-y-3">
            <Input
              label="Input classique"
              placeholder="ex: Mario Kart 8 Deluxe"
            />

            <Input
              label="Input avec description"
              placeholder="XXXX-XXXX-XXXX"
              description="Trouvable au dos du boîtier du jeu."
            />

            <Input
              label="Input avec erreur"
              type="email"
              defaultValue="mario@kart"
              error="Veuillez entrer une adresse email valide."
            />

            <Input
              label="Input désactivé"
              defaultValue="EU-CENTRAL-01"
              disabled
            />

            <Textarea
              label="Textarea classique"
              placeholder="Raconte brièvement le principe du jeu..."
              rows={3}
            />

            <Textarea
              label="Textarea avec erreur"
              defaultValue="Trop court"
              error="Votre avis doit contenir au moins 20 caractères."
              rows={2}
            />
          </div>
        </section>
        {/* -------------------------------------------------------------------
            SECTION 4 : SLIDER DE DURÉE (<RangeInput />)
            ------------------------------------------------------------------- */}
        <section
          className="relative overflow-hidden isolate rounded-xl p-4 space-y-3 bg-main/5 border border-main/10
  before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit]
  before:bg-[radial-gradient(circle_at_top_left,var(--color-secondary)_0%,transparent_70%)]
  before:opacity-30"
        >
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            4. Curseur de plage (RangeInput)
          </h2>
          <RangeInput
            label="Durée de vie maximale"
            description="Filtre les jeux qui se terminent en moins de temps"
            value={duration}
            onChange={(val) => setDuration(val)}
            min={5}
            max={100}
            step={5}
            unit="h"
          />
          <div className="p-3 bg-background/5 rounded-lg text-xs font-mono text-main/70">
            State local parent :{" "}
            <span className="text-accent font-bold">{duration}h</span>
          </div>
        </section>
        {/* -------------------------------------------------------------------
            SECTION 5 : ONGLETS HAUTE-ACCESSIBILITÉ (<Tabs />)
            ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            5. Onglets (Tabs Headless UI)
          </h2>
          <Tabs items={sampleTabs} />
        </section>
        {/* -------------------------------------------------------------------
            SECTION 6 : CARTES DE JEU (<GameCard />)
            ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            6. Cartes de jeux (GameCard)
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <GameCard game={sampleGame} variant="default" />
            </div>
            <div className="w-48">
              <GameCard game={anotherGame} variant="default" />
            </div>
          </div>{" "}
          <div className="flex items-center gap-4">
            <div className="w-full">
              <GameCard game={veryGame} variant="xl" />
            </div>
          </div>
        </section>
        {/* -------------------------------------------------------------------
            SECTION 7 : DIALOGUE (<Dialog />)
            ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            7. Dialogue (Dialog)
          </h2>
          {/* Bouton pour déclencher la modale */}
          <Button onClick={() => setIsDialogOpen(true)}>
            Tester la modale
          </Button>

          {/* Ton composant Dialog */}
          <Dialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title="Titre de la modale"
          >
            <div className="w-full">
              <GameCard game={veryGame} variant="xl" />
            </div>
            <Button onClick={() => setIsDialogOpen(false)}>
              Fermer la modale
            </Button>
          </Dialog>
        </section>
        {/* -------------------------------------------------------------------
    SECTION 8 : MENU DÉROULANT (<Select />)
    ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            7. Menu déroulant (Select Headless UI)
          </h2>

          <Select
            label="Plateforme"
            description="Filtre les jeux selon votre console"
            options={consoleOptions}
            selectedValue={selectedConsole}
            onChange={(val) => setSelectedConsole(val)}
            placeholder="Choisir une console..."
          />

          {/* Petit readout pour vérifier la valeur en temps réel */}
          <div className="p-3 bg-background/5 rounded-lg text-xs font-mono text-main/70">
            State local parent :{" "}
            <span className="text-accent font-bold">
              {selectedConsole || "Aucune sélection"}
            </span>
          </div>
        </section>
      </div>

      {/* ========================================================================
        ZONE DROITE (50%) : Personnage d'ambiance avec effet Parallaxe
        ========================================================================
      */}
      <div className="hidden lg:block w-1/2 h-full relative">
        <ParallaxCharacter
          image={{
            url: "/parallax/no-truncate.webp",
          }}
        />
      </div>
    </div>
  );
}
