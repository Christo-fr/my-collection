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
import Checkbox from "@/components/ui/Checkbox";

import { toast } from "sonner";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import AdminConsolesItem from "@/features/admin-consoles/components/AdminConsolesItem";

import Combobox from "@/components/ui/Combobox";

// 🎮 Imports Métier & Layout
import GameCard from "@/components/shared/GameCard";
import AdminGameCard from "@/features/admin/AdminGameCard";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import { useGamesContext } from "@/components/providers/GamesProvider";

export default function SandboxPage() {
  // ---------------------------------------------------------------------------
  // 1. ÉTATS LOCAUX & DONNÉES DE TEST (MOCKS)
  // ---------------------------------------------------------------------------
  // Jeux issus de la BDD (via le Provider) au lieu du fichier JSON statique
  const { getGameById, loading } = useGamesContext();
  const sampleGame = getGameById(1);
  const anotherGame = getGameById(2);
  const veryGame = getGameById(3);
  const otherGame = getGameById(20);

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

  // State local pour la liste réordonnable
  const [consoles, setConsoles] = useState([
    { id: 1, shortName: "PlayStation 5" },
    { id: 2, shortName: "Nintendo Switch" },
    { id: 3, shortName: "PC" },
    { id: 4, shortName: "Xbox Series X" },
  ]);

  // Gestionnaire de fin de survol / déplacement
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setConsoles((prevConsoles) => {
        const oldIndex = prevConsoles.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = prevConsoles.findIndex((item) => item.id === over.id);

        return arrayMove(prevConsoles, oldIndex, newIndex);
      });
    }
  }

  //Case à cocher
  const [isBw, setIsBw] = useState(false);

  // 1. Le State local pour garder en mémoire la console sélectionnée (initialisé à vide "")
  const [selectedConsole, setSelectedConsole] = useState<string>("");

  // 2. La constante contenant la liste des options pour le menu déroulant
  const consoleOptions = [
    { label: "PlayStation 5", value: "ps5" },
    { label: "Nintendo Switch", value: "switch" },
    { label: "PC", value: "pc" },
    { label: "Xbox Series X", value: "xbox" },
  ];

  //Combobox
  const [franchise, setFranchise] = useState("mario");

  const options = [
    { label: "Super Mario", value: "mario" },
    { label: "The Legend of Zelda", value: "zelda" },
    { label: "Metroid", value: "metroid" },
  ];

  // Tant que le Provider n'a pas fini de charger les jeux depuis la BDD, on attend
  if (loading || !sampleGame || !anotherGame || !veryGame) {
    return <p className="p-8 text-main/60">Chargement des jeux...</p>;
  }

  return (
    <div className="relative w-full h-full flex justify-between px-12 py-8 gap-8">
      {/* ========================================================================
        ZONE GAUCHE (50%) : Catalogue de nos composants UI
        ========================================================================
      */}
      {/* ZONE GAUCHE (50% desktop, 100% mobile avec scroll natif) */}
      <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)] pr-4 space-y-8 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
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
              size="sm"
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
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
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
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
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
        <section className="bg-background/5 p-4 rounded-xl border border-main/10 w-full flex flex-col">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            6. Cartes de jeu
          </h2>
          {/* Grille de jeux */}
          <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            <div
              key={sampleGame.id}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
            >
              <GameCard key={2} game={sampleGame} />
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
            <div className="w-full">Bienvenue !</div>
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
            8. Menu déroulant (Select Headless UI)
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

        {/* -------------------------------------------------------------------
    SECTION 9 : Sooner
    ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            9. Sooner
          </h2>
          <Button
            variant="primary"
            icon={<List className="w-5 h-5" />}
            onClick={() =>
              toast.success("Super ! Le toast fonctionne à merveille 🚀")
            }
          >
            Sooner
          </Button>
        </section>

        {/* -------------------------------------------------------------------
    SECTION 10 : Checkbox
    ------------------------------------------------------------------- */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            10. Checkbox
          </h2>
          <div className="space-y-4">
            <Checkbox
              label="Logo en N/B ?"
              description="Cochez cette case si le logo de la console doit s'afficher en noir et blanc."
              checked={isBw}
              onChange={setIsBw}
            />
          </div>

          <div className="pt-4 border-t border-main/10">
            <p className="text-sm text-main/70">
              État actuel de la variable :{" "}
              <span className="font-mono font-bold text-accent">
                {isBw ? "true" : "false"}
              </span>
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            SECTION 11 : CARTES DE JEU (<AdminGameCard />)
            ------------------------------------------------------------------- */}
        <section className="bg-background/5 p-4 rounded-xl border border-main/10 w-full flex flex-col">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            11. Cartes de jeu
          </h2>
          {/* Grille de jeux */}
          <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            <div
              key={sampleGame.id}
              className="grid gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
            >
              <AdminGameCard key={2} game={sampleGame} />
              {otherGame && <AdminGameCard key={20} game={otherGame} />}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            SECTION 12 : DRAG & DROP
            ------------------------------------------------------------------- */}
        <section className="bg-background/5 p-4 rounded-xl border border-main/10 w-full flex flex-col">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            12. Drag & Drop
          </h2>
          {/* Grille de jeux */}
          <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={consoles.map((c) => c.id)}>
                {consoles.map((c) => (
                  <AdminConsolesItem
                    key={c.id}
                    id={c.id}
                    shortName={c.shortName}
                    isBw={false}
                    onUpdate={() => {}}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            SECTION 13 : COMBOBOX
            ------------------------------------------------------------------- */}
        <section className="bg-background/5 p-4 rounded-xl border border-main/10 w-full flex flex-col">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            13. Combobox
          </h2>
          {/* Grille de jeux */}
          <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            <Combobox
              label="Franchise"
              options={options}
              selectedValue={franchise}
              onChange={setFranchise}
              description={`Valeur sélectionnée dans le state : "${franchise}"`}
            />
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
            url: "/parallax/admin.webp",
            truncated: true,
          }}
        />
      </div>
    </div>
  );
}
