import Link from "next/link";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import gamesData from "@/data/games.json";
import GameCard from "@/components/game/GameCard";
import { Game } from "@/types/game";

import Button from "@/components/ui/Button";
import { List, Sparkles } from "lucide-react";

import ProgressBar from "@/components/ui/ProgressBar";
import Input from "@/components/ui/Input";

export default function Home() {
  // On récupère le tout premier jeu de ton fichier JSON
  const sampleGame = gamesData[0] as Game;
  const anotherGame = gamesData[210] as Game;

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
