"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Shelter, MapComponentProps, MapCenterUpdaterProps } from "@/lib/types";
import { getStatusColor, getTypeColor, createGoogleMapsPlaceLink } from "@/lib/utils";
import { Copy, MapIcon, MapPinned } from "lucide-react";

const shelterIconCache = new Map<string, L.DivIcon>();

const createShelterIcon = (shelter: Shelter) => {
    const pinColor = getStatusColor(shelter.status);
    const circleColor = getTypeColor(shelter.type);
    const cacheKey = `${pinColor}-${circleColor}`;

    const cachedIcon = shelterIconCache.get(cacheKey);

    if (cachedIcon) return cachedIcon;

    const icon = L.divIcon({
        className: "shelter-marker",
        html: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="${pinColor}"
        stroke="black"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        />
        <circle
          cx="12"
          cy="10"
          r="3"
          fill="${circleColor}"
          stroke="black"
        />
      </svg>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        popupAnchor: [0, -28],
    });

    shelterIconCache.set(cacheKey, icon);

    return icon;
};

const MapCenterUpdater = ({ center, zoom = 12 }: MapCenterUpdaterProps) => {
    const map = useMap();

    useEffect(() => {
        map.setView([center.lat, center.lon], zoom);
    }, [center.lat, center.lon, map, zoom]);

    return null;
};

export default function MapComponent({ shelters, center }: MapComponentProps) {
    useEffect(() => {
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    }, []);

    const mapCenter = useMemo<[number, number]>(() => {
        return [center.lat, center.lon];
    }, [center.lat, center.lon]);

    const validShelters = useMemo(() => {
        return shelters.filter(shelter => Number.isFinite(shelter.lat) && Number.isFinite(shelter.lon));
    }, [shelters]);

    return (
        <MapContainer center={mapCenter} zoom={12} className="h-full w-full rounded-lg" scrollWheelZoom={true}>
            <MapCenterUpdater center={center} zoom={12} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {validShelters.map(shelter => {
                const addressUrl = createGoogleMapsPlaceLink(shelter.address);
                const coordsUrl = createGoogleMapsPlaceLink(`${shelter.lat}, ${shelter.lon}`);
                return (
                    <Marker
                        key={`${shelter.county}-${shelter.id}-${shelter.index}`}
                        position={[shelter.lat, shelter.lon]}
                        icon={createShelterIcon(shelter)}
                    >
                        <Popup>
                            <div className="space-y-1">
                                <p className="text-lg leading-tight font-semibold">
                                    <strong>{shelter.capacity}</strong> persoane,{" "}
                                    {shelter.type === "public" ? "public" : "privat"},{" "}
                                    {shelter.status === "green" ? (
                                        <span className="text-green-600">funcțional</span>
                                    ) : shelter.status === "orange" ? (
                                        <span className="text-orange-500">parțial funcțional</span>
                                    ) : (
                                        <span className="text-red-500">nefuncțional</span>
                                    )}
                                </p>
                                <p className="text-[1rem]">
                                    <span className="mb-2 inline-flex w-full items-center justify-between gap-2">
                                        <strong>Adresă:</strong>
                                        {shelter.address && (
                                            <div className="flex items-center justify-end gap-4">
                                                <a href={addressUrl} target="_blank" rel="noopener noreferrer">
                                                    <MapIcon className="inline-block h-5 w-5" />
                                                </a>
                                                <Copy
                                                    className="inline-block h-5 w-5"
                                                    onClick={() => navigator.clipboard.writeText(shelter.address)}
                                                />
                                            </div>
                                        )}
                                    </span>
                                    <br />
                                    {shelter.address},<br />
                                    {shelter.town}
                                </p>

                                <p className="text-[1rem]">
                                    <span className="mb-2 inline-flex w-full items-center justify-between gap-2">
                                        <strong>Coordonate:</strong>
                                        {shelter.lat && shelter.lon && (
                                            <div className="flex items-center justify-end gap-4">
                                                <a href={coordsUrl} target="_blank" rel="noopener noreferrer">
                                                    <MapPinned className="inline-block h-5 w-5" />
                                                </a>
                                                <Copy
                                                    className="inline-block h-5 w-5"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(`${shelter.lat}, ${shelter.lon}`)
                                                    }
                                                />
                                            </div>
                                        )}
                                    </span>
                                    <span className="font-mono">
                                        {shelter.lat}, {shelter.lon}
                                    </span>
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
