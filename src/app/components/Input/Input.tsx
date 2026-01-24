"use client";

import { Field } from "@base-ui/react/field";
import styles from "./Input.module.css";

export type InputProps = {
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
};

export function Input({
  value,
  error,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  type = "text",
}: InputProps) {
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Field.Root className={styles.input}>
      {label && (
        <Field.Label className={styles.input__label}>
          {label}
          {required && " *"}
        </Field.Label>
      )}
      <Field.Control
        className={styles.input__control}
        value={value}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        type={type}
      />
      {error && (
        <Field.Error className={styles.input__error} match={true}>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
}
