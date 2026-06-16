"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PasilloIntersection } from "@/lib/map/pasillo-config";
import { getPasilloById } from "@/lib/map/pasillos";
import { getParcelById, getParcelLabel, getSectorName } from "@/lib/map/parcels";
import type { Parcel } from "@/lib/map/types";
import { useHelpRequest } from "./HelpRequestContext";

type MapSelectionContextValue = {
  selectedParcel: Parcel | null;
  selectedParcelLabel: string | null;
  selectedSectorName: string | null;
  selectedPasillo: PasilloIntersection | null;
  selectedPasilloLabel: string | null;
  selectParcel: (parcelId: string) => void;
  selectPasillo: (pasilloId: string) => void;
  clearSelection: () => void;
};

const MapSelectionContext = createContext<MapSelectionContextValue | null>(null);

export function MapSelectionProvider({ children }: { children: ReactNode }) {
  const { closeHelp } = useHelpRequest();
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedPasilloId, setSelectedPasilloId] = useState<string | null>(null);

  const selectedParcel = useMemo(
    () => (selectedParcelId ? (getParcelById(selectedParcelId) ?? null) : null),
    [selectedParcelId],
  );

  const selectedPasillo = useMemo(
    () => (selectedPasilloId ? (getPasilloById(selectedPasilloId) ?? null) : null),
    [selectedPasilloId],
  );

  const selectedParcelLabel = useMemo(
    () => (selectedParcel ? getParcelLabel(selectedParcel) : null),
    [selectedParcel],
  );

  const selectedSectorName = useMemo(
    () => (selectedParcel ? getSectorName(selectedParcel) : null),
    [selectedParcel],
  );

  const selectedPasilloLabel = useMemo(
    () => selectedPasillo?.label ?? null,
    [selectedPasillo],
  );

  const selectParcel = useCallback(
    (parcelId: string) => {
      closeHelp();
      setSelectedParcelId(parcelId);
      setSelectedPasilloId(null);
    },
    [closeHelp],
  );

  const selectPasillo = useCallback(
    (pasilloId: string) => {
      closeHelp();
      setSelectedPasilloId(pasilloId);
      setSelectedParcelId(null);
    },
    [closeHelp],
  );

  const clearSelection = useCallback(() => {
    setSelectedParcelId(null);
    setSelectedPasilloId(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedParcel,
      selectedParcelLabel,
      selectedSectorName,
      selectedPasillo,
      selectedPasilloLabel,
      selectParcel,
      selectPasillo,
      clearSelection,
    }),
    [
      selectedParcel,
      selectedParcelLabel,
      selectedSectorName,
      selectedPasillo,
      selectedPasilloLabel,
      selectParcel,
      selectPasillo,
      clearSelection,
    ],
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
