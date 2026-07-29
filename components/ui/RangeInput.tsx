import { forwardRef } from "react";
import { Field } from "@headlessui/react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

/**
 * 💡 POURQUOI ET COMMENT UTILISER Omit ?
 *
 * 1. Pourquoi ?
 * Par défaut, React.InputHTMLAttributes<HTMLInputElement> contient déjà une propriété "onChange".
 * Sa signature native attend un événement complet : (e: React.ChangeEvent<HTMLInputElement>) => void.
 * Comme nous voulons que notre composant renvoie DIRECTEMENT un nombre (value: number => void),
 * TypeScript générerait un conflit de types si nous réécrivions juste "onChange".
 *
 * 2. Syntaxe & Fonctionnement : Omit<TypeOrigine, "ClefASupprimer">
 * Omit est un utilitaire TypeScript ("ciseaux").
 * Il prend le type global de l'input natif, en EXCLUT la clef "onChange" native,
 * puis nous laisse réinjecter notre propre version simplifiée juste en dessous.
 */
export interface RangeProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: number;
  onChange: (value: number) => void; // Notre version sur-mesure (renvoie un number)
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

// forwardRef sert de passerelle ("passe-plat") :
// Il permet à un composant parent (comme React Hook Form)
// d'accéder directement à la référence (ref) de l'élément HTML natif <input>.
export const RangeInput = forwardRef<HTMLInputElement, RangeProps>(
  (
    {
      label,
      description,
      value,
      onChange,
      min = 1,
      max = 100,
      step = 1,
      unit = "h",
      className = "",
      ...props
    },
    ref,
  ) => {
    // Calcul de la progression en % (de 0 à 100) pour alimenter le fond dynamique du slider
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <Field className="flex flex-col gap-1.5 w-full">
        {/* En-tête : Label à gauche + Valeur dynamique à droite */}
        {(label || value !== undefined) && (
          <div className="flex justify-between items-center">
            {label && <Label label={label} />}
            <span className="text-xs font-semibold text-accent">
              {value} {unit}
            </span>
          </div>
        )}

        {/* Curseur de plage HTML natif */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          // Conversion : On intercepte l'événement (e), on extrait la string (e.target.value),
          // on la transforme en nombre avec Number(), puis on la passe à notre prop onChange.
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            // CSS dynamique : Remplissage en dégradé jusqu'à `percentage`%, puis fond sombre pour le reste
            background: `linear-gradient(to right, var(--grad-start) 0%, var(--grad-end) ${percentage}%, rgba(255, 255, 255, 0.15) ${percentage}%)`,
          }}
          className={`w-full accent-[var(--grad-end)] cursor-pointer h-2 rounded-lg appearance-none bg-grad-end ${className}`}
          ref={ref}
          {...props}
        />

        {/* Description optionnelle sous le slider */}
        {description && (
          <Description className="text-main/50" description={description} />
        )}
      </Field>
    );
  },
);

RangeInput.displayName = "RangeInput";

export default RangeInput;
