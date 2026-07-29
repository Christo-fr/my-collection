"use client";
import Link from "next/link";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import gamesData from "@/data/games.json";
import GameCard from "@/components/game/GameCard";
import { Game } from "@/types/game";

import Button from "@/components/ui/Button";
import { List, Sparkles } from "lucide-react";

import ProgressBar from "@/components/ui/ProgressBar";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import RangeInput from "@/components/ui/RangeInput";
import { useState } from "react";
import Tabs from "@/components/ui/Tabs";

export default function Home() {
  // On récupère le tout premier jeu de ton fichier JSON
  const sampleGame = gamesData[0] as Game;
  const anotherGame = gamesData[210] as Game;
  const [duration, setDuration] = useState(25);

  const sampleTabs = [
    {
      label: "Informations",
      content: (
        <p className="text-main/80">
          Voici les informations détaillées du jeu...
        </p>
      ),
    },
    {
      label: "Avis",
      content: (
        <p className="text-main/80">Voici mon avis personnel sur le jeu...</p>
      ),
    },
    {
      label: "Trailer",
      content: (
        <p className="text-main/80">Intégration de la vidéo YouTube ici.</p>
      ),
    },
  ];

  return (
    <div className="relative w-full h-full flex justify-between px-12">
      {/* Zone Texte (Gauche 50%) */}
      <div className="w-full mb-12 overflow-y-auto lg:w-1/2 !mb-12 h-auto">
        <div
          className="part w-full z-10 space-y-4 lg:h-full overflow-y-auto [scrollbar-width:thin] 
                   [scrollbar-color:transparent_transparent] 
                   hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]"
        >
          <h1 className="text-5xl font-bold text-main">Bienvenue</h1>
          <p className="text-main/80 text-lg">
            Test d'intégration du composant ParallaxCharacter !
          </p>
          <div className="flex items-center gap-2 p-2">
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
          <ProgressBar
            value={60}
            labelLeft="Jeux terminés"
            labelRight="Jeux non terminés "
            showPercentage={true}
          />

          <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-xl mx-auto space-y-6">
              <h1 className="text-xl font-bold">🧪 Test du composant Tabs</h1>
              <Tabs items={sampleTabs} />
            </div>
          </div>

          <div className="p-8 max-w-md mx-auto space-y-6">
            <h1 className="text-xl font-bold text-main">Test du RangeInput</h1>

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

            {/* Un petit readout pour vérifier que la valeur remonte bien au parent */}
            <div className="p-4 bg-main/5 rounded-lg text-xs font-mono">
              Valeur dans le state parent :{" "}
              <span className="text-accent font-bold">{duration}</span>
            </div>
          </div>

          <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center justify-center">
            <div className="">
              <h1 className="text-xl font-semibold mb-4 text-center">
                🧪 Test du composant Input
              </h1>

              {/* 1. Input Classique avec Label et Placeholder */}
              <Input label="Nom de jeu" placeholder="ex: Mario Kart 8 Deluxe" />

              {/* 2. Input avec Description */}
              <Input
                label="Clé de licence"
                placeholder="XXXX-XXXX-XXXX"
                description="Trouvable au dos du boîtier du jeu."
              />

              {/* 3. Input avec Erreur */}
              <Input
                label="Adresse email"
                type="email"
                defaultValue="mario@kart"
                error="Veuillez entrer une adresse email valide."
              />

              {/* 4. Input Désactivé */}
              <Input
                label="ID Serveur (lecture seule)"
                defaultValue="EU-CENTRAL-01"
                disabled
              />

              {/* 1. Input classique */}
              <Input label="Titre du jeu" placeholder="ex: Banjo-Kazooie" />

              {/* 2. Textarea standard (4 lignes par défaut) */}
              <Textarea
                label="Description / Résumé"
                placeholder="Raconte brièvement le principe du jeu ou tes impressions..."
              />

              {/* 3. Textarea avec description d'aide + hauteur personnalisée (3 lignes) */}
              <Textarea
                label="Notes de progression"
                placeholder="Détails sur les succès restants..."
                description="Ces notes restent privées."
                rows={3}
              />

              {/* 4. Textarea avec message d'erreur */}
              <Textarea
                label="Avis critique"
                defaultValue="Trop court"
                error="Votre avis doit contenir au moins 20 caractères."
              />

              {/* 5. Textarea Désactivé */}
              <Textarea
                label="Journal du serveur (lecture seule)"
                defaultValue="Connecté à EU-Central-01. Sync OK."
                disabled
                rows={2}
              />
            </div>
          </div>

          <div className="flex items gap-2 p-2">
            {/* On teste la carte en taille normale */}
            <div className="w-52">
              <Link href={`/fiche/${sampleGame.id}`}>
                <GameCard game={sampleGame} variant="default" />
              </Link>
            </div>
            {/* On teste la carte en taille normale */}
            <div className="w-52">
              <Link href={`/fiche/${anotherGame.id}`}>
                <GameCard game={anotherGame} variant="default" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Zone Personnage (Droite 50%) */}
      <div className="hidden lg:block w-1/2 h-full relative">
        <ParallaxCharacter
          image={{
            url: "/parallax/truncate.webp",
            mode: "truncate",
          }}
        />
      </div>
    </div>
  );
}
