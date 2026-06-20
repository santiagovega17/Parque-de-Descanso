"use client";

import { useMemo } from "react";
import { getBlockById } from "@/lib/map/parcels";
import { getSectorFlowerIcon } from "@/lib/map/sector-flowers";
import {
  MapPanelCard,
  MapPanelIconSlot,
  MapPanelText,
  isCenteredDestinationPasillo,
  selectionPanelDestinationSizers,
  selectionPanelParcelSizers,
} from "./MapPanelCard";
import { useHelpRequest } from "./HelpRequestContext";
import { useMapSelection } from "./MapSelectionContext";

export function ParcelSelectionPanel() {
  const { helpActive } = useHelpRequest();
  const {
    selectedParcel,
    selectedParcelLabel,
    selectedSectorName,
    selectedPasillo,
    selectedPasilloLabel,
    clearSelection,
  } = useMapSelection();

  const hasParcelSelection = selectedParcel && selectedParcelLabel;
  const hasPasilloSelection = selectedPasillo && selectedPasilloLabel;

  const flowerIcon = useMemo(() => {
    if (!selectedParcel) {
      return null;
    }

    const block = getBlockById(selectedParcel.blockId);
    return block ? getSectorFlowerIcon(block.variant) : null;
  }, [selectedParcel]);

  if (helpActive || (!hasParcelSelection && !hasPasilloSelection)) {
    return null;
  }

  const isDestinationPanel =
    !!selectedPasillo && isCenteredDestinationPasillo(selectedPasillo.id);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 z-[1000] flex justify-center px-4">
      <MapPanelCard
        compact={isDestinationPanel}
        onClose={clearSelection}
        sizers={
          hasParcelSelection
            ? selectionPanelParcelSizers()
            : selectionPanelDestinationSizers()
        }
      >
        {hasParcelSelection ? (
          <div className="flex items-center gap-3">
            <MapPanelIconSlot>
              {flowerIcon ? (
                <img
                  src={flowerIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-11 w-11 object-contain"
                />
              ) : null}
            </MapPanelIconSlot>
            <MapPanelText
              title={selectedSectorName ?? selectedParcelLabel}
              subtitle={
                selectedSectorName ? `Parcela ${selectedParcel.number}` : undefined
              }
            />
          </div>
        ) : (
          <div
            className={`flex w-full items-center ${
              isDestinationPanel ? "justify-center" : "gap-3"
            }`}
          >
            {isDestinationPanel ? null : <MapPanelIconSlot />}
            <MapPanelText
              title={selectedPasilloLabel ?? ""}
              centered={isDestinationPanel}
            />
          </div>
        )}
      </MapPanelCard>
    </div>
  );
}
