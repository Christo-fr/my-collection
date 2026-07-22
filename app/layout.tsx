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
      <body className="min-h-full flex flex-col">
        <Header />
        <ParticlesBackground />
        {children}
        <Footer />
      </body>
    </html>
  );
}
