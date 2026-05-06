import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const decimalToDms = (decimal: number, type: "lat" | "lng"): string => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(1);

    const direction = type === "lat" ? (decimal >= 0 ? "N" : "S") : decimal >= 0 ? "E" : "W";

    return `${degrees}°${minutes}'${seconds}"${direction}`;
};

export const createGoogleMapsPlaceLink = (query: string) => {
    const trimmedQuery = query.trim();

    const coordsMatch = trimmedQuery.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);

    if (coordsMatch) {
        const lat = Number(coordsMatch[1]);
        const lng = Number(coordsMatch[2]);

        const dmsQuery = `${decimalToDms(lat, "lat")} ${decimalToDms(lng, "lng")}`;

        return `https://www.google.com/maps/place/${encodeURIComponent(dmsQuery).replace(/%20/g, "+")}/`;
    }

    return `https://www.google.com/maps/place/${encodeURIComponent(trimmedQuery).replace(/%20/g, "+")}/`;
};

export const getStatusColor = (status?: string) => {
    switch (status) {
        case "green":
            return "#22c55e";
        case "orange":
            return "#f9b916";
        case "red":
            return "#e80000";
        default:
            return "#6b7280";
    }
};

export const getTypeColor = (type?: string) => {
    if (type === "public") return "#47c5ff";

    return "#000000";
};

export const toArrayValue = (value: string | string[] | null) => {
    if (!value) return [];

    return Array.isArray(value) ? value : [value];
};

export const renderMultiValue = (values: string[], labels: Record<string, string>, placeholder: string) => {
    if (values.length === 0) return placeholder;

    const firstLabel = labels[values[0]] ?? values[0];
    const additionalCount = values.length - 1;

    if (additionalCount === 0) return firstLabel;

    return `${firstLabel} (+${additionalCount})`;
};

export const normalizeType = (type: string) => {
    if (type === "privat") return "private";

    return type;
};

export const formatRoNumber = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
