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
      {/* 1. Body : Défilement naturel en mobile, verrouillé en Desktop (md:overflow-hidden) */}
      <body className="min-h-dvh md:h-full w-full bg-neutral-950 text-white md:overflow-hidden relative">
        {/* Fond animé en arrière-plan */}
        <ParticlesBackground />

        {/* 2. Coque globale : min-h-dvh en mobile, fixe (h-dvh) sur Desktop */}
        <div className="relative z-10 flex flex-col min-h-dvh md:h-dvh w-full">
          {/* Header */}
          <Header />

          {/* 3. Zone principale : flex-1 pousse le footer en bas, pas d'overflow-y-auto en mobile */}
          <main className="flex-1 w-full pt-20 pb-16 px-6 md:px-12 md:overflow-hidden">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
