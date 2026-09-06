"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { UserRoundCheck } from "lucide-react";
import { toast } from "sonner";

// Layout & UI Globales
import LayoutSplit from "@/components/layout/LayoutSplit";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";

// Composants Métier
import GameCatalogFilterPanel from "@/components/shared/GameCatalogFilterPanel";

// Supabase
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const [pseudonyme, setPseudonyme] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // État stockant le champ précis en faute pour le surlignage rouge
  const [errorField, setErrorField] = useState<
    "pseudonyme" | "email" | "password" | null
  >(null);

  // État stockant le message texte rédigé en français
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const supabase = createClient();

  // Helper pour effacer les alertes visuelles dès que l'utilisateur modifie un champ
  const clearErrors = () => {
    setErrorField(null);
    setErrorMessage("");
  };

  // =========================================================================
  // 2. TRAITEMENT DE L'INSCRIPTION
  // =========================================================================
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de page natif

    // --- A. Validation locale (Clause de garde) ---
    // Si le pseudonyme est vide, on cible uniquement ce champ sans appeler Supabase
    if (!pseudonyme.trim()) {
      setErrorField("pseudonyme");
      setErrorMessage("Veuillez saisir un pseudonyme.");
      return;
    }

    // --- B. Envoi de la requête à Supabase Auth ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: pseudonyme, // Stockage du pseudo dans raw_user_meta_data
        },
      },
    });

    // --- C. Traitement du retour Supabase ---
    if (error) {
      if (error.message.includes("Password should be at least")) {
        setErrorField("password");
        setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (
        error.message.includes("User already registered") ||
        error.message.includes("invalid email")
      ) {
        setErrorField("email");
        setErrorMessage("Un compte existe déjà avec cette adresse courriel.");
      } else {
        setErrorField(null);
        setErrorMessage("Une erreur est survenue lors de l'inscription.");
      }
    } else if (data.user?.identities?.length === 0) {
      // DÉTECTION DU DOUBLON : Supabase renvoie un tableau d'identités vide quand l'email existe
      setErrorField("email");
      setErrorMessage("Un compte existe déjà avec cette adresse courriel.");
    } else {
      // --- D. Succès réel de la création de compte ---
      toast.success(
        "Compte administrateur créé avec succès ! Création de votre vidéoludothèque en cours...",
      );
      router.refresh();
      router.push("/administration");
    }
  };
  // =========================================================================
  // 3. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <LayoutSplit image={{ url: "/parallax/admin.webp", truncated: true }}>
      <Heading as="h1" size="xl">
        Créer un compte
      </Heading>

      {/* Panneau principal de formulaire */}
      <section className="w-full xl:w-1/2 lg:h-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        <GameCatalogFilterPanel title="Inscription">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-main/80 text-sm">
              Bienvenue sur <b>MyCollection</b> ! <br />
              Créez un compte pour commencer à utiliser notre application et
              partager prochainement votre collection.
            </p>

            {/* Champ Pseudonyme : rouge uniquement si errorField === "pseudonyme" */}
            <Input
              label="Pseudonyme"
              type="text"
              placeholder="Saisir votre pseudonyme"
              value={pseudonyme}
              onChange={(e) => {
                setPseudonyme(e.target.value);
                clearErrors();
              }}
              error={errorField === "pseudonyme"}
            />

            {/* Champ Courriel : rouge uniquement si errorField === "email" */}
            <Input
              label="Courriel"
              type="email"
              placeholder="Saisir votre email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearErrors();
              }}
              error={errorField === "email"}
            />

            {/* Champ Mot de passe : rouge uniquement si errorField === "password" */}
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Saisir votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors();
              }}
              error={errorField === "password"}
            />

            {/* Encart unique affichant le texte d'erreur en français */}
            {errorMessage && <FormError message={errorMessage} />}

            {/* Bouton de soumission */}
            <Button
              type="submit"
              icon={<UserRoundCheck className="w-5 h-5" />}
              variant="secondary"
              className="mt-4 w-full"
            >
              S'inscrire
            </Button>
          </form>
        </GameCatalogFilterPanel>
      </section>
    </LayoutSplit>
  );
}
