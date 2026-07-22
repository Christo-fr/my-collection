import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-10 flex justify-between items-center">
      {/* 1. Logo */}
      <div className="flex items-center p-4 px-6 border-b gap-4">
        <Link
          href="/"
          className="text-white text-3xl font-[family-name:var(--font-jewels)] pr-2"
        >
          My Collection
        </Link>

        {/* 2. Navigation (gauche)*/}
        <nav className="flex items-center gap-6">
          <Link
            href="/liste"
            className="text-gray-300 uppercase hover:text-white text-sm font-medium transition"
          >
            Ma liste
          </Link>
          <Link
            href="/suggestion"
            className="text-gray-300 uppercase hover:text-white text-sm font-medium transition"
          >
            Suggestion
          </Link>
          <Link
            href="/statistiques"
            className="text-gray-300 uppercase hover:text-white text-sm font-medium transition"
          >
            Statistiques
          </Link>
        </nav>
      </div>

      {/* 3. Zone du Theme Switch (droite) */}
      <div className="text-white text-sm p-4 px-6 border-b">Theme</div>
    </header>
  );
}
