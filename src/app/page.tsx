import Image from "next/image";
import { Badge, BadgeVariant } from "./components/Badge/Badge";

export default function Home() {
  return (
    <main>
      <section>
        <h1>Headline 1</h1>
        <h2>Headline 2</h2>
        <h3>Headline 3</h3>
        <h4>Headline 4</h4>
        <h5>Headline 5</h5>
        <h6>Headline 6</h6>
        <p>This is a paragraph to demonstrate the Open Sans font.</p>
        <small>This is a small text to demonstrate the Open Sans font.</small>

        <div>
          <i>Italic text example.</i>
        </div>
        <div>
          <strong>Strong text example.</strong>
        </div>
      </section>

      <section>
        <h1>Image Test</h1>
        <Image
          src="https://cards.scryfall.io/large/front/3/e/3ea010a6-75dc-468f-862c-c0857b04a1a3.jpg?1561756967"
          alt="Scryfall image"
          width={672}
          height={936}
        />
      </section>

      <section>
        <h1>MTG Font Test</h1>
        <i className="mi mi-2x mi-mana mi-w"></i>
        <i className="mi mi-2x mi-mana mi-u"></i>
        <i className="mi mi-2x mi-mana mi-g"></i>
        <i className="mi mi-2x mi-mana mi-r"></i>
        <i className="mi mi-2x mi-mana mi-b"></i>
      </section>

      <section>
        <h1>Components</h1>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Badge text="Primary" variant={BadgeVariant.PRIMARY} />
          <Badge text="Secondary" variant={BadgeVariant.SECONDARY} />
          <Badge text="Info" variant={BadgeVariant.INFO} />
          <Badge text="Success" variant={BadgeVariant.SUCCESS} />
          <Badge text="Danger" variant={BadgeVariant.DANGER} />
          <Badge text="Warning" variant={BadgeVariant.WARNING} />
        </div>
      </section>
    </main>
  );
}
