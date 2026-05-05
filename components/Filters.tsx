"use client";

import { SECTORS, TYPES, CAPACITY_RANGES } from "@/lib/types";

interface FiltersProps {
  selectedSectors: number[];
  selectedTypes: string[];
  selectedCapacity: string;
  onSectorChange: (sectors: number[]) => void;
  onTypeChange: (types: string[]) => void;
  onCapacityChange: (capacity: string) => void;
}

export default function Filters({
  selectedSectors,
  selectedTypes,
  selectedCapacity,
  onSectorChange,
  onTypeChange,
  onCapacityChange,
}: FiltersProps) {
  const toggleSector = (sector: number) => {
    if (selectedSectors.includes(sector)) {
      onSectorChange(selectedSectors.filter((s) => s !== sector));
    } else {
      onSectorChange([...selectedSectors, sector]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const selectAllSectors = () => {
    onSectorChange([...SECTORS]);
  };

  const clearSectors = () => {
    onSectorChange([]);
  };

  const selectAllTypes = () => {
    onTypeChange([...TYPES]);
  };

  const clearTypes = () => {
    onTypeChange([]);
  };

  return (
    <div className="space-y-4 rounded-lg border border-(--border) bg-(--background) p-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-(--foreground)">Sector</h3>
          <div className="flex gap-2">
            <button
              onClick={selectAllSectors}
              className="text-xs text-(--muted-foreground) hover:text-(--foreground)"
            >
              Toate
            </button>
            <span className="text-(--muted-foreground)">|</span>
            <button
              onClick={clearSectors}
              className="text-xs text-(--muted-foreground) hover:text-(--foreground)"
            >
              Niciunul
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => toggleSector(sector)}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${selectedSectors.includes(sector)
                ? "bg-(--primary) text-(--primary-foreground)"
                : "bg-(--muted) text-(--muted-foreground) hover:bg-(--border)"
                }`}
            >
              Sector {sector}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-(--foreground)">Tip</h3>
          <div className="flex gap-2">
            <button
              onClick={selectAllTypes}
              className="text-xs text-(--muted-foreground) hover:text-(--foreground)"
            >
              Toate
            </button>
            <span className="text-(--muted-foreground)">|</span>
            <button
              onClick={clearTypes}
              className="text-xs text-(--muted-foreground) hover:text-(--foreground)"
            >
              Niciunul
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`flex items-center gap-2 rounded-md px-3 py-1 text-sm capitalize transition-colors ${selectedTypes.includes(type)
                ? "bg-(--primary) text-(--primary-foreground)"
                : "bg-(--muted) text-(--muted-foreground) hover:bg-(--border)"
                }`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-full ${type === "public" ? "bg-green-500" : "bg-black"
                  }`}
              />
              {type === "public" ? "Public" : "Privat"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-(--foreground)">
          Capacitate
        </h3>
        <select
          value={selectedCapacity}
          onChange={(e) => onCapacityChange(e.target.value)}
          className="w-full rounded-md border border-(--border) bg-(--background) px-3 py-2 text-sm text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--primary)"
        >
          {CAPACITY_RANGES.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
