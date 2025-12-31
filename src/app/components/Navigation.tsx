import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link href="/collection" className="navigation-link">
            Collection
          </Link>
        </li>
      </ul>
    </nav>
  );
}
