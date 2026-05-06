"use client";

import { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CAPACITY_RANGES, TYPES, SheltersAppProps, ViewMode } from "@/lib/types";
import { formatRoNumber, normalizeType } from "@/lib/utils";
import Filters from "@/components/Filters";
import ShelterTable from "@/components/ShelterTable";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center rounded-lg bg-(--muted)">
            <div className="text-(--muted-foreground)">Se încarcă harta...</div>
        </div>
    ),
});

export default function SheltersApp({ counties, initialCounty, selectedCounty }: SheltersAppProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [_isPending, startTransition] = useTransition();

    const [viewMode, setViewMode] = useState<ViewMode>("map");
    const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([...TYPES]);
    const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const currentLocation = initialCounty;

    const towns = useMemo(() => {
        return Array.from(
            new Set(
                currentLocation.items
                    .map(shelter => shelter.town)
                    .filter(Boolean)
                    .sort((a, b) => a.localeCompare(b, "ro"))
            )
        );
    }, [currentLocation]);

    const selectedTownValues = selectedTowns.length === 0 ? towns : selectedTowns;

    const handleCountyChange = (county: string) => {
        setSelectedTowns([]);
        setSelectedTypes([...TYPES]);
        setSelectedCapacities([]);
        setSelectedStatuses([]);

        const params = new URLSearchParams(searchParams.toString());

        params.set("county", county);

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const filteredShelters = useMemo(() => {
        const capacityRanges = selectedCapacities
            .map(capacity => CAPACITY_RANGES.find(range => range.label === capacity))
            .filter(Boolean);

        return currentLocation.items.filter(shelter => {
            const townMatch = selectedTownValues.length === 0 || selectedTownValues.includes(shelter.town);

            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(normalizeType(shelter.type));

            const capacityMatch =
                capacityRanges.length === 0 ||
                capacityRanges.some(range => range && shelter.capacity >= range.min && shelter.capacity <= range.max);

            const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(shelter.status);

            return townMatch && typeMatch && capacityMatch && statusMatch;
        });
    }, [currentLocation, selectedTownValues, selectedTypes, selectedCapacities, selectedStatuses]);

    const totalCapacity = useMemo(() => {
        return filteredShelters.reduce((total, shelter) => total + shelter.capacity, 0);
    }, [filteredShelters]);

    return (
        <div className="flex min-h-screen justify-center bg-stone-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-center text-4xl leading-tight font-bold text-black">
                    Adăposturi protecție civilă
                </h1>

                <Filters
                    counties={counties.map(county => ({
                        label: county.name,
                        value: county.id,
                    }))}
                    towns={towns}
                    selectedCounty={selectedCounty}
                    selectedTowns={selectedTowns}
                    selectedTypes={selectedTypes}
                    selectedCapacities={selectedCapacities}
                    selectedStatuses={selectedStatuses}
                    onCountyChange={handleCountyChange}
                    onTownChange={setSelectedTowns}
                    onTypeChange={setSelectedTypes}
                    onCapacityChange={setSelectedCapacities}
                    onStatusChange={setSelectedStatuses}
                />

                <div className="mb-4 flex flex-col rounded-2xl border border-stone-200 bg-white p-4 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("map")}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    viewMode === "map"
                                        ? "bg-(--primary) text-(--primary-foreground)"
                                        : "bg-(--muted) hover:bg-(--border)"
                                }`}
                            >
                                Hartă
                            </button>

                            <button
                                onClick={() => setViewMode("table")}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    viewMode === "table"
                                        ? "bg-(--primary) text-(--primary-foreground)"
                                        : "bg-(--muted) hover:bg-(--border)"
                                }`}
                            >
                                Tabel
                            </button>
                        </div>

                        <div className="text-sm">
                            <strong>{formatRoNumber(filteredShelters.length)}</strong> adăposturi,{" "}
                            <strong>{formatRoNumber(totalCapacity)}</strong> locuri
                        </div>
                    </div>

                    {viewMode === "map" ? (
                        <div className="z-10 h-[500px] overflow-hidden rounded-xl border border-(--border) lg:h-[600px]">
                            <MapComponent
                                center={{
                                    lat: currentLocation.center.lat,
                                    lon: currentLocation.center.lon,
                                }}
                                shelters={filteredShelters}
                            />
                        </div>
                    ) : (
                        <ShelterTable shelters={filteredShelters} />
                    )}
                </div>
            </div>
        </div>
    );
}
