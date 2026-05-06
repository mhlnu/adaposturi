import { NextRequest, NextResponse } from "next/server";
import sheltersData from "@/data/allShelters.json";
import type { Shelter } from "@/lib/types";

interface ShelterLocation {
    id: string;
    name: string;
    center: {
        lat: number;
        lon: number;
    };
    items: Shelter[];
}

type CountySummary = Omit<ShelterLocation, "items">;

const sortByName = <T extends { name: string }>(items: T[]) => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name, "ro"));
};

const locations = sheltersData as ShelterLocation[];

const getCounties = (): CountySummary[] => {
    return sortByName(locations.map(({ items: _items, ...county }) => county));
};

const getCountyById = (countyId: string): ShelterLocation | null => {
    return locations.find(location => location.id === countyId) ?? null;
};

export const GET = (request: NextRequest) => {
    const county = request.nextUrl.searchParams.get("county");

    if (county) {
        const location = getCountyById(county);

        if (!location) {
            return NextResponse.json(
                {
                    message: `County "${county}" was not found.`,
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(location);
    }

    return NextResponse.json(getCounties());
};
