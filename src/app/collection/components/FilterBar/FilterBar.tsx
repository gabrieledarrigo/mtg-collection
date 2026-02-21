"use client";

import { useSearchParams } from "next/navigation";
import { IconName } from "@app/components/Icon/Icon";
import { Toggle, ToggleVariant } from "@app/components/Toggle/Toggle";
import { useUpdateSearchParams } from "@app/hooks/useUpdateSearchParams";

export enum ViewToggle {
  grid = "grid",
  table = "table",
}

export type FilterBarProps = {
  defaultView?: ViewToggle;
};

export function FilterBar({ defaultView = ViewToggle.grid }: FilterBarProps) {
  const searchParams = useSearchParams();
  const setSearchParams = useUpdateSearchParams();

  // Read view directly from URL to stay in sync
  const viewToggle = (searchParams.get("view") ?? defaultView) as ViewToggle;

  console.log("[FilterBar] viewToggle from useSearchParams:", viewToggle);

  const onToggleChange = (value: ViewToggle) => {
    console.log("[FilterBar] onToggleChange called with:", value);
    setSearchParams({ view: value });
  };

  return (
    <header>
      <Toggle
        options={[
          { value: ViewToggle.grid, icon: IconName.GRID, label: "Grid view" },
          {
            value: ViewToggle.table,
            icon: IconName.LIST,
            label: "Table view",
          },
        ]}
        variant={ToggleVariant.PRIMARY}
        value={viewToggle}
        onChange={onToggleChange}
      />
    </header>
  );
}
