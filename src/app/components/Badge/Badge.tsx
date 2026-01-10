import styles from "./Badge.module.css";

export enum BadgeVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  INFO = "info",
  SUCCESS = "success",
  DANGER = "danger",
  WARNING = "warning",
}

export type BadgeProps = {
  text: string;
  variant?: BadgeVariant;
};

export function Badge({ text, variant = BadgeVariant.PRIMARY }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {text}
    </span>
  );
}
