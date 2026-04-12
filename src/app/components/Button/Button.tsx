"use client";

import { Button as BaseButton } from "@base-ui/react";
import styles from "./Button.module.css";

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  NEUTRAL = "neutral",
  ICON = "icon",
}

export type ButtonProps = {
  variant?: ButtonVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
};

export function Button({
  variant = ButtonVariant.PRIMARY,
  onClick,
  disabled = false,
  title,
  children,
}: ButtonProps) {
  return (
    <BaseButton
      className={`${styles.button} ${styles[`button--${variant}`]} ${disabled ? styles["button--disabled"] : ""}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </BaseButton>
  );
}
