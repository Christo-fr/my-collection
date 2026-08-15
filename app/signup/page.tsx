"use client";

// Layout & UI Globales
import LayoutSplit from "@/components/layout/LayoutSplit";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserRoundCheck } from "lucide-react";

// Composants Métier
import FilterPanel from "@/components/game/FilterPanel";

export default function Signin() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================

  // =========================================================================
  // 2. TRAITEMENT DU TIRAGE
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
          Créer un compte
        </Heading>

        {/* Panneau principal de filtres */}
        <section className="w-full xl:w-1/2 lg:h-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          <FilterPanel title="Inscription">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-main/80 text-sm">
                Bienvenue sur <b>MyCollection</b> ! <br />
                Créez un compte pour commencer à utiliser notre application et
                partager prochainement votre collection.
              </p>
              <Input
                label="Pseudonyme"
                type="text"
                placeholder="Saisir votre pseudonyme"
                //error="Veuillez entrer un pseudonyme valide."
              />
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
                type="submit"
                icon={<UserRoundCheck className="w-5 h-5" />}
                variant="secondary"
                className="mt-4 w-full"
              >
                S'inscrire
              </Button>
            </form>
          </FilterPanel>
        </section>
      </LayoutSplit>
    </>
  );
}
