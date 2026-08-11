// 📦 Imports des Composants UI Atomiques
import { House } from "lucide-react";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import LayoutSplit from "@/components/layout/LayoutSplit";

export default function NotFound() {
  return (
    <LayoutSplit image={{ url: "/parallax/not-found.webp", truncated: true }}>
      <section className="space-y-8">
        <Heading as="h1" size="2xl">
          Page introuvable
        </Heading>

        {/* Trait séparateur */}
        <div className="w-16 h-0.25 bg-main" />

        {/* Texte d'introduction */}
        <div>
          <Heading as="h2" size="lg">
            Erreur 404
          </Heading>
          <p className="text-main/80 text-md mb-4">
            Nous n'arrivons pas à trouver la page que vous cherchez. <br />
            Il se peut qu'elle ait été supprimée, que son nom ait changé ou
            qu'elle soit temporairement indisponible...
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            href="/"
            icon={<House className="w-5 h-5" />}
          >
            Page d'accueil
          </Button>
        </div>
      </section>
    </LayoutSplit>
  );
}
