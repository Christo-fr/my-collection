import ParallaxCharacter from "@/components/layout/ParallaxCharacter";

export default function Home() {
  return (
    <main className="relative w-full h-[calc(100vh-80px)] flex items-center justify-between px-12">
      {/* Zone Texte (Gauche 50%) */}
      <div className="w-full lg:w-1/2 z-10 space-y-4">
        <h1 className="text-5xl font-bold text-main">Bienvenue</h1>
        <p className="text-main/80 text-lg">
          Test d'intégration du composant ParallaxCharacter !
        </p>
      </div>

      {/* Zone Personnage (Droite 50%) */}
      <div className="hidden lg:block w-1/2 h-full relative">
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
