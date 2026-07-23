import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticlesBackground from "@/components/layout/ParticlesBackground";
import AppBackground from "@/components/layout/AppBackground";
import "./globals.css";

const jewelsFont = localFont({
  variable: "--font-jewels",
  src: "../assets/fonts/Jewels.ttf",
});

const notoFont = localFont({
  variable: "--font-noto",
  src: "../assets/fonts/NotoSans-Italic-VariableFont.ttf",
});

export const metadata: Metadata = {
  title: "My Collection",
  description: "Ma vidéoludothèque personnelle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${jewelsFont.variable} ${notoFont.variable} h-full antialiased`}
    >
      <body className=" min-h-dvh md:h-full w-full bg-neutral-950 md:overflow-hidden relative bg-[var(--bg-main)] text-[var(--text-main)]">
        {/* Gestion du Theme via le Provider*/}
        <ThemeProvider>
          {/* Couche UI n°3 : Le contenu interactif de l'app (z-10) */}

          <div className="relative z-10 flex flex-col min-h-dvh md:h-dvh w-full">
            <Header />

            <main className="flex-1 w-full pt-20 pb-16 px-6 md:px-12 md:overflow-hidden">
              {children}
            </main>

            <Footer />
          </div>

          {/* Couche de fond n°1 : L'image (-z-20) */}

          <AppBackground />

          {/* Couche de fond n°2 : Les particules (-z-10) */}

          <ParticlesBackground />
        </ThemeProvider>
      </body>
    </html>
  );
}
