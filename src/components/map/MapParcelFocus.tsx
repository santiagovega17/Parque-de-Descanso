"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { focusMapOnParcel } from "@/lib/map/map-limits";
import { getParcelById } from "@/lib/map/parcels";
import { useParcelSearch } from "./ParcelSearchContext";

export function MapParcelFocus() {
  const map = useMap();
  const { focusParcelId, focusToken, clearParcelFocus } = useParcelSearch();

  useEffect(() => {
    if (!focusParcelId) {
      return;
    }

    const parcel = getParcelById(focusParcelId);
    if (!parcel) {
      clearParcelFocus();
      return;
    }

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        focusMapOnParcel(map, parcel);
        clearParcelFocus();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [focusParcelId, focusToken, map, clearParcelFocus]);

  return null;
}
