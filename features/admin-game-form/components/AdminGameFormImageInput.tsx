"use client";

// =========================================================================
// 1. IMPORTS & TYPAGE
// =========================================================================
import { useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { ImageIcon } from "lucide-react";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

interface AdminGameFormImageInputProps {
  label: string;
  uploadFile: File | null;
  onUploadChange: (file: File | null) => void;
  urlValue: string;
  onUrlChange: (url: string) => void;
  initialUrl?: string;
  showTruncateCheckbox?: boolean;
  isTruncated?: boolean;
  onTruncateChange?: (truncated: boolean) => void;
  error?: string;
  sourceType?: "file" | "url";
  onSourceTypeChange?: (type: "file" | "url") => void;
  isAi?: boolean;
}

export default function AdminGameFormImageInput({
  label,
  uploadFile,
  onUploadChange,
  urlValue,
  onUrlChange,
  initialUrl,
  showTruncateCheckbox,
  isTruncated,
  onTruncateChange,
  error,
  sourceType = "file",
  isAi,
  onSourceTypeChange,
}: AdminGameFormImageInputProps) {
  // Stocke l'URL initiale BDD
  const baseDbUrl = initialUrl || urlValue;
  const initialUrlRef = useRef(baseDbUrl);

  useEffect(() => {
    if (initialUrl) {
      initialUrlRef.current = initialUrl;
    }
  }, [initialUrl]);

  const selectedIndex = sourceType === "url" ? 1 : 0;

  // 1. APERÇU : Fichier > Nouvelle URL saisie > Image BDD
  const previewUrl = useMemo(() => {
    if (sourceType === "file" && uploadFile) {
      return URL.createObjectURL(uploadFile);
    }
    if (sourceType === "url" && urlValue.trim() !== "") {
      return urlValue.trim();
    }
    return initialUrl || null;
  }, [sourceType, uploadFile, urlValue, initialUrl]);

  // Bascule automatiquement sur l'onglet "URL" lorsqu'une URL est injectée (ex: par l'IA)
  useEffect(() => {
    if (urlValue.trim() !== "" && !uploadFile) {
      onSourceTypeChange?.("url");
    }
  }, [urlValue]);

  // 2. DÉTECTION DU CHANGEMENT (Bordure émeraude)
  const isChanged = useMemo(() => {
    if (sourceType === "file" && uploadFile) return true;
    if (sourceType === "url" && urlValue.trim() !== "") return true;
    return false;
  }, [sourceType, uploadFile, urlValue]);

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-xl border transition-colors ${
        error
          ? "border-red-500/80 bg-red-500/5"
          : isAi
            ? "border-cyan-500/50 bg-cyan-500/5"
            : "border-main/10 bg-main/5"
      }`}
    >
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={(index) => {
          onSourceTypeChange?.(index === 0 ? "file" : "url");
        }}
        className="flex flex-col gap-2"
      >
        {/* En-tête : Label + Onglets */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-main/80">{label}</span>

          <TabList className="flex gap-1 p-0.5 bg-main/10 rounded-lg">
            <Tab className="px-2 py-0.5 text-[11px] font-medium uppercase rounded-md transition-colors outline-none cursor-pointer text-main/60 data-[selected]:bg-accent data-[selected]:text-main data-[selected]:font-bold">
              Fichier
            </Tab>
            <Tab className="px-2 py-0.5 text-[11px] font-medium uppercase rounded-md transition-colors outline-none cursor-pointer text-main/60 data-[selected]:bg-accent data-[selected]:text-main data-[selected]:font-bold">
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
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                onUploadChange(file);
                if (file) onSourceTypeChange?.("file");
              }}
              error={error}
            />
          </TabPanel>

          <TabPanel className="focus:outline-none">
            <Input
              type="text"
              placeholder="https://..."
              value={urlValue}
              onChange={(e) => {
                onUrlChange(e.target.value);
                onSourceTypeChange?.("url");
              }}
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
            className={`object-contain p-1 transition-colors ${
              isChanged ? "border-2 border-emerald-500/60 rounded-lg" : ""
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
