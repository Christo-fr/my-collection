import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticlesBackground from "@/components/layout/ParticlesBackground";
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
      className={`${jewelsFont.variable} ${notoFont.variable} h-full antialiased`}
    >
      <body className="h-full w-full bg-neutral-950 text-white overflow-hidden relative">
        {/* 1. Fond animé en arrière-plan (ne bloque pas les clics) */}
        <ParticlesBackground />

        {/* 2. Coque globale flexbox (Application Shell) */}
        <div className="relative z-10 flex flex-col h-dvh w-full overflow-y-auto md:overflow-hidden">
          {/* Header fixe en haut */}
          <Header />

          {/* Zone principale qui occupe tout l'espace restant */}
          <main className="flex-1 w-full overflow-y-auto md:overflow-hidden pt-20 pb-16 px-6 md:px-12">
            {children}
          </main>

          {/* Footer fixe en bas */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
