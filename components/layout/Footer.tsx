import Link from "next/link";

export default function Footer() {
  return (
    <footer className="absolute bottom-0 right-0 w-full z-10 flex justify-end items-center p-6 px-8">
      {/* 1. Logo */}
      <div className="flex items-center gap-4">
        <span>2026</span>

        {/* 2. Navigation (gauche)*/}
        <nav className="flex items-center gap-6">
          <a
            href="https://rudy-maire.fr/"
            target="_blank"
            rel="noopener"
            className="text-gray-300 hover:text-white text-sm font-medium transition"
          >
            Mon portfolio
          </a>
          <a
            href="https://github.com/Christo-fr/my-collection"
            target="_blank"
            rel="noopener"
            className="text-gray-300 hover:text-white text-sm font-medium transition"
          >
            Mon lien github
          </a>
        </nav>
      </div>
    </footer>
  );
}
