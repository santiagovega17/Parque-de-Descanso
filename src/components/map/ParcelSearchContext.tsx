"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useHelpRequest } from "./HelpRequestContext";

type ParcelSearchContextValue = {
  isOpen: boolean;
  focusParcelId: string | null;
  focusToken: number;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  requestParcelFocus: (parcelId: string) => void;
  clearParcelFocus: () => void;
};

const ParcelSearchContext = createContext<ParcelSearchContextValue | null>(null);

export function ParcelSearchProvider({ children }: { children: ReactNode }) {
  const { closeHelp } = useHelpRequest();
  const [isOpen, setIsOpen] = useState(false);
  const [focusParcelId, setFocusParcelId] = useState<string | null>(null);
  const [focusToken, setFocusToken] = useState(0);

  const openSearch = useCallback(() => {
    closeHelp();
    setIsOpen(true);
  }, [closeHelp]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen((open) => {
      if (!open) {
        closeHelp();
      }
      return !open;
    });
  }, [closeHelp]);

  const requestParcelFocus = useCallback((parcelId: string) => {
    setFocusParcelId(parcelId);
    setFocusToken((token) => token + 1);
  }, []);

  const clearParcelFocus = useCallback(() => {
    setFocusParcelId(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      focusParcelId,
      focusToken,
      openSearch,
      closeSearch,
      toggleSearch,
      requestParcelFocus,
      clearParcelFocus,
    }),
    [
      isOpen,
      focusParcelId,
      focusToken,
      openSearch,
      closeSearch,
      toggleSearch,
      requestParcelFocus,
      clearParcelFocus,
    ],
  );

  return (
    <ParcelSearchContext.Provider value={value}>
      {children}
    </ParcelSearchContext.Provider>
  );
}

export function useParcelSearch() {
  const context = useContext(ParcelSearchContext);

  if (!context) {
    throw new Error(
      "useParcelSearch debe usarse dentro de ParcelSearchProvider",
    );
  }

  return context;
}
