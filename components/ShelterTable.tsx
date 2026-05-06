"use client";

import { useMemo, useState } from "react";
import { Shelter } from "@/lib/types";

interface ShelterTableProps {
    shelters: Shelter[];
}

type SortField = "town" | "capacity" | "status" | null;
type SortDirection = "asc" | "desc";

const statusLabels: Record<string, string> = {
    green: "Funcțional",
    orange: "Parțial funcțional",
    red: "Nefuncțional",
};

const statusClasses: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
    red: "bg-red-100 text-red-800",
};

const statusDotClasses: Record<string, string> = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
};

const normalizeType = (type: string) => {
    if (type === "privat") return "private";

    return type;
};

const SortIcon = ({
    field,
    sortField,
    sortDirection,
}: {
    field: Exclude<SortField, null>;
    sortField: SortField;
    sortDirection: SortDirection;
}) => {
    if (sortField !== field) {
        return (
            <svg
                className="ml-1 inline h-4 w-4 text-[var(--muted-foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
            </svg>
        );
    }

    return sortDirection === "asc" ? (
        <svg className="ml-1 inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
    ) : (
        <svg className="ml-1 inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
};

export default function ShelterTable({ shelters }: ShelterTableProps) {
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const handleSort = (field: Exclude<SortField, null>) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            return;
        }

        setSortField(field);
        setSortDirection("asc");
    };

    const sortedShelters = useMemo(() => {
        if (!sortField) return shelters;

        return [...shelters].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            let result = 0;

            if (typeof aValue === "number" && typeof bValue === "number") {
                result = aValue - bValue;
            } else {
                result = String(aValue ?? "").localeCompare(String(bValue ?? ""), "ro");
            }

            return sortDirection === "asc" ? result : -result;
        });
    }, [shelters, sortField, sortDirection]);

    return (
        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
                        <tr>
                            <th
                                className="cursor-pointer px-4 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--border)]"
                                onClick={() => handleSort("town")}
                            >
                                Loc.
                                <SortIcon field="town" sortField={sortField} sortDirection={sortDirection} />
                            </th>

                            <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Adresă</th>

                            <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Tip</th>

                            <th
                                className="cursor-pointer px-4 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--border)]"
                                onClick={() => handleSort("status")}
                            >
                                Stare
                                <SortIcon field="status" sortField={sortField} sortDirection={sortDirection} />
                            </th>

                            <th
                                className="cursor-pointer px-4 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--border)]"
                                onClick={() => handleSort("capacity")}
                            >
                                Cap.
                                <SortIcon field="capacity" sortField={sortField} sortDirection={sortDirection} />
                            </th>

                            <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Geo</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border)]">
                        {sortedShelters.map(shelter => {
                            const type = normalizeType(shelter.type);
                            const statusLabel = statusLabels[shelter.status] ?? shelter.status ?? "-";

                            return (
                                <tr
                                    key={`${shelter.county}-${shelter.id}-${shelter.index}`}
                                    className="bg-[var(--background)] hover:bg-[var(--muted)]"
                                >
                                    <td className="px-4 py-3 text-[var(--foreground)]">{shelter.town}</td>

                                    <td className="max-w-xs truncate px-4 py-3 text-[var(--foreground)]">
                                        {shelter.address}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                type === "public"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    type === "public" ? "bg-[#0088ff]" : "bg-black"
                                                }`}
                                            />
                                            {type === "public" ? "Public" : "Privat"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                statusClasses[shelter.status] ?? "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    statusDotClasses[shelter.status] ?? "bg-gray-500"
                                                }`}
                                            />
                                            {statusLabel}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-[var(--foreground)]">{shelter.capacity ?? "-"}</td>

                                    <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                                        {Number.isFinite(shelter.lat) && Number.isFinite(shelter.lon)
                                            ? `${shelter.lat.toFixed(6)}, ${shelter.lon.toFixed(6)}`
                                            : "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {sortedShelters.length === 0 && (
                <div className="py-8 text-center text-[var(--muted-foreground)]">
                    Nu au fost găsite adăposturi cu filtrele selectate.
                </div>
            )}
        </div>
    );
}
