import SheltersApp from "@/components/SheltersApp";
import sheltersData from "@/data/allShelters.json";
import type { ShelterLocation, CountySummary, HomeProps } from "@/lib/types";
import { defaultLocation } from "@/lib/types";

const getCounties = (): CountySummary[] => {
    const locations = sheltersData as ShelterLocation[];

    return locations.map(({ items: _items, ...county }) => county).sort((a, b) => a.name.localeCompare(b.name, "ro"));
};

const getCounty = (countyId: string): ShelterLocation => {
    const locations = sheltersData as ShelterLocation[];

    return (
        locations.find(location => location.id === countyId) ??
        locations.find(location => location.id === defaultLocation) ??
        locations[0]
    );
};

export default async function Home({ searchParams }: HomeProps) {
    const params = await searchParams;
    const selectedCounty = params.county ?? defaultLocation;

    const counties = getCounties();
    const initialCounty = getCounty(selectedCounty);

    return <SheltersApp counties={counties} initialCounty={initialCounty} selectedCounty={initialCounty.id} />;
}
