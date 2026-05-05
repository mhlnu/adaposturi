"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import sheltersData from "@/data/shelters.json";
import { Shelter, CAPACITY_RANGES, SECTORS, TYPES } from "@/lib/types";
import Filters from "@/components/Filters";
import ShelterTable from "@/components/ShelterTable";

// Dynamic import for Map component (to avoid SSR issues with Leaflet)
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-lg bg-(--muted)">
      <div className="text-(--muted-foreground)">Se încarcă harta...</div>
    </div>
  ),
});

type ViewMode = "map" | "table";

export default function SheltersApp() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [selectedSectors, setSelectedSectors] = useState<number[]>([
    ...SECTORS,
  ]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([...TYPES]);
  const [selectedCapacity, setSelectedCapacity] = useState<string>("Toate");

  const filteredShelters = useMemo(() => {
    const capacityRange = CAPACITY_RANGES.find(
      (r) => r.label === selectedCapacity
    );

    return (sheltersData as Shelter[]).filter((shelter) => {
      const sectorMatch =
        selectedSectors.length === 0 ||
        selectedSectors.includes(shelter.sector);
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(shelter.type);
      const capacityMatch =
        !capacityRange ||
        (shelter.capacity >= capacityRange.min &&
          shelter.capacity <= capacityRange.max);

      return sectorMatch && typeMatch && capacityMatch;
    });
  }, [selectedSectors, selectedTypes, selectedCapacity]);

  return (
    <div className="min-h-screen bg-(--background)">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-black md:text-5xl">
          Adăposturi București
        </h1>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("map")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-(--primary) text-(--primary-foreground)"
                  : "bg-(--muted) text-(--muted-foreground) hover:bg-(--border)"
              }`}
            >
              Hartă
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-(--primary) text-(--primary-foreground)"
                  : "bg-(--muted) text-(--muted-foreground) hover:bg-(--border)"
              }`}
            >
              Tabel
            </button>
          </div>
          <div className="text-sm text-(--muted-foreground)">
            {filteredShelters.length} adăposturi găsite
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="order-2 lg:order-1">
            <Filters
              selectedSectors={selectedSectors}
              selectedTypes={selectedTypes}
              selectedCapacity={selectedCapacity}
              onSectorChange={setSelectedSectors}
              onTypeChange={setSelectedTypes}
              onCapacityChange={setSelectedCapacity}
            />

            <div className="mt-4 rounded-lg border border-(--border) bg-(--background) p-4">
              <h3 className="mb-2 font-semibold text-(--foreground)">
                Legendă
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded-full bg-green-500" />
                  <span className="text-(--foreground)">Public</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded-full bg-black" />
                  <span className="text-(--foreground)">Privat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {viewMode === "map" ? (
              <div className="h-[500px] overflow-hidden rounded-lg border border-(--border) lg:h-[600px]">
                <MapComponent shelters={filteredShelters} />
              </div>
            ) : (
              <ShelterTable shelters={filteredShelters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
