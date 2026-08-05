// 📦 Imports des Composants UI Atomiques
import { List, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import LayoutSplit from "@/components/layout/LayoutSplit";

export default function Home() {
  return (
    <LayoutSplit image={{ url: "/parallax/truncate.webp", truncated: true }}>
      <section className="space-y-8">
        <Heading as="h1" size="2xl">
          Bienvenue <br /> dans votre vidéoludothèque.
        </Heading>

        {/* Trait séparateur */}
        <div className="w-16 h-0.25 bg-main" />

        {/* Texte d'introduction */}
        <div>
          <p className="text-main/80 text-md mb-4">
            Centralisez toute votre collection, explorez les fiches de vos jeux
            et gardez une trace de vos sessions grâce à vos avis personnels. Un
            catalogue épuré, pensé pour parcourir votre bibliothèque et
            consulter vos statistiques en un clin d'œil.
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
            href="/list"
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
    </LayoutSplit>
  );
}
