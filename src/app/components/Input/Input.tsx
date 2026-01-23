"use client";

import { Field } from "@base-ui/react/field";
import styles from "./Input.module.css";

export type InputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
};

export function Input({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  type = "text",
}: InputProps) {
  const handleValueChange = (newValue: string) => {
    if (onChange && !disabled) {
      onChange(newValue);
    }
  };

  return (
    <Field.Root className={styles.input}>
      {label && <Field.Label className={styles.input__label}>{label}</Field.Label>}
      <Field.Control
        className={styles.input__control}
        value={value}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
      />
    </Field.Root>
  );
}
