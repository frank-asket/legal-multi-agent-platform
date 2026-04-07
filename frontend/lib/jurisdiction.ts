export type JurisdictionMode = "international" | "local";

export type LocalRegion = "gh" | "uk" | "us-de";

export const LOCAL_REGIONS: { id: LocalRegion; label: string; hint: string }[] = [
  { id: "gh", label: "Ghana", hint: "GH" },
  { id: "uk", label: "United Kingdom", hint: "UK" },
  { id: "us-de", label: "US (Delaware)", hint: "US-DE" },
];

export function regionLabel(id: LocalRegion): string {
  return LOCAL_REGIONS.find((r) => r.id === id)?.label ?? id;
}
