"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Icon, IconName } from "../Icon/Icon";
import styles from "./Checkbox.module.css";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  icon?: IconName;
  disabled?: boolean;
};

export function Checkbox({
  checked,
  onChange,
  label,
  icon,
  disabled = false,
}: CheckboxProps) {
  const handleCheckedChange = (newChecked: boolean) => {
    if (!disabled) {
      onChange(newChecked);
    }
  };

  return (
    <div className={styles.checkbox}>
      <BaseCheckbox.Root
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        className={`${styles.checkbox__root} ${disabled ? styles["checkbox__root--disabled"] : ""}`}
      >
        <BaseCheckbox.Indicator className={styles.checkbox__indicator}>
          {checked && <Icon name={IconName.CHECK} size={16} />}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {(label || icon) && (
        <label
          className={`${styles.checkbox__label} ${disabled ? styles["checkbox__label--disabled"] : ""}`}
        >
          {icon && <Icon name={icon} size={20} />}
          {label}
        </label>
      )}
    </div>
  );
}
