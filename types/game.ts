export interface GameReview {
  playtime?: number;
  completedDate?: string;
  score?: number;
  pros?: string[];
  cons?: string[];
  summary?: string;
}

export interface ParallaxImage {
  url: string;
  truncated?: boolean;
}

export interface GameImages {
  cover: string;
  logo: string;
  parallax: ParallaxImage;
}

export interface Game {
  id: number;
  title: string;
  franchise?: string;
  console: string;
  format: "Physical" | "Digital";
  developer: string;
  genre: string;
  pegi: number;
  language: string;
  releaseDate: string;
  estimatedPlaytime: number;
  description: string;
  youtubeId: string;
  images: GameImages;
  review?: GameReview | null; // Peut être indéfini ou null
}
