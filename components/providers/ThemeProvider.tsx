"use client"; // Le context provider doit tourner côté client
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // Injecte/retire la classe du theme sur la balise <html>
      defaultTheme="system" // Utilise le thème du système/navigateur par défaut au premier passage
      enableSystem // Écoute les changements de thème du système d'exploitation
    >
      {children}
    </NextThemesProvider>
  );
}
