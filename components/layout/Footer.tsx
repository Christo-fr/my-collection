import Link from "next/link";
import Image from "next/image";

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
          <Image
            src="/icons/github.svg"
            alt="Mon GitHub"
            width={24}
            height={24}
            className="inline-block mr-1 dark:invert"
          />
        </a>
      </div>
    </footer>
  );
}
