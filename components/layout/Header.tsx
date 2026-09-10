"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"; // 1. Import de DialogBackdrop
import { useState, useEffect } from "react";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Ma liste", href: "/list" },
  { label: "Suggestion", href: "/suggestion" },
  { label: "Statistiques", href: "/statistiques" },
];

export default function Header() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  //Savoir si l'user est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  // Cache le menu de navigation sur la page d'inscription
  const isSignupPage = pathname === "/signup";

  // Déconnexion de l'utilisateur
  const handleLogout = async () => {
    // 1. On change l'icône INSTANTANÉMENT dans l'interface (effet zéro latence)
    setIsLoggedIn(false);

    // 2. On effectue la déconnexion Supabase en arrière-plan
    await supabase.auth.signOut();

    // 3. Si on était sur une page admin, on redirige
    if (pathname.startsWith("/administration")) {
      router.push("/list");
    }
  };

  // Définition d'une fonction asynchrone pour vérifier l'utilisateur auprès du serveur Supabase
  useEffect(() => {
    const checkLoggedIn = async () => {
      const {
        data: { user }, // 1.On extrait directement l'objet "user" du résultat envoyé par Supabase
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    // 2. Écouteur d'événements Supabase (Temps réel)
    // Il s'active automatiquement dès que l'état change (connexion, déconnexion...)
    const {
      data: { subscription }, // On récupère l'abonnement pour pouvoir le fermer plus tard
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Si une session existe, session?.user sera un objet (donc TRUE), sinon FALSE
      setIsLoggedIn(!!session?.user);
    });

    // 3. Exécution de la vérification initiale au chargement de la page
    checkLoggedIn();

    // 4. Nettoyage (Clean-up)
    return () => subscription.unsubscribe();
  }, [supabase]);

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
            My Little Collection
          </Link>

          {/* --- MENU : DESKTOP --- */}
          {!isSignupPage && (
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
          )}
        </div>

        {/* --- SWITCH, MENU ADMIN : DESKTOP & BTN BURGER MENU --- */}
        <div className="flex items-center text-sm p-4 px-6 border-b ">
          {!isSignupPage && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="lg:hidden  transition-opacity p-2 focus:outline-none"
              aria-label="Ouvrir le menu"
              size="sm"
              variant="secondary"
            >
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <div
            className={` ${!isSignupPage ? "hidden" : "flex"} lg:flex gap-3 items-center`}
          >
            {isLoggedIn && !isSignupPage && (
              <Link
                key="administration"
                href="/administration"
                className={`uppercase hover:text-hover text-sm font-medium transition ${pathname === "/administration" ? "text-hover" : "text-main"}`}
              >
                Administration
              </Link>
            )}
            <ThemeSwitch />
            {!isSignupPage && (
              <Button
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                className="transition-opacity p-2 focus:outline-none"
                aria-label="Authentification"
                size="sm"
                variant="secondary"
              >
                {isLoggedIn ? (
                  <LogOut className="w-6 h-6 " aria-label="Se déconnecter" />
                ) : (
                  <LogIn className="w-6 h-6" aria-label="Se connecter" />
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* --- MENU MOBILE  --- */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50 lg:hidden"
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
                {isLoggedIn && !isSignupPage && (
                  <>
                    <Link
                      key="/administration"
                      href="/administration"
                      onClick={() => setIsModalOpen(false)}
                      className={`uppercase hover:text-hover text-sm font-medium transition ${pathname === "/administration" ? "text-hover" : ""}`}
                    >
                      Administration
                    </Link>
                    <div
                      onClick={() => {
                        handleLogout();
                        setIsModalOpen(false);
                      }}
                      className={`uppercase hover:text-hover text-sm font-medium transition cursor-pointer`}
                    >
                      Déconnexion
                    </div>
                  </>
                )}
                {!isLoggedIn && (
                  <Link
                    key="/login"
                    href="/login"
                    onClick={() => setIsModalOpen(false)}
                    className={`uppercase hover:text-hover text-sm font-medium pointer transition ${pathname === "/login" ? "text-hover" : ""}`}
                  >
                    Authentification
                  </Link>
                )}
              </nav>
            </div>

            <div className="pt-6 mt-8 border-t border-main/10 flex justify-between items-center text-main text-sm">
              <span>Thème</span>
              <ThemeSwitch />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
