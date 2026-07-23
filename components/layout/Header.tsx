"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"; // 1. Import de DialogBackdrop
import { useState } from "react";

const NAV_LINKS = [
  { label: "Ma liste", href: "/liste" },
  { label: "Suggestion", href: "/suggestion" },
  { label: "Statistiques", href: "/statistiques" },
];

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* --- HEADER DESKTOP & BARRE DE NAVIGATION --- */}
      <header className="relative md:absolute top-0 left-0 w-full z-10 flex justify-between items-center">
        {/* Logo & Navigation Desktop */}
        <div className="flex items-center p-4 px-6 border-b gap-4">
          <Link
            href="/"
            className="text-white text-3xl font-[family-name:var(--font-jewels)] pr-2"
          >
            My Collection
          </Link>

          {/* Navigation Desktop (corrigé sans double nav) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 uppercase hover:text-white text-sm font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Zone du Theme Switch & Bouton Burger */}
        <div className="flex items-center text-white text-sm p-4 px-6 border-b">
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden text-white hover:opacity-80 transition-opacity p-2 focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:flex">Theme</div>
        </div>
      </header>

      {/* --- TIROIR MOBILE ANIMÉ (HEADLESS UI v2) --- */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50 md:hidden"
      >
        {/* 1. Arrière-plan assombri (avec la prop transition) */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
        />

        {/* 2. Conteneur du tiroir */}
        <div className="fixed inset-y-0 right-0 w-full max-w-xs flex">
          {/* DialogPanel reçoit la prop transition et le slide */}
          <DialogPanel
            transition
            className="w-full bg-neutral-900 p-4 px-6 overflow-y-auto flex flex-col justify-between transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div>
              {/* Bouton de fermeture */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white p-2"
                  aria-label="Fermer le menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Mobile */}
              <nav className="flex flex-col gap-6 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-300 uppercase hover:text-white text-sm font-medium transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Zone du Thème tout en bas */}
            <div className="pt-6 mt-8 border-t border-white/10 flex justify-between items-center text-white text-sm">
              <span>Thème</span>
              <span className="text-xs text-gray-400">[ Switch ]</span>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
