"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type HelpRequestStep = "idle" | "confirm" | "called";

const HELP_CALLED_DISMISS_MS = 3000;

type HelpRequestContextValue = {
  helpStep: HelpRequestStep;
  helpActive: boolean;
  openHelpConfirm: () => void;
  confirmHelp: () => void;
  cancelHelp: () => void;
  closeHelp: () => void;
};

const HelpRequestContext = createContext<HelpRequestContextValue | null>(null);

export function HelpRequestProvider({ children }: { children: ReactNode }) {
  const [helpStep, setHelpStep] = useState<HelpRequestStep>("idle");

  const openHelpConfirm = useCallback(() => {
    setHelpStep("confirm");
  }, []);

  const confirmHelp = useCallback(() => {
    setHelpStep("called");
  }, []);

  const cancelHelp = useCallback(() => {
    setHelpStep("idle");
  }, []);

  const closeHelp = useCallback(() => {
    setHelpStep("idle");
  }, []);

  useEffect(() => {
    if (helpStep !== "called") {
      return;
    }

    const timer = window.setTimeout(closeHelp, HELP_CALLED_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [helpStep, closeHelp]);

  const value = useMemo(
    () => ({
      helpStep,
      helpActive: helpStep !== "idle",
      openHelpConfirm,
      confirmHelp,
      cancelHelp,
      closeHelp,
    }),
    [helpStep, openHelpConfirm, confirmHelp, cancelHelp, closeHelp],
  );

  return (
    <HelpRequestContext.Provider value={value}>
      {children}
    </HelpRequestContext.Provider>
  );
}

export function useHelpRequest() {
  const context = useContext(HelpRequestContext);

  if (!context) {
    throw new Error("useHelpRequest debe usarse dentro de HelpRequestProvider");
  }

  return context;
}
