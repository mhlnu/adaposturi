"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Shelter } from "@/lib/types";

// Fix for default marker icons in Leaflet with Next.js
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blackIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  shelters: Shelter[];
}

export default function MapComponent({ shelters }: MapComponentProps) {
  useEffect(() => {
    // Fix leaflet icons
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
      ._getIconUrl;
  }, []);

  // Bucharest center coordinates
  const bucharestCenter: [number, number] = [44.4268, 26.1025];

  return (
    <MapContainer
      center={bucharestCenter}
      zoom={12}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.lat, shelter.lon]}
          icon={shelter.type === "public" ? greenIcon : blackIcon}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Capacitate:</strong> {shelter.capacity}
              </p>
              <p>
                <strong>Adresă:</strong> {shelter.address}
              </p>
              <p>
                <strong>Sector:</strong> {shelter.sector}
              </p>
              <p>
                <strong>Tip:</strong> {shelter.type}
              </p>
              <p>
                <strong>Coordonate:</strong> {shelter.lat}, {shelter.lon}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
