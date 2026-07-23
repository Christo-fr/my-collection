"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitch() {
  // Récupération du thème actuel et de la fonction pour le modifier via next-themes
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  // Empêche les erreurs d'hydratation entre Next.js (serveur) et le navigateur.
  if (!mounted) return <div className="w-16 h-6" />;

  return (
    <div className="flex items-center gap-2">
      {/* Soleil : Ambré en mode light, grisé en dark */}
      <Sun className={`w-4 h-4 ${isDark ? "text-main" : "text-tertiaire"}`} />

      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Changer de thème"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-600 cursor-pointer ${
          isDark ? "bg-neutral-700 border border-white/10" : "bg-tertiaire"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-600 cursor-pointer ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      {/* Lune : Bleutée en mode dark, meulée/grisée en light */}
      <Moon className={`w-4 h-4 ${isDark ? "text-tertiaire" : "text-main"}`} />
    </div>
  );
}
