"use client";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function URLTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ALLOW_ROUTES = [
    "/list",
    "/statistiques",
    "/suggestion",
    "/administration",
  ];

  useEffect(() => {
    // 1. On transforme les paramètres en texte
    const queryString = searchParams.toString();

    // 2. On construit l'URL proprement : si y a des params, on met le "?", sinon juste le pathname
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

    //Est-ce qu'au moins un élément de ce tableau valide une condition spécifique ? (.some)
    const isAllowedRoute =
      currentUrl && ALLOW_ROUTES.some((route) => currentUrl.startsWith(route));

    if (isAllowedRoute) {
      sessionStorage.setItem("lastCatalogUrl", currentUrl);
    }
  }, [pathname, searchParams]);

  return null; // Ce composant n'a pas besoin de rendre quoi que ce soit
}
