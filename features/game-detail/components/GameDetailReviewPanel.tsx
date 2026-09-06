import { CalendarCheck, Award, Timer } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";
import { Game } from "@/types/game";
import { formatDate } from "@/utils/gameUtils";

interface GameDetailReviewPanelProps {
  review: NonNullable<Game["review"]>;
}

export default function GameDetailReviewPanel({
  review,
}: GameDetailReviewPanelProps) {
  return (
    <>
      {/* Statistiques de complétion */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {review.completedDate && (
          <div className="flex gap-2 items-center" title="Date de complétion">
            <CalendarCheck className="w-5 h-5" />
            <span>{formatDate(review.completedDate)}</span>
          </div>
        )}

        {review.score && (
          <div className="col-span-2">
            <div className="flex items-center gap-2" title="Note du jeu">
              <Award className="w-5 h-5" />
              <span>{review.score} /10</span>
              <span className="flex flex-auto gap-2">
                <ProgressBar value={review.score * 10} />
              </span>
            </div>
          </div>
        )}

        {review.playtime && (
          <div className="flex gap-2 items-center" title="Temps de jeu">
            <Timer className="w-5 h-5" />
            <span>{review.playtime} h</span>
          </div>
        )}
      </div>

      {/* Listes des points forts et des points faibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {review.pros && (
          <ul className="space-y-1">
            {review.pros.map((pro, index) => (
              <li
                key={index}
                className="text-main/90 dark:text-main/80 text-sm flex gap-1"
              >
                <span className="text-main/60 shrink-0">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        )}

        {review.cons && (
          <ul className="space-y-1">
            {review.cons.map((con, index) => (
              <li
                key={index}
                className="text-main/90 dark:text-main/80 text-sm flex gap-1"
              >
                <span className="text-main/60 shrink-0">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bilan de la critique */}
      {review.summary && (
        <p className="mt-4 whitespace-pre-line text-main/90 dark:text-main/80 text-sm leading-relaxed">
          {review.summary}
        </p>
      )}
    </>
  );
}
