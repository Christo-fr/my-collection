import { forwardRef } from "react";
import { Field } from "@headlessui/react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

export interface RangeProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: number;
  onChange: (value: number) => void;
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
    // 💡 LA CONST SE MET ICI : Juste avant le return
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
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
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
