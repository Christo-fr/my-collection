import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BackgroundProvider } from "@/components/providers/BackgroundProvider";
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
      <body
        suppressHydrationWarning
        className="font-noto min-h-dvh transition-colors duration-500 lg:h-full w-full mlg:overflow-hidden relative bg-background text-main"
      >
        {/* Gestion du Theme via le Provider*/}
        <ThemeProvider>
          <BackgroundProvider>
            {/* Application */}
            <div className="relative z-10 flex flex-col min-h-dvh md:h-dvh w-full">
              <Header />
              <main className="flex-1 w-full pt-20 px-6 md:px-12 lg:overflow-hidden">
                {children}
              </main>
              <Footer />
            </div>

            {/* Couches de Background */}
            <AppBackground />
            <ParticlesBackground />
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
