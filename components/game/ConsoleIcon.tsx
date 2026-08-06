"use client";

import { useState } from "react";

const CONSOLE_ICONS: Record<string, string> = {
  GC: "/icons/console/gc.webp",
  N64: "/icons/console/n64.webp",
  PS3: "/icons/console/ps3.webp",
  PS4: "/icons/console/ps4.webp",
  PS5: "/icons/console/ps5.webp",
  Switch: "/icons/console/switch.webp",
  "Switch 2": "/icons/console/switch2.webp",
  Wii: "/icons/console/wii.webp",
  "Wii U": "/icons/console/wiiu.webp",
};

export default function ConsoleIcon({
  console,
  className,
}: {
  console: string;
  className?: string;
}) {
  // 1. Le state d'erreur
  const [hasError, setHasError] = useState(false);

  // 2. La recherche du chemin d'accès
  const iconPath = CONSOLE_ICONS[console];

  return iconPath && !hasError ? (
    <img
      src={iconPath}
      alt={console}
      className={`dark:invert ${className}`}
      onError={() => setHasError(true)}
    />
  ) : (
    <span>{console}</span>
  );
}
