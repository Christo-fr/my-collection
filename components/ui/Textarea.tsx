import { forwardRef } from "react";
import { Textarea as HeadlessTextarea, Field } from "@headlessui/react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

// forwardRef sert de passerelle ("passe-plat") :
// Il permet à un composant parent (comme un formulaire ou React Hook Form)
// d'accéder directement à la référence (ref) de l'élément HTML natif <textarea>.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, description, error, className = "", ...props }, ref) => {
    return (
      <Field className="flex flex-col gap-1.5 w-full">
        {label && <Label label={label} />}
        <HeadlessTextarea
          name={label}
          rows={4}
          className={`
            w-full rounded-lg bg-main/10 px-3 py-2 text-sm text-main outline-none transition-all
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
          <Description className="text-red-500" description={error} />
        ) : description ? (
          <Description className="text-main/50" description={description} />
        ) : null}
      </Field>
    );
  },
);
Textarea.displayName = "Textarea";

export default Textarea;
