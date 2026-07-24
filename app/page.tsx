import Link from "next/link";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import gamesData from "@/data/games.json";
import GameCard from "@/components/game/GameCard";
import { Game } from "@/types/game";

export default function Home() {
  // On récupère le tout premier jeu de ton fichier JSON
  const sampleGame = gamesData[0] as Game;

  return (
    <main className="relative w-full h-[calc(100vh-80px)] flex items-center justify-between px-12">
      {/* Zone Texte (Gauche 50%) */}
      <div className="w-full lg:w-1/2 z-10 space-y-4">
        <h1 className="text-5xl font-bold text-main">Bienvenue</h1>
        <p className="text-main/80 text-lg">
          Test d'intégration du composant ParallaxCharacter !
        </p>
        {/* On teste la carte en taille normale */}
        <div className="w-52">
          <Link href={`/fiche/${sampleGame.id}`}>
            <GameCard game={sampleGame} />
          </Link>
        </div>
      </div>

      {/* Zone Personnage (Droite 50%) */}
      <div className="hidden md:block w-1/2 h-full relative">
        <ParallaxCharacter
          image={{
            url: "/parallax/no-truncate.webp",
            mode: "full",
          }}
        />
      </div>
    </main>
  );
}
