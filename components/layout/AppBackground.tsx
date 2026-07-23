import Image from "next/image";

export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-20 opacity-30 pointer-events-none">
      <Image
        src="/background/bg-modelight.webp"
        alt="Background"
        className="object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
        fill
      />
      <Image
        src="/background/bg-modedark.webp"
        alt="Background"
        className="object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
        fill
      />
    </div>
  );
}
