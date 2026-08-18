import { useMemo, useState } from "react";
import Image from "next/image";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { ImageIcon } from "lucide-react";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

interface ImageInputProps {
  label: string;
  uploadFile: File | null;
  onUploadChange: (file: File | null) => void;
  urlValue: string;
  onUrlChange: (url: string) => void;
  showTruncateCheckbox?: boolean;
  isTruncated?: boolean;
  onTruncateChange?: (truncated: boolean) => void;
  error?: string;
  sourceType?: "file" | "url";
  onSourceTypeChange?: (type: "file" | "url") => void;
}

export default function ImageInput({
  label,
  uploadFile,
  onUploadChange,
  urlValue,
  onUrlChange,
  showTruncateCheckbox,
  isTruncated,
  onTruncateChange,
  error,
  sourceType,
  onSourceTypeChange,
}: ImageInputProps) {
  // 1. Suivi de l'onglet actif (0 = Fichier, 1 = URL)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // 2. Prévisualisation basée STRICTEMENT sur l'onglet sélectionné
  const previewUrl = useMemo(() => {
    if (selectedIndex === 0) {
      return uploadFile ? URL.createObjectURL(uploadFile) : null;
    }
    return urlValue.trim() !== "" ? urlValue : null;
  }, [selectedIndex, uploadFile, urlValue]);

  // 3. Détection si une source est valide dans l'onglet courant
  const hasActiveValue = Boolean(previewUrl);

  return (
    <div className="flex flex-col gap-2 p-3 bg-main/5 rounded-xl border border-main/10">
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={(index) => {
          setSelectedIndex(index);
          onSourceTypeChange?.(index === 0 ? "file" : "url");
        }}
        className="flex flex-col gap-2"
      >
        {/* En-tête : Label + Onglets */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-main/80">{label}</span>

          <TabList className="flex gap-1 p-0.5 bg-main/10 rounded-lg">
            <Tab className="px-2 py-0.5 text-[11px] font-medium uppercase rounded-md transition-all outline-none cursor-pointer text-main/60 data-[selected]:bg-accent data-[selected]:text-main data-[selected]:font-bold">
              Fichier
            </Tab>
            <Tab className="px-2 py-0.5 text-[11px] font-medium uppercase rounded-md transition-all outline-none cursor-pointer text-main/60 data-[selected]:bg-accent data-[selected]:text-main data-[selected]:font-bold">
              URL
            </Tab>
          </TabList>
        </div>

        {/* Champs de saisie */}
        <TabPanels>
          <TabPanel className="focus:outline-none">
            <Input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) =>
                onUploadChange(e.target.files ? e.target.files[0] : null)
              }
              error={error}
            />
          </TabPanel>

          <TabPanel className="focus:outline-none">
            <Input
              type="text"
              placeholder="https://..."
              value={urlValue}
              onChange={(e) => onUrlChange(e.target.value)}
              error={error}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Zone de prévisualisation */}
      <div className="relative w-full h-24 rounded-lg bg-background/50 border border-main/10 overflow-hidden flex items-center justify-center">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`Aperçu ${label}`}
            fill
            unoptimized
            className={`object-contain p-1 transition-all ${
              hasActiveValue ? "border-2 border-emerald-500/60 rounded-lg" : ""
            }`}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-main/30">
            <ImageIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase font-medium">
              Aucun visuel
            </span>
          </div>
        )}
      </div>

      {/* Case Tronqué facultative */}
      {showTruncateCheckbox && (
        <div className="pt-1 border-t border-main/5">
          <Checkbox
            label="Image tronquée ?"
            checked={isTruncated}
            onChange={(checked) => onTruncateChange?.(checked)}
          />
        </div>
      )}
    </div>
  );
}
