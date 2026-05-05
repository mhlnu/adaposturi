export interface Shelter {
  id: number;
  sector: number;
  address: string;
  type: "public" | "private";
  lat: number;
  lon: number;
  capacity: number;
}

export const CAPACITY_RANGES = [
  { label: "Toate", min: 0, max: Infinity },
  { label: "1-50", min: 1, max: 50 },
  { label: "51-100", min: 51, max: 100 },
  { label: "101-150", min: 101, max: 150 },
  { label: "151-200", min: 151, max: 200 },
  { label: "201-250", min: 201, max: 250 },
  { label: "251-300", min: 251, max: 300 },
  { label: "301-350", min: 301, max: 350 },
  { label: "351-400", min: 351, max: 400 },
  { label: "400+", min: 401, max: Infinity },
];

export const SECTORS = [1, 2, 3, 4, 5, 6];
export const TYPES = ["public", "private"] as const;
