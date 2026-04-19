"use client";

import { useSearchParams } from "next/navigation";
import { IconName } from "@app/components/Icon/Icon";
import { Toggle, ToggleVariant } from "@app/components/Toggle/Toggle";
import { useUpdateSearchParams } from "@app/hooks/useUpdateSearchParams";
import { ViewToggle } from "@app/lib/types";
import { collectionSearchParams } from "@app/collection/schemas/searchParams.schema";

export function FilterBar() {
  const searchParams = useSearchParams();
  const setSearchParams = useUpdateSearchParams();

  const params = collectionSearchParams.parse(
    Object.fromEntries(searchParams.entries()),
  );

  const onToggleChange = (view: ViewToggle) => {
    setSearchParams({ view });
  };

  return (
    <div>
      <Toggle
        options={[
          { value: ViewToggle.GRID, icon: IconName.GRID, label: "Grid view" },
          {
            value: ViewToggle.TABLE,
            icon: IconName.LIST,
            label: "Table view",
          },
        ]}
        variant={ToggleVariant.NEUTRAL}
        value={params.view}
        onChange={onToggleChange}
      />
    </div>
  );
}
