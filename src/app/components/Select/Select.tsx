"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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
  error?: string;
  required?: boolean;
};

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  disabled = false,
  error,
  required = false,
}: SelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const selectedLabel = selectedOption?.label ?? "";

  const filteredOptions = useMemo(() => {
    if (!inputValue || inputValue === selectedLabel) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
    );
  }, [options, inputValue, selectedLabel]);

  const onValueChange = (newValue: SelectOption | null) => {
    if (newValue && !disabled) {
      onChange(newValue.value);
    }
  };

  const onInputValueChange = (newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      // Reset the input to show all options
      setInputValue("");
    }
  };

  // Update trigger width when the dropdown opens
  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  return (
    <Field.Root className={styles.select}>
      {label && (
        <Field.Label className={styles.select__label}>
          {label}
          {required && " *"}
        </Field.Label>
      )}
      <Combobox.Root<SelectOption>
        open={open}
        value={selectedOption}
        onValueChange={onValueChange}
        onInputValueChange={onInputValueChange}
        onOpenChange={onOpenChange}
        disabled={disabled}
      >
        <Combobox.Trigger ref={triggerRef} className={styles.select__trigger}>
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
          <Combobox.Positioner
            className={styles.select__positioner}
            side="bottom"
            align="start"
            sideOffset={12}
            alignOffset={-16}
            style={{ width: triggerWidth }}
          >
            <Combobox.Popup className={styles.select__popup}>
              <Combobox.List className={styles.select__list}>
                {filteredOptions.map((option) => (
                  <Combobox.Item
                    key={option.value}
                    value={option}
                    className={styles.select__item}
                  >
                    <span className={styles["select__item-text"]}>
                      {option.label}
                    </span>
                    <Combobox.ItemIndicator
                      className={styles["select__item-indicator"]}
                    >
                      <Icon name={IconName.CHECK} size={16} />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
                {filteredOptions.length === 0 && (
                  <Combobox.Empty className={styles.select__empty}>
                    No options found
                  </Combobox.Empty>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      {error && (
        <Field.Error className={styles.select__error} match={true}>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
}
