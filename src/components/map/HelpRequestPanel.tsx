"use client";

import { useHelpRequest } from "./HelpRequestContext";

export function HelpRequestPanel() {
  const { helpStep, confirmHelp, cancelHelp } = useHelpRequest();

  if (helpStep === "idle") {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1000] flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-center gap-4 rounded-2xl border border-emerald-900/10 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
        {helpStep === "confirm" ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/70">
                Pedir ayuda
              </p>
              <p className="text-lg font-semibold text-emerald-950">
                ¿Desea llamar a un administrativo?
              </p>
              <p className="mt-1 text-sm text-emerald-800/80">
                Un administrativo se acercará a su ubicación para asistirle.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                className="map-control-btn rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={confirmHelp}
              >
                Llamar
              </button>
              <button
                type="button"
                className="map-control-btn rounded-xl border border-emerald-900/10 px-3 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
                onClick={cancelHelp}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-red-700/70">
              Ayuda solicitada
            </p>
            <p className="text-lg font-semibold text-red-950">
              Se llamó a un administrativo a su ubicación
            </p>
            <p className="mt-1 text-sm text-red-800/80">
              Por favor, espere un momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
