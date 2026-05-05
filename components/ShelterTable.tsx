"use client";

import { useState, useMemo } from "react";
import { Shelter } from "@/lib/types";

interface ShelterTableProps {
  shelters: Shelter[];
}

type SortField = "sector" | "capacity" | null;
type SortDirection = "asc" | "desc";

export default function ShelterTable({ shelters }: ShelterTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedShelters = useMemo(() => {
    if (!sortField) return shelters;

    return [...shelters].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [shelters, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
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
      <svg
        className="ml-1 inline h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="ml-1 inline h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
            <tr>
              <th
                className="cursor-pointer px-4 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--border)]"
                onClick={() => handleSort("sector")}
              >
                Sector
                <SortIcon field="sector" />
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Adresă
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Tip
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--border)]"
                onClick={() => handleSort("capacity")}
              >
                Capacitate
                <SortIcon field="capacity" />
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Coordonate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sortedShelters.map((shelter) => (
              <tr
                key={shelter.id}
                className="bg-[var(--background)] hover:bg-[var(--muted)]"
              >
                <td className="px-4 py-3 text-[var(--foreground)]">
                  {shelter.sector}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-[var(--foreground)]">
                  {shelter.address}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                      shelter.type === "public"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        shelter.type === "public" ? "bg-green-500" : "bg-black"
                      }`}
                    />
                    {shelter.type === "public" ? "Public" : "Privat"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]">
                  {shelter.capacity}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                  {shelter.lat.toFixed(6)}, {shelter.lon.toFixed(6)}
                </td>
              </tr>
            ))}
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
