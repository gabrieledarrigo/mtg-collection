import Link from "next/link";
import styles from "./Navigation.module.css";

export type NavigationProps = {
  items: {
    label: string;
    href: string;
  }[];
};

export default function Navigation({ items }: NavigationProps) {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigation__list}>
        {items.map((item) => (
          <li key={item.href} className={styles.navigation__item}>
            <Link href={item.href} className={styles.navigation__link}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
