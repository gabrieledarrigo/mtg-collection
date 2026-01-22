"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
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
  const onValueChange = (newValue: string | null) => {
    if (newValue && !disabled) {
      onChange(newValue);
    }
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Field.Root className={styles.field}>
      {label && <Field.Label className={styles.label}>{label}</Field.Label>}
      <BaseSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <BaseSelect.Trigger className={styles.trigger}>
          <BaseSelect.Value className={styles.value}>
            {selectedOption ? selectedOption.label : placeholder}
          </BaseSelect.Value>
          <BaseSelect.Icon className={styles.icon}>
            <Icon name={IconName.ARROW_DROP_DOWN} size={16} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner className={styles.positioner}>
            <BaseSelect.Popup className={styles.popup}>
              <BaseSelect.List className={styles.list}>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    value={option.value}
                    className={styles.item}
                  >
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator className={styles.indicator}>
                      ✓
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </Field.Root>
  );
}
