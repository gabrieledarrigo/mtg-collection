import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { Icon, IconName } from "../Icon/Icon";
import styles from "./Toggle.module.css";

export enum ToggleVariant {
  NEUTRAL = "neutral",
  PRIMARY = "primary",
}

export type ToggleOption<T extends string> = {
  label: string;
  icon?: IconName;
  value: T;
};

export type ToggleProps<T extends string> = {
  options: [ToggleOption<T>, ToggleOption<T>];
  value: T;
  variant: ToggleVariant;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function Toggle<T extends string>({
  options,
  value,
  variant,
  onChange,
  disabled = false,
}: ToggleProps<T>) {
  const onValueChange = (groupValue: T[]) => {
    const newValue = groupValue[0];
    if (!newValue || disabled) {
      return;
    }

    onChange(newValue);
  };

  return (
    <BaseToggleGroup
      value={[value]}
      onValueChange={onValueChange}
      disabled={disabled}
      className={`${styles["toggle-group"]} ${styles[`toggle-group--${variant}`]}`}
    >
      {options.map((option) => (
        <BaseToggle
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className={styles.toggle}
        >
          {option.icon ? <Icon name={option.icon} size={20} /> : option.label}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  );
}
