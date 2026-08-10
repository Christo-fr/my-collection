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
  label: string; // Ce qu'on affiche à l'écran (ex: "Nintendo Switch")
  value: string; // La valeur stockée en DB/State (ex: "switch")
}

export interface SelectProps {
  label?: string;
  description?: string;
  error?: string;
  options: SelectOption[]; // Liste des options disponibles
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function Select({
  label,
  description,
  error,
  options,
  selectedValue,
  onChange,
  className = "",
  placeholder = "Sélectionner...",
}: SelectProps) {
  // On retrouve l'option sélectionnée pour afficher son libellé
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  return (
    <Field className="flex flex-col gap-1.5 w-full">
      {label && <Label label={label} />}

      <Listbox value={selectedValue} onChange={onChange}>
        {/* 'group' permet à la flèche interne de réagir à l'état data-[open] du bouton */}
        <ListboxButton
          className={`relative group w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl border border-main/20 bg-main/5 text-main outline-none transition-all cursor-pointer data-[focus]:border-accent data-[focus]:ring-2 data-[focus]:ring-accent/20 ${className}`}
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
          className="w-[var(--button-width)] z-50 bg-background/50 backdrop-blur-md border border-main/10 rounded-xl p-1 shadow-xl mt-1 focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 !max-h-100  overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="flex items-center  justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors text-main/80 data-[focus]:bg-accent data-[focus]:text-hover data-[selected]:font-semibold data-[selected]:text-accent"
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
