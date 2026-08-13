import {
  Combobox as HeadlessCombobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
  Field,
} from "@headlessui/react";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import Description from "@/components/ui/Description";
import Label from "@/components/ui/Label";

export interface ComboboxItemOption {
  label: string; // Ce qu'on affiche (ex: "Nintendo Switch")
  value: string; // La valeur (ex: "switch")
}

export interface ComboboxProps {
  label?: string;
  description?: string;
  error?: string;
  options: ComboboxItemOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Combobox({
  label,
  description,
  error,
  options,
  selectedValue,
  onChange,
  className = "",
  placeholder = "Sélectionner ou saisir...",
}: ComboboxProps) {
  const [query, setQuery] = useState("");

  // 1. Filtrage classique selon la recherche
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase()),
        );

  // 2. Est-ce que ce qui est tapé existe déjà EXACTEMENT ?
  const isExactMatch = options.some(
    (option) => option.label.toLowerCase() === query.trim().toLowerCase(),
  );

  // 3. Option de création si saisie libre
  const displayOptions =
    query.trim() !== "" && !isExactMatch
      ? [
          { label: query.trim(), value: query.trim(), isNew: true },
          ...filteredOptions,
        ]
      : filteredOptions;

  return (
    <Field className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <Label label={label} />}

      <HeadlessCombobox
        value={selectedValue}
        onChange={(val) => {
          if (val) onChange(val);
          setQuery("");
        }}
      >
        <div className="relative w-full">
          {/* Champ de saisie texte */}
          <ComboboxInput
            displayValue={(val: string) => {
              const found = options.find((o) => o.value === val);
              return found ? found.label : val || "";
            }}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl border bg-background/20 backdrop-blur-sm text-sm text-main focus:outline-none transition-all ${
              error
                ? "border-red-500/50 focus:border-red-500"
                : "border-main/10 focus:border-main/30"
            }`}
          />

          {/* Bouton flèche d'ouverture */}
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3 group">
            <ChevronDown className="w-4 h-4 text-main/40 transition-transform duration-200 group-data-[open]:rotate-180" />
          </ComboboxButton>

          {/* Liste déroulante des propositions */}
          <ComboboxOptions
            anchor="bottom start"
            className="w-[var(--input-width)] mt-1 max-h-60 overflow-auto rounded-xl border border-main/10 bg-background/95 backdrop-blur-md p-1 shadow-lg focus:outline-none z-50 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {displayOptions.length === 0 ? (
              <div className="py-2 px-3 text-xs text-main/40">
                Aucun résultat
              </div>
            ) : (
              displayOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option.value}
                  className="group flex items-center justify-between gap-2 py-2 px-3 rounded-lg text-sm cursor-pointer select-none text-main data-[focus]:bg-main/10 data-[selected]:font-semibold"
                >
                  {({ selected }) => (
                    <>
                      <span className="truncate">
                        {(option as { isNew?: boolean }).isNew
                          ? `+ Créer "${option.label}"`
                          : option.label}
                      </span>
                      {selected && (
                        <Check className="w-4 h-4 text-main shrink-0" />
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </HeadlessCombobox>

      {error ? (
        <Description className="text-red-500" description={error} />
      ) : description ? (
        <Description className="text-main/50" description={description} />
      ) : null}
    </Field>
  );
}
