"use client";

// Layout & UI Globales
import LayoutSplit from "@/components/layout/LayoutSplit";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { KeyRound } from "lucide-react";

// Composants Métier
import FilterPanel from "@/components/game/FilterPanel";

export default function Login() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================

  // =========================================================================
  // 2. TRAITEMENT DU TIRAGE
  // =========================================================================

  // =========================================================================
  // 3. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <>
      <LayoutSplit image={{ url: "/parallax/admin.webp", truncated: true }}>
        <Heading as="h1" size="xl">
          Authentification
        </Heading>

        {/* Panneau principal de filtres */}
        <section className="w-full xl:w-1/2 lg:h-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          <FilterPanel title="Formulaire">
            <Input
              label="Courriel"
              type="email"
              placeholder="Saisir votre email"
              //error="Veuillez entrer une adresse email valide."
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Saisir votre mot de passe"
              //error="Le mot de passe doit contenir au moins 8 caractères."
            />
            <Button
              onClick={() => {
                alert("Bouton cliqué !");
              }}
              icon={<KeyRound className="w-5 h-5" />}
              variant="secondary"
              className="mt-8 w-full"
            >
              Connexion
            </Button>
          </FilterPanel>
        </section>
      </LayoutSplit>
    </>
  );
}
