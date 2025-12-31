import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1 className="header-title">MTG Collection</h1>
        </div>
        <Navigation />
      </div>
    </header>
  );
}
