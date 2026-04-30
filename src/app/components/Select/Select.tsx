"use client";

import { useState, useMemo, useRef } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { Icon, IconName } from "../Icon/Icon";
import styles from "./Select.module.css";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectPropsBase = {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  showClearButton?: boolean;
};

type SingleSelectProps = SelectPropsBase & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultipleSelectProps = SelectPropsBase & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type SelectProps = SingleSelectProps | MultipleSelectProps;

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  multiple = false,
  disabled = false,
  error,
  required = false,
  showClearButton = true,
}: SelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = useMemo(
    () =>
      multiple
        ? options.filter((option) => value.includes(option.value))
        : (options.find((option) => option.value === value) ?? null),
    [options, multiple, value],
  );

  const selectedLabel = !multiple
    ? (options.find((option) => option.value === value)?.label ?? "")
    : "";

  const filteredOptions = useMemo(() => {
    if (!inputValue || inputValue === selectedLabel) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
    );
  }, [options, inputValue, selectedLabel]);

  const renderValue = (options: SelectOption[], value: string[]) => {
    if (value.length === 0) {
      return null;
    }

    const label =
      options.find((option) => option.value === value[0])?.label ?? "";

    const rest = value.length - 1;

    if (rest > 0) {
      return `${label} (+${rest} more)`;
    }

    return label;
  };

  const renderPlaceholder = () => {
    if (multiple && value.length > 0) {
      return "";
    }

    if (!multiple && selectedLabel) {
      return "";
    }

    return placeholder;
  };

  const onInputValueChange = (newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      setInputValue("");
    }
  };

  const modeProps = multiple
    ? {
        multiple: true as const,
        value: selectedOption as SelectOption[],
        onValueChange: (newValue: SelectOption[]) => {
          if (!disabled) {
            (onChange as (value: string[]) => void)(
              newValue.map(({ value }) => value),
            );
          }
        },
      }
    : {
        multiple: undefined as false | undefined,
        value: selectedOption as SelectOption | null,
        onValueChange: (newValue: SelectOption | null) => {
          if (newValue && !disabled) {
            (onChange as (value: string) => void)(newValue.value);
          }
        },
      };

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
        onInputValueChange={onInputValueChange}
        onOpenChange={onOpenChange}
        disabled={disabled}
        {...(modeProps as Combobox.Root.Props<SelectOption>)}
      >
        <Combobox.Trigger ref={triggerRef} className={styles.select__trigger}>
          {multiple && value.length > 0 && (
            <span className={styles.select__value}>
              <Combobox.Value>
                {() => renderValue(options, value as string[])}
              </Combobox.Value>
            </span>
          )}
          <Combobox.Input
            className={styles.select__input}
            placeholder={renderPlaceholder()}
            aria-label={label || placeholder}
          />
          {showClearButton && (
            <Combobox.Clear
              className={styles.select__clear}
              aria-label="Clear selection"
              render={<div />}
              nativeButton={false}
            >
              <Icon name={IconName.CLOSE} size={16} />
            </Combobox.Clear>
          )}
          <Combobox.Icon className={styles.select__icon}>
            <Icon name={IconName.ARROW_DROP_DOWN} size={16} />
          </Combobox.Icon>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner
            className={styles.select__positioner}
            side="bottom"
            align="start"
            sideOffset={4}
            anchor={triggerRef}
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
