import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Field,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  description?: string;
  error?: string;
  options: SelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  isAi?: boolean;
}

export default function Select({
  label,
  description,
  error,
  isAi,
  options,
  selectedValue,
  onChange,
  className = "",
  placeholder = "Sélectionner...",
}: SelectProps) {
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  return (
    <Field className="flex flex-col gap-1.5 w-full">
      {label && <Label label={label} />}

      <Listbox value={selectedValue} onChange={onChange}>
        <ListboxButton
          className={`relative group w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl border bg-main/5 text-main outline-none transition-all cursor-pointer 
            data-[hover]:bg-main/10 data-[focus]:border-accent data-[focus]:ring-2 data-[focus]:ring-accent/20 
            ${
              error
                ? "border-red-500/50 focus:border-red-500"
                : isAi
                  ? "border-cyan-500/50 focus:border-cyan-500"
                  : "border-main/20"
            } 
            ${className}`}
        >
          {/* Libellé ou Placeholder si aucune valeur sélectionnée */}
          <span className={!selectedOption ? "text-main/40" : ""}>
            {selectedOption?.label || placeholder}
          </span>

          {/* Flèche avec rotation à 180° à l'ouverture */}
          <ChevronDown className="w-4 h-4 opacity-60 transition-transform duration-200 group-data-[open]:rotate-180" />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          className="w-[var(--button-width)] z-50 bg-background/50 backdrop-blur-md border border-main/10 rounded-xl p-1 shadow-xl mt-1 focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 !max-h-100 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors text-main/80 data-[focus]:bg-accent data-[focus]:text-hover data-[selected]:font-semibold data-[selected]:text-accent"
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>

      {error ? (
        <Description className="text-red-500" description={error} />
      ) : description ? (
        <Description className="text-main/50" description={description} />
      ) : null}
    </Field>
  );
}
