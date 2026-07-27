import { forwardRef } from "react";
import {
  Input as HeadlessInput,
  Label,
  Description,
  Field,
} from "@headlessui/react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

// forwardRef sert de passerelle ("passe-plat") :
// Il permet à un composant parent (comme un formulaire ou React Hook Form)
// d'accéder directement à la référence (ref) de l'élément HTML natif <input>.
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, className = "", ...props }, ref) => {
    return (
      <Field className="flex flex-col gap-1.5 w-full">
        {label && (
          <Label className="text-xs font-medium text-main/80 px-0.5">
            {label}
          </Label>
        )}
        <HeadlessInput
          name={label}
          className={`w-full rounded-lg bg-main/10 px-3 py-2 text-sm text-main outline-none transition-all
            placeholder:text-main/40 border border-transparent
            data-[hover]:bg-main/15
            data-[focus]:border-accent data-[focus]:ring-1 data-[focus]:ring-accent
            data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
            ${error ? "border-red-500/50 focus:border-red-500" : ""}
            ${className}
        `}
          ref={ref}
          {...props}
        />
        {error ? (
          <Description className="text-xs text-red-500">{error}</Description>
        ) : description ? (
          <Description className="text-xs text-main/50">
            {description}
          </Description>
        ) : null}
      </Field>
    );
  },
);
Input.displayName = "Input";

export default Input;
