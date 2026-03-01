"use client";

export function parseViewToggle(view: string | null): ViewToggle {
  if (view && view === ViewToggle.grid) {
    return ViewToggle.grid;
  }

  return ViewToggle.table;
}
export enum ViewToggle {
  grid = "grid",
  table = "table",
}
