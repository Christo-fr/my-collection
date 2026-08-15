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
  // 2. TRAITEMENT
  // =========================================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 1. Empêche le rechargement de page natif du navigateur
    // 2. Ton code de connexion Supabase ira ici
  };
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Courriel"
                type="email"
                placeholder="Saisir votre email"
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="Saisir votre mot de passe"
              />

              {/* Bouton de type "submit" */}
              <Button
                type="submit"
                icon={<KeyRound className="w-5 h-5" />}
                variant="secondary"
                className="mt-4 w-full"
              >
                Connexion
              </Button>
            </form>
          </FilterPanel>
        </section>
      </LayoutSplit>
    </>
  );
}
