import styles from "./Header.module.css";

export type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function Header({ title, children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <h1 className={styles.header__title}>{title}</h1>
        {children}
      </div>
    </header>
  );
}
