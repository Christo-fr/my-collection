"use client";

// =========================================================================
// 1. IMPORTS & TYPAGE
// =========================================================================
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Plus, X } from "lucide-react";

import { useGameReview } from "@/hooks/admin/gameForm/useGameFormReview";

interface TabReviewProps {
  /** Méthodes et états gérant les métriques, avis, points forts/faibles et bilan */
  review: ReturnType<typeof useGameReview>;
  /** Dictionnaire plat contenant les erreurs de validation */
  fieldErrors: Record<string, string>;
  /** Nettoyage d'une erreur lorsqu'un champ est modifié */
  clearField: (fieldKey: string) => void;
}

// =========================================================================
// 2. COMPOSANT VISUEL : ONGLET AVIS & CRITIQUES
// =========================================================================
export default function TabReview({
  review,
  fieldErrors,
  clearField,
}: TabReviewProps) {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
      {/* -----------------------------------------------------------------
          BLOC A : MÉTRIQUES DE COMPLÉTION (DATE, TEMPS, NOTE)
         ----------------------------------------------------------------- */}
      <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
        <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
          <Heading
            as="h2"
            size="md"
            className="font-semibold tracking-wide uppercase"
          >
            Contextes
          </Heading>
        </div>

        <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          <div className="grid gap-4 mb-4">
            {/* Date de complétion */}
            <Input
              label="Date de complétion"
              type="month"
              value={review.completedDate}
              onChange={(e) => {
                review.setCompletedDate(e.target.value);
                clearField("completedDate");
              }}
              error={fieldErrors.completedDate}
            />

            {/* Temps de jeu réel */}
            <Input
              label="Temps de jeu (en heures)"
              type="number"
              min="1"
              value={review.playtime?.toString() || ""}
              onChange={(e) => {
                review.setPlaytime(
                  e.target.value === "" ? null : Number(e.target.value),
                );
                clearField("playtime");
              }}
              error={fieldErrors.playtime}
            />

            {/* Note sur 10 */}
            <Input
              label="Note /10"
              type="number"
              min="0"
              max="10"
              value={review.score?.toString() || ""}
              onChange={(e) => {
                review.setScore(
                  e.target.value === "" ? null : Number(e.target.value),
                );
                clearField("score");
              }}
              error={fieldErrors.score}
            />
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------
          BLOC B : CRITIQUES RÉDIGÉES (PROS, CONS & BILAN)
         ----------------------------------------------------------------- */}
      <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
        <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
          <Heading
            as="h2"
            size="md"
            className="font-semibold tracking-wide uppercase"
          >
            Critiques
          </Heading>
        </div>

        <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          <div className="grid lg:grid-cols-2 gap-2 mb-4">
            {/* Liste dynamique des Points Forts */}
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-main/10">
                <div className="text-xs font-medium text-main/80 px-0.5">
                  Points forts
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onClick={review.handleAddPro}
                  disabled={review.pros.some((pro) => pro.trim() === "")}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <ul>
                {review.pros.map((proItem, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 mb-2"
                  >
                    <Input
                      placeholder="Force"
                      value={proItem}
                      onChange={(e) =>
                        review.handleUpdatePro(index, e.target.value)
                      }
                      error=""
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() => review.handleDeletePro(index)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liste dynamique des Points Faibles */}
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-main/10">
                <div className="text-xs font-medium text-main/80 px-0.5">
                  Points faibles
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onClick={review.handleAddCon}
                  disabled={review.cons.some((con) => con.trim() === "")}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <ul>
                {review.cons.map((conItem, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 mb-2"
                  >
                    <Input
                      placeholder="Faiblesse"
                      value={conItem}
                      onChange={(e) =>
                        review.handleUpdateCon(index, e.target.value)
                      }
                      error=""
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() => review.handleDeleteCon(index)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bilan Global */}
            <div className="md:col-span-2">
              <Textarea
                label="Bilan"
                value={review.summary}
                onChange={(e) => review.setSummary(e.target.value)}
                error={fieldErrors.summary}
                rows={5}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
