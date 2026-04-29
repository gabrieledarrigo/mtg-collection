"use client";

import { useSearchParams } from "next/navigation";
import { IconName } from "@app/components/Icon/Icon";
import { Toggle, ToggleVariant } from "@app/components/Toggle/Toggle";
import { useUpdateSearchParams } from "@app/hooks/useUpdateSearchParams";
import { Color, ViewToggle } from "@app/lib/types";
import { collectionSearchParams } from "@app/collection/schemas/searchParams.schema";
import { Input } from "@app/components/Input/Input";
import { useDebounce } from "@app/hooks/useDebounce";
import { Checkbox } from "@app/components/Checkbox/Checkbox";
import styles from "./FilterBar.module.css";
import { Select } from "@app/components/Select/Select";

export type FilterBarProps = {
  availableSets: {
    setCode: string;
    setName: string;
  }[];
};

export const SEARCH_DEBOUNCE_DELAY = 500;

export function FilterBar({ availableSets }: FilterBarProps) {
  const searchParams = useSearchParams();
  const setSearchParams = useUpdateSearchParams();
  const debounce = useDebounce(SEARCH_DEBOUNCE_DELAY);

  const params = collectionSearchParams.parse({
    search: searchParams.get("search") ?? "",
    color: searchParams.getAll("color"),
    setCode: searchParams.getAll("setCode"),
    view: searchParams.get("view") ?? "",
  });

  const onSearch = (search: string) => {
    debounce(() => setSearchParams({ search }));
  };

  const onChangeColor = (newColor: Color) => (checked: boolean) => {
    const current = params.color ?? [];
    const next = checked
      ? [...current, newColor]
      : current.filter((color) => color !== newColor);

    const color = next.length > 0 ? next : null;

    setSearchParams({ color });
  };

  const onSetChange = (setCodes: string[]) => {
    setSearchParams({
      setCode: setCodes.length > 0 ? setCodes : null,
    });
  };

  const onToggleChange = (view: ViewToggle) => {
    setSearchParams({ view });
  };

  return (
    <div>
      <div className={styles.filter__controls}>
        <div className={styles.filter__sets}>
          <Select
            multiple
            options={availableSets.map(({ setCode, setName }) => ({
              value: setCode,
              label: setName,
            }))}
            value={params.setCode ?? []}
            onChange={onSetChange}
            placeholder="Select one or more sets"
          />
        </div>

        <div className={styles.filter__search}>
          <Input
            type="search"
            placeholder="Search by card name or text"
            onChange={onSearch}
          />
        </div>

        <div className={styles.filter__colors}>
          {Object.values(Color).map((color) => (
            <Checkbox
              id={`checkbox-${color}`}
              key={color}
              checked={params.color?.includes(color) ?? false}
              onChange={onChangeColor(color)}
              label={
                <>
                  <i
                    className={`mi mi-2x mi-mana mi-${color.toLowerCase()}`}
                  ></i>
                  <span className="visually-hidden">Filter by {color}</span>
                </>
              }
              ariaLabel={`Filter by ${color}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.filter__toggle}>
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
    </div>
  );
}
