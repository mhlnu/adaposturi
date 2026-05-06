"use client";

import { CAPACITY_RANGES, STATUS, TYPES } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clsx } from "clsx";
import { Filter } from "lucide-react";

interface FiltersProps {
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

const ALL_VALUE = "Toate";

const TYPE_OPTIONS = [
    { label: "Public", value: "public" },
    { label: "Privat", value: "private" },
] as const;

const toArrayValue = (value: string | string[] | null) => {
    if (!value) return [];

    return Array.isArray(value) ? value : [value];
};

const renderMultiValue = (values: string[], labels: Record<string, string>, placeholder: string) => {
    if (values.length === 0) return placeholder;

    const firstLabel = labels[values[0]] ?? values[0];
    const additionalCount = values.length - 1;

    if (additionalCount === 0) return firstLabel;

    return `${firstLabel} (+${additionalCount})`;
};

const CAPACITY_LABELS = Object.fromEntries(CAPACITY_RANGES.map(range => [range.label, range.label]));

const STATUS_LABELS = Object.fromEntries(
    STATUS.filter(status => status.value !== "all").map(status => [status.value, status.label])
);

export default function Filters({
    counties,
    towns,
    selectedCounty,
    selectedTowns,
    selectedTypes,
    selectedCapacities,
    selectedStatuses,
    onCountyChange,
    onTownChange,
    onTypeChange,
    onCapacityChange,
    onStatusChange,
}: FiltersProps) {
    const selectedCountyLabel = counties.find(county => county.value === selectedCounty)?.label ?? selectedCounty;

    const selectedTownValue =
        selectedTowns.length === towns.length || selectedTowns.length === 0 ? ALL_VALUE : selectedTowns[0];

    const selectedTypeValue =
        selectedTypes.length === TYPES.length || selectedTypes.length === 0
            ? ALL_VALUE
            : (TYPE_OPTIONS.find(type => type.value === selectedTypes[0])?.label ?? ALL_VALUE);

    const handleCountyChange = (label: string | null) => {
        if (!label) return;

        const county = counties.find(item => item.label === label);

        if (!county) return;

        onCountyChange(county.value);
    };

    const handleTownChange = (town: string | null) => {
        if (!town || town === ALL_VALUE) {
            onTownChange([]);
            return;
        }

        onTownChange([town]);
    };

    const handleTypeChange = (label: string | null) => {
        if (!label || label === ALL_VALUE) {
            onTypeChange([...TYPES]);
            return;
        }

        const type = TYPE_OPTIONS.find(item => item.label === label);

        if (!type) return;

        onTypeChange([type.value]);
    };

    const handleCapacityChange = (value: string | string[] | null) => {
        const values = toArrayValue(value).filter(item => item !== ALL_VALUE);

        onCapacityChange(values);
    };

    const handleStatusChange = (value: string | string[] | null) => {
        const values = toArrayValue(value).filter(item => item !== "all");

        onStatusChange(values);
    };

    return (
        <div className="mb-8 flex flex-row flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-md">
            <div className="bg-primary flex h-9 w-10 items-center justify-center rounded-md text-white">
                <Filter size={16} />
            </div>

            <div className="flex max-w-[160px] flex-1 flex-col gap-2">
                <Select value={selectedCountyLabel} onValueChange={handleCountyChange}>
                    <SelectTrigger
                        className={clsx("w-full", selectedCountyLabel?.length > 0 && "bg-(--primary) text-white")}
                    >
                        <SelectValue placeholder="Alege județul" />
                    </SelectTrigger>

                    <SelectContent>
                        {counties.map(county => (
                            <SelectItem key={county.value} value={county.label}>
                                {county.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex max-w-[160px] flex-1 flex-col gap-2">
                <Select value={selectedTownValue} onValueChange={handleTownChange}>
                    <SelectTrigger
                        className={clsx("w-full", selectedTownValue !== ALL_VALUE && "bg-(--primary) text-white")}
                    >
                        <SelectValue placeholder="Alege localitatea">
                            {selectedTownValue === ALL_VALUE ? "Toate localitățile" : selectedTownValue}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={ALL_VALUE}>Toate localitățile</SelectItem>

                        {towns.map(town => (
                            <SelectItem key={town} value={town}>
                                {town}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex max-w-[160px] flex-1 flex-col gap-2">
                <Select value={selectedTypeValue} onValueChange={handleTypeChange}>
                    <SelectTrigger
                        className={clsx("w-full", selectedTypeValue !== ALL_VALUE && "bg-(--primary) text-white")}
                    >
                        <SelectValue placeholder="Alege tipul">
                            {selectedTypeValue === ALL_VALUE ? "Public și privat" : selectedTypeValue}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={ALL_VALUE}>Public și privat</SelectItem>

                        {TYPE_OPTIONS.map(type => (
                            <SelectItem key={type.value} value={type.label}>
                                <span className="flex items-center gap-2">
                                    <span
                                        className={`inline-block h-3 w-3 rounded-full ${
                                            type.value === "public" ? "bg-[#0088ff]" : "bg-black"
                                        }`}
                                    />
                                    {type.label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex max-w-[160px] flex-1 flex-col gap-2">
                <Select multiple value={selectedCapacities} onValueChange={handleCapacityChange}>
                    <SelectTrigger
                        className={clsx("w-full", selectedCapacities.length > 0 && "bg-(--primary) text-white")}
                    >
                        <SelectValue placeholder="Alege capacitatea">
                            {() => renderMultiValue(selectedCapacities, CAPACITY_LABELS, "Capacitate")}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {CAPACITY_RANGES.filter(range => range.label !== ALL_VALUE).map(range => (
                            <SelectItem key={range.label} value={range.label}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex max-w-[190px] flex-1 flex-col gap-2">
                <Select multiple value={selectedStatuses} onValueChange={handleStatusChange}>
                    <SelectTrigger
                        className={clsx("w-full", selectedStatuses.length > 0 && "bg-(--primary) text-white")}
                    >
                        <SelectValue placeholder="Alege starea">
                            {() => renderMultiValue(selectedStatuses, STATUS_LABELS, "Stare")}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {STATUS.filter(status => status.value !== "all").map(status => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
