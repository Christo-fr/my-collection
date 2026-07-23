import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative md:absolute bottom-0 right-0 w-full z-10 flex justify-end items-center ">
      {/* Menu footer */}
      <div className="flex items-center p-4 px-6 gap-4 border-t bg-gradient-to-r from-transparent to-black to-60%">
        <div className="flex items-center">
          <span className="text-gray-300 text-sm pr-2">2026</span>
          <a
            href="https://rudy-maire.fr/"
            target="_blank"
            rel="noopener"
            className="text-gray-300 hover:text-white text-sm font-medium transition"
          >
            R.Maire
          </a>
        </div>
        <a
          href="https://github.com/Christo-fr/my-collection"
          target="_blank"
          rel="noopener"
          aria-label="Mon GitHub"
          className="opacity-75 hover:opacity-100 text-sm font-medium transition"
        >
          <img
            src="icons/github.svg"
            alt="Mon GitHub"
            className="w-6 h-6 inline-block mr-1 invert"
          />
        </a>
      </div>
    </footer>
  );
}
