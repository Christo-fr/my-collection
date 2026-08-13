import { forwardRef } from "react";
import { Checkbox as HeadlessCheckbox, Field } from "@headlessui/react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

export interface CheckboxProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

// forwardRef sert de passerelle ("passe-plat") :
// Il permet à un composant parent (comme un formulaire ou React Hook Form)
// d'accéder directement à la référence (ref) de l'élément HTML natif <input>.
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, onChange, ...props }, ref) => {
    return (
      <Field className="flex flex-col gap-1.5 w-full">
        {label && <Label label={label} />}
        <HeadlessCheckbox
          checked={checked}
          onChange={onChange}
          className="group block size-4 rounded border  data-checked:bg-primary"
          ref={ref}
          {...props}
        >
          {/* Checkmark icon */}
          <svg
            className="stroke-background opacity-0 group-data-checked:opacity-100"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </HeadlessCheckbox>
        {description && (
          <Description className="text-main/50" description={description} />
        )}
      </Field>
    );
  },
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
