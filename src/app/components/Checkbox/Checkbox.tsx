"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Icon, IconName } from "../Icon/Icon";
import styles from "./Checkbox.module.css";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string | React.ReactNode;
  ariaLabel?: string;
  icon?: IconName;
  iconColor?: string;
  required?: boolean;
  disabled?: boolean;
};

export function Checkbox({
  checked,
  onChange,
  id,
  label,
  ariaLabel,
  icon,
  iconColor,
  required = false,
  disabled = false,
}: CheckboxProps) {
  const onCheckedChange = (newChecked: boolean) => {
    if (!disabled) {
      onChange(newChecked);
    }
  };

  return (
    <div className={styles.checkbox}>
      <BaseCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        className={`${styles.checkbox__root} ${disabled ? styles["checkbox__root--disabled"] : ""}`}
      >
        <BaseCheckbox.Indicator className={styles.checkbox__indicator}>
          {checked && <Icon name={IconName.CHECK} size={25} />}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {(label || icon) && (
        <label
          htmlFor={id}
          className={`${styles.checkbox__label} ${disabled ? styles["checkbox__label--disabled"] : ""}`}
        >
          {icon && <Icon name={icon} color={iconColor} size={25} />}
          {label}
        </label>
      )}
    </div>
  );
}
