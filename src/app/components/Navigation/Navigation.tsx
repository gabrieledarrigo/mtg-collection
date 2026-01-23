"use client";

import Link from "next/link";
import styles from "./Navigation.module.css";
import { usePathname } from "next/navigation";

export type NavigationProps = {
  items: {
    label: string;
    href: string;
  }[];
};

export default function Navigation({ items }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigation__list}>
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className={styles.navigation__item}>
              <Link
                href={item.href}
                className={`${styles.navigation__link} ${isActive ? styles["navigation__link--active"] : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
