"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import { Undo2, Disc, CircleDotDashed } from "lucide-react";

// Providers & Layouts
import LayoutSplit from "@/components/layout/LayoutSplit";

// UI Components Global
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

// Feature Game Components & Hooks
import ConsoleIcon from "@/components/game/ConsoleIcon";
import { useGameDetail } from "@/features/game/useGameDetail";
import GameTabs from "@/components/game/GameTabs";
import GameTrailerDialog from "@/components/game/GameTrailerDialog";

/**
 * Composant Page : GameDetail (/game/[id])
 *
 * RÔLE ET ARCHITECTURE :
 * Sert de "composant chef d'orchestre" pour la vue détaillée d'un jeu.
 * 1. Délègue la récupération de données et la navigation au Custom Hook `useGameDetail`.
 * 2. Délègue la construction visuelle des détails/avis au sous-composant `GameTabs`.
 * 3. Maintient uniquement l'état d'ouverture UI de la modale trailer (`GameTrailerDialog`).
 */
export default function GameDetail() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  // Executive Hook : Récupère les données du jeu, les jeux connexes de la franchise et la fonction retour
  const { game, relatedFranchiseGames, handleBack } = useGameDetail();

  // État local UI : Contrôle la visibilité du dialogue du trailer YouTube
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // =========================================================================
  // 2. SÉCURITÉ & GARDE DE CHARGEMENT
  // =========================================================================
  // Si le jeu n'est pas encore chargé (ou inexistant), on bloque le rendu JSX
  if (!game) return null;

  // =========================================================================
  // 3. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <>
      {/* AnimatePresence : Anime l'apparition/disparition lors des transitions de route */}
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full h-full flex flex-col min-h-0"
        >
          {/* Disposition Split : Image Parallax à gauche, contenu à droite */}
          <LayoutSplit image={game.images.parallax}>
            {/* Logo officiel du jeu */}
            {game.images.logo && (
              <div className="relative items-start mb-2 h-32 w-full md:w-1/2 lg:flex-shrink-0">
                <Image
                  src={game.images.logo}
                  alt={game.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-contain object-left"
                />
              </div>
            )}

            {/* Panneau principal d'informations */}
            <section className="w-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
              {/* Header : Titre + Badge de la Console + Format du jeu */}
              <div className="flex flex-wrap w-full justify-between items-start md:flex-nowrap">
                <Heading as="h1" size="lg">
                  {game.title}
                </Heading>

                <div className="flex items-center gap-2 flex-shrink-0 mt-1.5">
                  <ConsoleIcon
                    console={game.console}
                    className="h-4 w-auto object-contain"
                  />

                  {/* Badge du format (Physique vs Dématérialisé) */}
                  {game.format &&
                    (game.format === "Physical" ? (
                      <Disc className="w-5 h-5 " name="Physique">
                        <title>Support Physique</title>
                      </Disc>
                    ) : (
                      <CircleDotDashed className="w-5 h-5" name="Digital">
                        <title>Support Numérique</title>
                      </CircleDotDashed>
                    ))}
                </div>
              </div>

              {/* Composant d'onglets ("Informations" et "Avis") + Bouton Trailer */}
              <GameTabs
                game={game}
                onOpenTrailer={() => setIsTrailerOpen(true)}
                relatedFranchiseGames={relatedFranchiseGames}
              />
            </section>

            {/* Bouton Retour Intelligent (Historique sessionStorage ou /list) */}
            <div className="lg:flex-shrink-0">
              <Button
                variant="secondary"
                onClick={handleBack}
                icon={<Undo2 className="w-5 h-5" />}
              >
                Retour
              </Button>
            </div>
          </LayoutSplit>

          {/* ========================================================================= */}
          {/* DIALOG                                                       */}
          {/* ========================================================================= */}
          {/* Dialog du Trailer YouTube (rendu uniquement si une ID YouTube existe) */}
          {game.youtubeId && (
            <GameTrailerDialog
              isOpen={isTrailerOpen}
              onClose={() => setIsTrailerOpen(false)}
              youtubeId={game.youtubeId}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
