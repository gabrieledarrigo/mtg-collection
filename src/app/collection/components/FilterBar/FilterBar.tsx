"use client";

import { useSearchParams } from "next/navigation";
import { IconName } from "@app/components/Icon/Icon";
import { Toggle, ToggleVariant } from "@app/components/Toggle/Toggle";
import { useUpdateSearchParams } from "@app/hooks/useUpdateSearchParams";
import styles from "./FilterBar.module.css";

export enum ViewToggle {
  grid = "grid",
  table = "table",
}

export function FilterBar() {
  const searchParams = useSearchParams();
  const setSearchParams = useUpdateSearchParams();

  const viewToggle = (searchParams.get("view") ??
    ViewToggle.grid) as ViewToggle;

  const onToggleChange = (value: ViewToggle) => {
    setSearchParams({ view: value });
  };

  return (
    <div className={styles["filter-bar"]}>
      <Toggle
        options={[
          { value: ViewToggle.grid, icon: IconName.GRID, label: "Grid view" },
          {
            value: ViewToggle.table,
            icon: IconName.LIST,
            label: "Table view",
          },
        ]}
        variant={ToggleVariant.NEUTRAL}
        value={viewToggle}
        onChange={onToggleChange}
      />
    </div>
  );
}
