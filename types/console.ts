export interface Console {
  id: number;
  short_name: string;
  full_name?: string;
  logo_url?: string;
  is_bw: boolean;
  display_order: number;
  logo_file?: File;
}
