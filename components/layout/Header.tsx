"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn } from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"; // 1. Import de DialogBackdrop
import { useState } from "react";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Ma liste", href: "/list" },
  { label: "Suggestion", href: "/suggestion" },
  { label: "Statistiques", href: "/statistiques" },
];

export default function Header() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* --- HEADER --- */}
      <header className="relative md:absolute top-0 left-0 w-full z-10 flex justify-between items-center">
        {/* --- LOGO & MENU --- */}
        <div className="flex items-center p-4 px-6 border-b gap-4">
          <Link
            href="/"
            className="text-primary text-3xl font-[family-name:var(--font-jewels)] pr-2"
          >
            My Collection
          </Link>

          {/* --- MENU : DESKTOP --- */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`uppercase hover:text-hover text-sm font-medium transition ${pathname === link.href ? "text-hover" : "text-main"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- SWITCH, MENU ADMIN : DESKTOP & BTN BURGER MENU --- */}
        <div className="flex items-center text-sm p-4 px-6 border-b ">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="lg:hidden text-main hover:text-hover transition-opacity p-2 focus:outline-none"
            aria-label="Ouvrir le menu"
            size="sm"
            variant="secondary"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="hidden lg:flex gap-3 items-center">
            <ThemeSwitch />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="text-main hover:text-hover transition-opacity p-2 focus:outline-none"
              aria-label="Authentification"
              size="sm"
              variant="secondary"
            >
              <LogIn className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MENU MOBILE  --- */}
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

        {/* 2. Conteneur du menu mobile*/}
        <div className="fixed inset-y-0 right-0 w-full max-w-xs flex">
          {/* DialogPanel reçoit la prop transition et le slide */}
          <DialogPanel
            transition
            className="w-full bg-background p-4 px-6 overflow-y-auto flex flex-col justify-between transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div>
              {/* Bouton de fermeture */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-main cursor-pointer hover:text-hover p-2"
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
                    className={`uppercase hover:text-hover text-sm font-medium transition ${pathname === link.href ? "text-hover" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  key="/login"
                  href="/login"
                  onClick={() => setIsModalOpen(false)}
                  className={`uppercase hover:text-hover text-sm font-medium transition ${pathname === "/login" ? "text-hover" : ""}`}
                >
                  Authentification
                </Link>
              </nav>
            </div>

            <div className="pt-6 mt-8 border-t border-white/10 flex justify-between items-center text-main text-sm">
              <span>Thème</span>
              <ThemeSwitch />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
