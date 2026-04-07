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
import type { JurisdictionMode, LocalRegion } from "@/lib/jurisdiction";

const STORAGE_MATTER = "legal_platform_matter_title";
const STORAGE_J_MODE = "legal_platform_jurisdiction_mode";
const STORAGE_J_REGION = "legal_platform_jurisdiction_region";

export type DashboardShellContextValue = {
  matterTitle: string;
  setMatterTitle: (v: string) => void;
  jurisdictionMode: JurisdictionMode;
  setJurisdictionMode: (v: JurisdictionMode) => void;
  localRegion: LocalRegion;
  setLocalRegion: (v: LocalRegion) => void;
  reviewMode: boolean;
  setReviewMode: (v: boolean) => void;
};

const DashboardShellContext = createContext<DashboardShellContextValue | null>(
  null,
);

export function DashboardShellProvider({ children }: { children: ReactNode }) {
  const [matterTitle, setMatterTitleState] = useState("Untitled matter");
  const [jurisdictionMode, setJurisdictionModeState] =
    useState<JurisdictionMode>("international");
  const [localRegion, setLocalRegionState] = useState<LocalRegion>("gh");
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_MATTER);
      if (t) setMatterTitleState(t);
      const m = localStorage.getItem(STORAGE_J_MODE) as JurisdictionMode | null;
      if (m === "local" || m === "international") setJurisdictionModeState(m);
      const r = localStorage.getItem(STORAGE_J_REGION) as LocalRegion | null;
      if (r === "gh" || r === "uk" || r === "us-de") setLocalRegionState(r);
    } catch {
      /* ignore */
    }
  }, []);

  const setMatterTitle = useCallback((v: string) => {
    setMatterTitleState(v);
    try {
      localStorage.setItem(STORAGE_MATTER, v);
    } catch {
      /* ignore */
    }
  }, []);

  const setJurisdictionMode = useCallback((v: JurisdictionMode) => {
    setJurisdictionModeState(v);
    try {
      localStorage.setItem(STORAGE_J_MODE, v);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocalRegion = useCallback((v: LocalRegion) => {
    setLocalRegionState(v);
    try {
      localStorage.setItem(STORAGE_J_REGION, v);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () =>
      ({
        matterTitle,
        setMatterTitle,
        jurisdictionMode,
        setJurisdictionMode,
        localRegion,
        setLocalRegion,
        reviewMode,
        setReviewMode,
      }) satisfies DashboardShellContextValue,
    [
      matterTitle,
      setMatterTitle,
      jurisdictionMode,
      setJurisdictionMode,
      localRegion,
      setLocalRegion,
      reviewMode,
      setReviewMode,
    ],
  );

  return (
    <DashboardShellContext.Provider value={value}>
      {children}
    </DashboardShellContext.Provider>
  );
}

export function useDashboardShell(): DashboardShellContextValue {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) {
    throw new Error("useDashboardShell must be used within DashboardShellProvider");
  }
  return ctx;
}
