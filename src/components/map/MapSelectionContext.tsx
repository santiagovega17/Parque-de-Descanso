"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getParcelById, getParcelLabel } from "@/lib/map/parcels";
import type { Parcel } from "@/lib/map/types";

type MapSelectionContextValue = {
  selectedParcel: Parcel | null;
  selectedParcelLabel: string | null;
  selectParcel: (parcelId: string) => void;
  clearSelection: () => void;
};

const MapSelectionContext = createContext<MapSelectionContextValue | null>(null);

export function MapSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  const selectedParcel = useMemo(
    () => (selectedParcelId ? (getParcelById(selectedParcelId) ?? null) : null),
    [selectedParcelId],
  );

  const selectedParcelLabel = useMemo(
    () => (selectedParcel ? getParcelLabel(selectedParcel) : null),
    [selectedParcel],
  );

  const selectParcel = useCallback((parcelId: string) => {
    setSelectedParcelId(parcelId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedParcelId(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedParcel,
      selectedParcelLabel,
      selectParcel,
      clearSelection,
    }),
    [selectedParcel, selectedParcelLabel, selectParcel, clearSelection],
  );

  return (
    <MapSelectionContext.Provider value={value}>
      {children}
    </MapSelectionContext.Provider>
  );
}

export function useMapSelection() {
  const context = useContext(MapSelectionContext);

  if (!context) {
    throw new Error("useMapSelection debe usarse dentro de MapSelectionProvider");
  }

  return context;
}
