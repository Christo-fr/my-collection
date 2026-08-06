"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import Dialog from "@/components/ui/Dialog";
import ProgressBar from "@/components/ui/ProgressBar";
import { Undo2 } from "lucide-react";
import LayoutSplit from "@/components/layout/LayoutSplit";
import ConsoleIcon from "@/components/game/ConsoleIcon";
import { Game } from "@/types/game";
import { useBackground } from "@/components/providers/BackgroundProvider";
import {
  getRelatedFranchiseGames,
  formatDate,
} from "@/features/game/gameUtils";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [relatedFranchiseGames, setRelatedFranchiseGames] = useState<Game[]>(
    [],
  );
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  // 1. Remplace bgImage par setBgImage
  const { setBgImage } = useBackground();

  // Effet A : Chargement des données (inchangé)
  useEffect(() => {
    // Guard clause : Si aucun ID n'est disponible dans les params, on stoppe net
    if (!id) return;

    async function fetchGameData() {
      try {
        // 1. Récupération du jeu principal
        const reponse = await fetch(`/api/games/${id}`);

        // Sécurité : Si le serveur renvoie une erreur (404, 500...), on évite de parser du JSON inexistant
        if (!reponse.ok) {
          setGame(null);
          setRelatedFranchiseGames([]);
          return;
        }

        // La requête est 200 OK : conversion de la réponse en objet Game
        const data: Game = await reponse.json();
        setGame(data);

        // 2. Récupération des jeux voisins de la franchise
        // On n'exécute la seconde requête que si le jeu possède bien une franchise
        if (data.franchise) {
          // encodeURIComponent sécurise la chaîne (ex: "Mario & Luigi" -> "Mario%20%26%20Luigi")
          const franchiseResponse = await fetch(
            `/api/games?franchise=${encodeURIComponent(data.franchise)}`,
          );

          if (franchiseResponse.ok) {
            const franchiseData: Game[] = await franchiseResponse.json();

            // Calcul algorithmique des 3 jeux voisins (1 avant, 2 après + fallbacks)
            const relatedGames = getRelatedFranchiseGames(data, franchiseData);
            setRelatedFranchiseGames(relatedGames);
          }
        } else {
          // Pas de franchise renseignée pour ce jeu -> réinitialisation à un tableau vide
          setRelatedFranchiseGames([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        // Désactivation de l'état de chargement, que la requête ait réussi ou échoué
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  // Effet B : Gestion du fond d'écran
  useEffect(() => {
    // Si le jeu est chargé et possède une cover, on l'envoie au Provider
    if (game?.images?.cover) {
      setBgImage(game.images.cover);
    }

    // Quand on quitte la page, on réinitialise le fond
    return () => {
      setBgImage(null);
    };
  }, [game, setBgImage]);

  const sampleTabs = [
    {
      label: "Informations",
      content: (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {game?.developer && (
              <div className="flex gap-2">
                {<Undo2 className="w-5 h-5" />}
                <span>{game?.developer}</span>
              </div>
            )}

            {game?.language && (
              <div className="flex gap-2">
                {<Undo2 className="w-5 h-5" />}
                <span>{game?.language}</span>
              </div>
            )}

            {game?.releaseDate && (
              <div className="flex gap-2">
                {<Undo2 className="w-5 h-5" />}
                <span>{formatDate(game?.releaseDate)}</span>
              </div>
            )}

            {game?.genre && (
              <div className="flex gap-2">
                {<Undo2 className="w-5 h-5" />}
                <span>{game?.genre}</span>
              </div>
            )}

            {game?.pegi && (
              <div className="flex gap-2">
                {<Undo2 className="w-5 h-5" />}
                <span>{game?.pegi}</span>
              </div>
            )}

            {game?.estimatedPlaytime && (
              <div className="flex gap-2">
                {<Undo2 className="w-5 h-5" />}
                <span>{game?.estimatedPlaytime}</span>
              </div>
            )}
          </div>
          {game?.description && (
            <p className="text-main/80 text-sm">{game?.description}</p>
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
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  {game?.review.completedDate && (
                    <div className="flex gap-2">
                      {<Undo2 className="w-5 h-5" />}
                      <span>{formatDate(game?.review.completedDate)}</span>
                    </div>
                  )}

                  {game?.review.score && (
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        {<Undo2 className="w-5 h-5" />}
                        <span>{game?.review.score} /10</span>
                        <span className="flex flex-auto gap-2">
                          <ProgressBar value={game?.review.score * 10} />
                        </span>
                      </div>
                    </div>
                  )}

                  {game?.review.playtime && (
                    <div className="flex gap-2">
                      {<Undo2 className="w-5 h-5" />}
                      <span>{game?.review.playtime}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {game?.review.pros && (
                    <ul>
                      {game?.review.pros.map((pro, index) => (
                        <li key={index} className="text-main/80 text-sm">
                          {pro}
                        </li>
                      ))}
                    </ul>
                  )}

                  {game?.review.cons && (
                    <ul>
                      {game?.review.cons.map((con, index) => (
                        <li key={index} className="text-main/80 text-sm">
                          {con}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {game?.review.summary && (
                  <p className="text-main/80 text-sm">{game?.review.summary}</p>
                )}
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {loading ? (
        <p className="p-8 text-gray-400">Chargement en cours...</p>
      ) : !game ? (
        <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
      ) : (
        <LayoutSplit image={game.images.parallax}>
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
          <section className="w-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10  bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70  lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
            <div className="flex flex-wrap justify-between items-center">
              {/* Header */}
              <Heading as="h1" size="lg">
                {game.title}
              </Heading>
              <div className="flex items-center gap-2">
                <ConsoleIcon
                  console={game.console}
                  className="h-2.5 w-auto object-contain"
                />
                {game.format}
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              items={sampleTabs}
              action={
                game?.youtubeId && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsTrailerOpen(true)}
                    >
                      Trailer
                    </Button>
                    <Dialog
                      isOpen={isTrailerOpen}
                      onClose={() => setIsTrailerOpen(false)}
                      maxWidth="max-w-7xl"
                      centered
                    >
                      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                          src={`https://www.youtube.com/embed/${game.youtubeId}?autoplay=1`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </Dialog>
                  </>
                )
              }
            />

            <div>
              {relatedFranchiseGames.length > 0 && (
                <>
                  <Heading as="h2" size="sm">
                    De la même série...
                  </Heading>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {relatedFranchiseGames.map((game) => (
                      <Link
                        key={game.id}
                        href={`/game/${game.id}`}
                        className="transition-all duration-300 hover:scale-110"
                      >
                        <div className="relative h-24">
                          <Image
                            src={game.images.logo}
                            alt={game.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 20vw"
                            className="object-contain object-center"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
          <div className="lg:flex-shrink-0">
            <Button
              variant="secondary"
              onClick={() => {
                const hasInternalHistory = document.referrer.startsWith(
                  window.location.origin,
                );

                if (!hasInternalHistory || window.history.length <= 1) {
                  router.push("/list");
                } else {
                  router.back();
                }
              }}
              icon={<Undo2 className="w-5 h-5" />}
            >
              Retour
            </Button>
          </div>
        </LayoutSplit>
      )}
    </>
  );
}
