// 📦 Imports des Composants UI Atomiques
import { List, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import ParallaxCharacter from "@/components/layout/ParallaxCharacter";

export default function Home() {
  return (
    <div className="relative w-full h-full flex justify-between px-12 py-8 gap-8">
      {/* ========================================================================
        ZONE GAUCHE (50%) : Catalogue de nos composants UI
        ========================================================================
      */}
      {/* ZONE GAUCHE (50% desktop, 100% mobile avec scroll natif) */}
      <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)] pr-4 space-y-8 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
        <section className="space-y-8">
          <Heading as="h1" size="2xl">
            Bienvenue <br /> dans votre vidéoludothèque.
          </Heading>

          {/* Trait séparateur */}
          <div className="w-16 h-0.25 bg-main" />

          {/* Texte d'introduction */}
          <div>
            <p className="text-main/80 text-md mb-4">
              Centralisez toute votre collection, explorez les fiches de vos
              jeux et gardez une trace de vos sessions grâce à vos avis
              personnels. Un catalogue épuré, pensé pour parcourir votre
              bibliothèque et consulter vos statistiques en un clin d'œil.
            </p>
            <p className="text-main/80 text-md">
              Trop de choix ? Affinez vos critères de sélection et la
              fonctionnalité "Suggestion" sélectionne instantanément votre
              prochaine aventure !
            </p>
          </div>

          {/* Boutons d'action */}
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
      </div>
      {/* ========================================================================
        ZONE DROITE (50%) : Personnage d'ambiance avec effet Parallaxe
        ========================================================================
      */}
      <div className="hidden lg:block w-1/2 h-full relative">
        <ParallaxCharacter
          image={{
            url: "/parallax/truncate.webp",
            truncated: true,
          }}
        />
      </div>
    </div>
  );
}
