"use client";

import { useMapSelection } from "./MapSelectionContext";

export function ParcelSelectionPanel() {
  const { selectedParcel, selectedParcelLabel, clearSelection } = useMapSelection();

  if (!selectedParcel || !selectedParcelLabel) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1000] flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-center gap-4 rounded-2xl border border-emerald-900/10 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/70">
            Parcela seleccionada
          </p>
          <p className="truncate text-lg font-semibold text-emerald-950">
            {selectedParcelLabel}
          </p>
          <p className="mt-1 text-sm text-emerald-800/80">
            Camino desde la entrada hasta la parcela
          </p>
        </div>
        <button
          type="button"
          className="map-control-btn shrink-0 rounded-xl border border-emerald-900/10 px-3 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
          onClick={clearSelection}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
