import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative lg:absolute bottom-0 right-0 w-full z-10 flex justify-end items-center ">
      <div className="flex items-center p-4 px-6 gap-4 border-t bg-gradient-to-r from-transparent to-background to-60%">
        <div className="flex items-center">
          <span className="text-main text-sm font-medium pr-2">2026</span>
          {/* --- LIEN PORTFOLIO --- */}
          <a
            href="https://rudy-maire.fr/"
            target="_blank"
            rel="noopener"
            className="text-main hover:text-hover text-sm font-medium transition"
          >
            R.Maire
          </a>
        </div>
        {/* --- LIEN GITHUB --- */}
        <a
          href="https://github.com/Christo-fr/my-collection"
          target="_blank"
          rel="noopener"
          aria-label="Mon GitHub"
          className="opacity-70 hover:opacity-100 transition"
        >
          <img
            src="icons/github.svg"
            alt="Mon GitHub"
            className="w-6 h-6 inline-block mr-1 dark:invert"
          />
        </a>
      </div>
    </footer>
  );
}
