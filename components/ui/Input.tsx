import { forwardRef } from "react";
import { Input as HeadlessInput, Field } from "@headlessui/react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string | boolean;
}

// forwardRef sert de passerelle ("passe-plat") :
// Il permet à un composant parent (comme un formulaire ou React Hook Form)
// d'accéder directement à la référence (ref) de l'élément HTML natif <input>.
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, className = "", ...props }, ref) => {
    return (
      <Field className="flex flex-col gap-1.5 w-full">
        {label && <Label label={label} />}
        <HeadlessInput
          name={label}
          className={`w-full rounded-xl bg-main/5 px-3.5 py-2.5 text-sm text-main outline-none transition-all
            placeholder:text-main/40 border border-main/20
            data-[hover]:bg-main/10
            data-[focus]:border-accent data-[focus]:ring-1 data-[focus]:ring-accent
            data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
            ${error ? "border-red-500/50 focus:border-red-500" : ""}
            ${className}
        `}
          ref={ref}
          {...props}
        />
        {typeof error === "string" ? (
          <Description className="text-red-500" description={error} />
        ) : description ? (
          <Description className="text-main/50" description={description} />
        ) : null}
      </Field>
    );
  },
);
Input.displayName = "Input";

export default Input;
