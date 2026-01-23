"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { Icon, IconName } from "../Icon/Icon";
import styles from "./Select.module.css";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  disabled = false,
}: SelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  const handleValueChange = (newValue: string | null) => {
    if (newValue && !disabled) {
      onChange(newValue);
    }
  };

  return (
    <Field.Root className={styles.select}>
      {label && <Field.Label className={styles.select__label}>{label}</Field.Label>}
      <Combobox.Root
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <Combobox.Trigger className={styles.select__trigger}>
          <Combobox.Input
            className={styles.select__input}
            placeholder={placeholder}
            aria-label={label || placeholder}
          />
          <Combobox.Icon className={styles.select__icon}>
            <Icon name={IconName.ARROW_DROP_DOWN} size={16} />
          </Combobox.Icon>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner className={styles.select__positioner} sideOffset={4}>
            <Combobox.Popup className={styles.select__popup}>
              <Combobox.List className={styles.select__list}>
                {options.map((option) => (
                  <Combobox.Item
                    key={option.value}
                    value={option.value}
                    className={styles.select__item}
                  >
                    <span className={styles["select__item-text"]}>{option.label}</span>
                    <Combobox.ItemIndicator className={styles["select__item-indicator"]}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
                <Combobox.Empty className={styles.select__empty}>
                  No options found
                </Combobox.Empty>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  );
}
