"use client";

import { useRouter } from "next/navigation";
// Layout & UI Globales
import LayoutSplit from "@/components/layout/LayoutSplit";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { useState, type SubmitEvent } from "react";

// Composants Métier
import FilterPanel from "@/components/game/FilterPanel";

//Supabase
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  // =========================================================================
  // 2. TRAITEMENT
  // =========================================================================

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // 1. Empêche le rechargement de page natif du navigateur
    // Appel à Supabase Auth pour vérifier les identifiants
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(
        "Identifiants invalides : Veuillez vérifier votre adresse courriel et votre mot de passe.",
      );
    } else {
      toast.success("Connexion réussie ! Redirection en cours...");
      router.refresh(); // pour notifier Next.js et revalider la session côté serveur
      router.push("/administration"); // Redirige vers le tableau de bord après la connexion réussie
    }
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                error={!!error} //ré-inverse le résultat pour redonner la vérité logique de la valeur d'origine.
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="Saisir votre mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                error={!!error}
              />
              {/* Message d'erreur global */}
              {error && <FormError message={error} />}

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
