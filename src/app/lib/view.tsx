export enum ViewToggle {
  grid = "grid",
  table = "table",
}

/**
 * Parses a string value into a ViewToggle enum.
 * @param view - The string value to parse, or null.
 * @returns The corresponding ViewToggle value if valid, otherwise defaults to ViewToggle.grid.
 */
export function parseViewToggle(view: string | null): ViewToggle {
  if (view && Object.values(ViewToggle).includes(view as ViewToggle)) {
    return view as ViewToggle;
  }

  return ViewToggle.grid;
}
