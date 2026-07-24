import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 85, 90, 100], // Déclare ici les valeurs autorisées
  },
};

export default nextConfig;
