"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Undo2 } from "lucide-react";

// Providers & Layouts
import { useBackground } from "@/components/providers/BackgroundProvider";
import LayoutSplit from "@/components/layout/LayoutSplit";

// UI Components Global
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import Dialog from "@/components/ui/Dialog";
import ProgressBar from "@/components/ui/ProgressBar";

// Feature Game Components & Utils
import ConsoleIcon from "@/components/game/ConsoleIcon";
import { Game } from "@/types/game";
import {
  getRelatedFranchiseGames,
  formatDate,
} from "@/features/game/gameUtils";

export default function GameDetail() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const { id } = useParams();
  const router = useRouter();
  const { setBgImage } = useBackground();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedFranchiseGames, setRelatedFranchiseGames] = useState<Game[]>(
    [],
  );
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // =========================================================================
  // 2. FONCTIONS DE NAVIGATION ET HANDLERS
  // =========================================================================
  /**
   * Gestion intelligente du retour :
   * Redirige vers /list si l'utilisateur vient d'un site externe ou d'un nouvel onglet.
   */
  const handleBack = () => {
    const hasInternalHistory = document.referrer.startsWith(
      window.location.origin,
    );

    if (!hasInternalHistory || window.history.length <= 1) {
      router.push("/list");
    } else {
      router.back();
    }
  };

  // =========================================================================
  // 3. EFFETS (LIFECYCLE)
  // =========================================================================

  // Effet A : Chargement du jeu principal et des jeux de sa franchise
  useEffect(() => {
    if (!id) return;

    async function fetchGameData() {
      try {
        // Récupération du jeu principal
        const response = await fetch(`/api/games/${id}`);

        if (!response.ok) {
          setGame(null);
          setRelatedFranchiseGames([]);
          return;
        }

        const data: Game = await response.json();
        setGame(data);

        // Récupération des jeux connexes de la même franchise
        if (data.franchise) {
          const franchiseResponse = await fetch(
            `/api/games?franchise=${encodeURIComponent(data.franchise)}`,
          );

          if (franchiseResponse.ok) {
            const franchiseData: Game[] = await franchiseResponse.json();
            const relatedGames = getRelatedFranchiseGames(data, franchiseData);
            setRelatedFranchiseGames(relatedGames);
          }
        } else {
          setRelatedFranchiseGames([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  // Effet B : Gestion dynamique du fond d'écran (Parallax/Cover)
  // Effet B : Gestion du fond d'écran
  useEffect(() => {
    if (game?.images?.cover) {
      setBgImage(game.images.cover);
    }

    // Nettoyage : signale au Provider de réinitialiser le fond en quittant la page
    return () => {
      setBgImage(null);
    };
  }, [game, setBgImage]);
  // =========================================================================
  // 4. CONFIGURATION DES ONGLETS (INFORMATIONS & AVIS)
  // =========================================================================
  const sampleTabs = [
    {
      label: "Informations",
      content: (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {game?.developer && (
              <div className="flex gap-2 items-center">
                <Undo2 className="w-5 h-5 text-main/60" />
                <span>{game.developer}</span>
              </div>
            )}

            {game?.language && (
              <div className="flex gap-2 items-center">
                <Undo2 className="w-5 h-5 text-main/60" />
                <span>{game.language}</span>
              </div>
            )}

            {game?.releaseDate && (
              <div className="flex gap-2 items-center">
                <Undo2 className="w-5 h-5 text-main/60" />
                <span>{formatDate(game.releaseDate)}</span>
              </div>
            )}

            {game?.genre && (
              <div className="flex gap-2 items-center">
                <Undo2 className="w-5 h-5 text-main/60" />
                <span>{game.genre}</span>
              </div>
            )}

            {game?.pegi && (
              <div className="flex gap-2 items-center">
                <Undo2 className="w-5 h-5 text-main/60" />
                <span>{game.pegi}</span>
              </div>
            )}

            {game?.estimatedPlaytime && (
              <div className="flex gap-2 items-center">
                <Undo2 className="w-5 h-5 text-main/60" />
                <span>{game.estimatedPlaytime}</span>
              </div>
            )}
          </div>

          {game?.description && (
            <p className="mt-4 text-main/80 text-sm leading-relaxed">
              {game.description}
            </p>
          )}
        </>
      ),
    },
    ...(game?.review?.score
      ? [
          {
            label: "Avis",
            content: (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {game.review.completedDate && (
                    <div className="flex gap-2 items-center">
                      <Undo2 className="w-5 h-5 text-main/60" />
                      <span>{formatDate(game.review.completedDate)}</span>
                    </div>
                  )}

                  {game.review.score && (
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Undo2 className="w-5 h-5 text-main/60" />
                        <span>{game.review.score} /10</span>
                        <span className="flex flex-auto gap-2">
                          <ProgressBar value={game.review.score * 10} />
                        </span>
                      </div>
                    </div>
                  )}

                  {game.review.playtime && (
                    <div className="flex gap-2 items-center">
                      <Undo2 className="w-5 h-5 text-main/60" />
                      <span>{game.review.playtime}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {game.review.pros && (
                    <ul className="space-y-1">
                      {game.review.pros.map((pro, index) => (
                        <li key={index} className="text-main/80 text-sm">
                          + {pro}
                        </li>
                      ))}
                    </ul>
                  )}

                  {game.review.cons && (
                    <ul className="space-y-1">
                      {game.review.cons.map((con, index) => (
                        <li key={index} className="text-main/80 text-sm">
                          - {con}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {game.review.summary && (
                  <p className="mt-4 text-main/80 text-sm leading-relaxed">
                    {game.review.summary}
                  </p>
                )}
              </>
            ),
          },
        ]
      : []),
  ];

  // =========================================================================
  // 5. RENDU DU COMPOSANT
  // =========================================================================
  if (loading) {
    return <p className="p-8 text-gray-400">Chargement en cours...</p>;
  }

  if (!game) {
    return <p className="p-8 text-main/60 text-sm">Aucun jeu trouvé</p>;
  }

  return (
    <>
      <LayoutSplit image={game.images.parallax}>
        {/* Logo du jeu */}
        {game.images.logo && (
          <div className="relative items-start mb-2 h-32 lg:flex-shrink-0">
            <Image
              src={game.images.logo}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-contain object-left"
            />
          </div>
        )}

        {/* Panneau principal des détails du jeu */}
        <section className="w-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          {/* Header : Titre + Badge Console */}
          <div className="flex flex-wrap justify-between items-center">
            <Heading as="h1" size="lg">
              {game.title}
            </Heading>
            <div className="flex items-center gap-2">
              <ConsoleIcon
                console={game.console}
                className="h-2.5 w-auto object-contain"
              />
              <span className="text-sm font-medium">{game.format}</span>
            </div>
          </div>

          {/* Onglets Informations & Avis (avec bouton Trailer) */}
          <Tabs
            items={sampleTabs}
            action={
              game.youtubeId && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsTrailerOpen(true)}
                >
                  Trailer
                </Button>
              )
            }
          />

          {/* Section "De la même série..." (Franchise) */}
          {relatedFranchiseGames.length > 0 && (
            <div className="mt-4">
              <Heading as="h2" size="sm" className="mb-2">
                De la même série...
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {relatedFranchiseGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/game/${relatedGame.id}`}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative h-24">
                      <Image
                        src={relatedGame.images.logo}
                        alt={relatedGame.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Bouton Retour de bas de page */}
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
      // 6. MODALES ET DIALOGS
      {/* ========================================================================= */}
      {game.youtubeId && (
        <Dialog
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          title={`Trailer - ${game.title}`}
          maxWidth="max-w-7xl"
          centered
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${game.youtubeId}?autoplay=1`}
              title={`Trailer - ${game.title}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
