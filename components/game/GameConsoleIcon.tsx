"use client";

import { useState } from "react";
import { useGamesContext } from "@/components/providers/GamesProvider";

export default function ConsoleIcon({
  console,
  className = "",
}: {
  console: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const { consoles } = useGamesContext();

  const currentConsole = consoles.find((c) => c.short_name === console);

  // On vérifie aussi que logo_url existe bien
  return currentConsole?.logo_url && !hasError ? (
    <img
      src={currentConsole.logo_url}
      alt={currentConsole.full_name || currentConsole.short_name}
      title={currentConsole.full_name || currentConsole.short_name}
      className={`${currentConsole.is_bw ? "dark:invert" : ""} ${className}`}
      onError={() => setHasError(true)}
    />
  ) : (
    <span className={` ${className}`}>{console}</span>
  );
}
