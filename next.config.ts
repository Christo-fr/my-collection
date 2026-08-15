import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [80, 85, 90, 100], // Déclare ici les valeurs autorisées
    minimumCacheTTL: 2678400, // Cache les jaquettes optimisées 31 jours (images statiques)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utunmvfelyhkgtcepnli.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
