// constants

export const defaultLocation = "B";
export const ALL_VALUE = "Toate";

export const TYPES = ["public", "private"] as const;
export const TYPE_OPTIONS = [
    { label: "Public", value: "public" },
    { label: "Privat", value: "private" },
] as const;

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
export const CAPACITY_LABELS = Object.fromEntries(CAPACITY_RANGES.map(range => [range.label, range.label]));

export const STATUS = [
    { label: "Toate", value: "all" },
    { label: "Funcțional", value: "green" },
    { label: "Parțial funcțional", value: "orange" },
    { label: "Nefuncțional", value: "red" },
];
export const STATUS_LABELS = Object.fromEntries(
    STATUS.filter(status => status.value !== "all").map(status => [status.value, status.label])
);

// types

export interface HomeProps {
    searchParams: {
        county?: string;
    };
}

export interface Shelter {
    id: number;
    county: string;
    town: string;
    address: string;
    type: "public" | "private" | "privat";
    lat: number;
    lon: number;
    capacity: number;
    status: string;
    index: number;
}

export interface ShelterLocation {
    id: string;
    name: string;
    center: {
        lat: number;
        lon: number;
    };
    items: Shelter[];
}

export interface SheltersAppProps {
    counties: CountySummary[];
    initialCounty: ShelterLocation;
    selectedCounty: string;
}

export type ViewMode = "map" | "table";

export interface MapComponentProps {
    shelters: Shelter[];
    center: {
        lat: number;
        lon: number;
    };
}

export interface MapCenterUpdaterProps {
    center: {
        lat: number;
        lon: number;
    };
    zoom?: number;
}

export interface FiltersProps {
    counties: {
        label: string;
        value: string;
    }[];
    towns: string[];
    selectedCounty: string;
    selectedTowns: string[];
    selectedTypes: string[];
    selectedCapacities: string[];
    selectedStatuses: string[];
    onCountyChange: (county: string) => void;
    onTownChange: (towns: string[]) => void;
    onTypeChange: (types: string[]) => void;
    onCapacityChange: (capacity: string[]) => void;
    onStatusChange: (status: string[]) => void;
}

export type CountySummary = Omit<ShelterLocation, "items">;
