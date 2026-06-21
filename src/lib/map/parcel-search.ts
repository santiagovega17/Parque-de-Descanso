export type ParcelSearchEntry = {
  name: string;
  parcelId: string;
};

export const PARCEL_SEARCH_ENTRIES: ParcelSearchEntry[] = [
  { name: "Juan Pérez", parcelId: "sector-16-12" },
  { name: "María García", parcelId: "sector-20-12" },
  { name: "Carlos López", parcelId: "sector-14-12" },
];

export function filterParcelSearch(query: string): ParcelSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return PARCEL_SEARCH_ENTRIES;
  }

  return PARCEL_SEARCH_ENTRIES.filter((entry) =>
    entry.name.toLowerCase().includes(q),
  );
}
