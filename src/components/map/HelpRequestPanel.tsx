"use client";

import {
  helpPanelSizers,
  MapPanelCard,
} from "./MapPanelCard";
import { useHelpRequest } from "./HelpRequestContext";

export function HelpRequestPanel() {
  const { helpStep, confirmHelp, cancelHelp } = useHelpRequest();

  if (helpStep === "idle") {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1000] flex justify-center px-4">
      <MapPanelCard
        sizers={helpPanelSizers()}
        onClose={helpStep === "confirm" ? cancelHelp : undefined}
        closeLabel="Cancelar"
      >
        {helpStep === "confirm" ? (
          <>
            <div className="pr-8">
              <p className="text-base font-semibold whitespace-nowrap text-emerald-950">
                ¿Llamar a un administrativo?
              </p>
            </div>
            <button
              type="button"
              className="map-control-btn mt-3 w-full rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              onClick={confirmHelp}
            >
              Llamar
            </button>
          </>
        ) : (
          <div>
            <p className="text-base font-semibold whitespace-nowrap text-red-950">
              Ayuda en camino
            </p>
            <p className="mt-0.5 text-sm whitespace-nowrap text-red-800/80">
              Espere un momento.
            </p>
          </div>
        )}
      </MapPanelCard>
    </div>
  );
}
