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
import ConsoleIcon from "@/components/game/GameConsoleIcon";
import { useGameDetail } from "@/hooks/game/useGameDetail";
import GameTabs from "@/components/game/GameTabs";
import GameTrailerDialog from "@/components/game/GameTrailerDialog";

// =========================================================================
// 1. COMPOSANT PAGE & ORCHESTRATION
// =========================================================================
/** Page dynamique affichant le profil détaillé, les avis et la saga d'un jeu sélectionné */
export default function GameDetail() {
  // Récupère les données du jeu courant, sa saga filtrée et la fonction de retour intelligent
  const { game, relatedFranchiseGames, handleBack } = useGameDetail();

  // Contrôle l'affichage de la modale vidéo YouTube
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // =========================================================================
  // 2. GARDE-FOU (Sécurité si donnée absente)
  // =========================================================================
  // Bloque le rendu du composant tant que les données du jeu ne sont pas résolues
  if (!game) return null;

  // =========================================================================
  // 3. RENDU DU COMPOSANT (JSX)
  // =========================================================================
  return (
    <>
      {/* Anime la transition de sortie/entrée lors des changements de jeu ou de route */}
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full h-full flex flex-col min-h-0"
        >
          {/* Layout à deux colonnes avec image parallax à gauche et contenu à droite */}
          <LayoutSplit image={game.images.parallax}>
            {/* Rendu conditionnel du logo du jeu avec conservation des proportions */}
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

            {/* Panneau principal contenant les onglets de détails */}
            <section className="w-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
              {/* En-tête : Titre, icône console et badge de format */}
              <div className="flex flex-wrap w-full justify-between items-start md:flex-nowrap">
                <Heading as="h1" size="lg">
                  {game.title}
                </Heading>

                <div className="flex items-center gap-2 flex-shrink-0 mt-1.5">
                  <ConsoleIcon
                    console={game.console}
                    className="h-4 w-auto object-contain"
                  />

                  {/* Distingue visuellement le support Physique (Disque) du Numérique (Cercle) */}
                  {game.format &&
                    (game.format === "Physical" ? (
                      <Disc className="w-5 h-5" name="Physique">
                        <title>Support Physique</title>
                      </Disc>
                    ) : (
                      <CircleDotDashed className="w-5 h-5" name="Digital">
                        <title>Support Numérique</title>
                      </CircleDotDashed>
                    ))}
                </div>
              </div>

              {/* Composant sous-traitant l'affichage des sections "Informations" et "Avis" */}
              <GameTabs
                game={game}
                onOpenTrailer={() => setIsTrailerOpen(true)}
                relatedFranchiseGames={relatedFranchiseGames}
              />
            </section>

            {/* Bouton de retour contextuel */}
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

          {/* Modale vidéo affichée uniquement si un identifiant YouTube est rattaché au jeu */}
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
