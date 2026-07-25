import Link from "next/link";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import gamesData from "@/data/games.json";
import GameCard from "@/components/game/GameCard";
import { Game } from "@/types/game";

export default function Home() {
  // On récupère le tout premier jeu de ton fichier JSON
  const sampleGame = gamesData[0] as Game;
  const anotherGame = gamesData[210] as Game;

  return (
    <div className="relative w-full h-full flex justify-between px-12">
      {/* Zone Texte (Gauche 50%) */}
      <div
        style={{
          marginBottom: "50px",
        }}
        className="w-full overflow-y-auto lg:w-1/2 !mb-12 h-auto"
      >
        <div className="part w-full z-10 space-y-4 md:h-full overflow-y-auto">
          <h1 className="text-5xl font-bold text-main">Bienvenue</h1>
          <p className="text-main/80 text-lg">
            Test d'intégration du composant ParallaxCharacter !
          </p>

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
      <div className="hidden md:block w-1/2 h-full relative">
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
