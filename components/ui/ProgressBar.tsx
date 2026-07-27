import { ReactNode } from "react";

export interface ProgressBarProps {
  value: number; // Valeur actuelle de la barre de progression (0 à 100)
  max?: number; // Valeur maximale de la barre de progression (par défaut 100)
  className?: string; // Classes CSS supplémentaires pour le conteneur
  labelLeft?: ReactNode;
  labelRight?: ReactNode;
  showPercentage?: boolean; // Afficher le pourcentage à l'intérieur de la barre
}

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  labelLeft,
  labelRight,
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <div className="w-full h-2.5 rounded-full bg-main/30 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-grad-start to-grad-end "
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {/* Pied de jauge */}
      {(labelLeft || labelRight) && (
        <div className="flex justify-between items-center text-xs font-medium text-main/80 px-0.5">
          {/* Affiche à gauche SEULEMENT si labelLeft existe */}
          <span>
            {labelLeft &&
              `${labelLeft} : ${showPercentage ? percentage + "%" : value}`}
          </span>

          {/* Affiche à droite SEULEMENT si labelRight existe */}
          <span>
            {labelRight &&
              `${labelRight} : ${showPercentage ? 100 - percentage + "%" : max - value}`}
          </span>
        </div>
      )}
    </div>
  );
}
