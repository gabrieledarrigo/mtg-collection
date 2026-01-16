"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, BadgeVariant } from "./Badge/Badge";
import { Button, ButtonVariant } from "./Button/Button";
import { Icon, IconName } from "./Icon/Icon";
import { Modal } from "./Modal/Modal";
import { Toggle, ToggleVariant } from "./Toggle/Toggle";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

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
        <h2>Badge</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Badge text="Primary" variant={BadgeVariant.PRIMARY} />
          <Badge text="Secondary" variant={BadgeVariant.SECONDARY} />
          <Badge text="Info" variant={BadgeVariant.INFO} />
          <Badge text="Success" variant={BadgeVariant.SUCCESS} />
          <Badge text="Danger" variant={BadgeVariant.DANGER} />
          <Badge text="Warning" variant={BadgeVariant.WARNING} />
        </div>
        <h2>Button</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            variant={ButtonVariant.PRIMARY}
            onClick={() => {
              alert("Primary Button Clicked");
            }}
          >
            Primary Button
          </Button>
          <Button
            variant={ButtonVariant.SECONDARY}
            onClick={() => {
              alert("Secondary Button Clicked");
            }}
          >
            Secondary Button
          </Button>
          <Button
            variant={ButtonVariant.ICON}
            onClick={() => alert("Icon Button Clicked")}
          >
            <i className="mi mi-mana mi-w"></i>
          </Button>
          <Button variant={ButtonVariant.PRIMARY} disabled>
            Disabled Button
          </Button>
        </div>
        <h2>Icon</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Icon name={IconName.SEARCH} size={30} />
          <Icon name={IconName.FILTER} size={30} />
          <Icon name={IconName.FILTER_OFF} size={30} />
          <Icon name={IconName.CLOSE} size={30} />
          <Icon name={IconName.ARROW_BACK} size={30} />
          <Icon name={IconName.ARROW_DROP_DOWN} size={30} />
          <Icon name={IconName.GRID} size={30} />
          <Icon name={IconName.LIST} size={30} />
          <Icon name={IconName.B} size={30} />
        </div>

        <h2>Modal</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            variant={ButtonVariant.PRIMARY}
            onClick={() => setModalOpen(true)}
          >
            Open Modal
          </Button>
          <Modal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Example Modal"
            footer={
              <>
                <Button
                  variant={ButtonVariant.SECONDARY}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant={ButtonVariant.PRIMARY}
                  onClick={() => {
                    alert("Submitted!");
                    setModalOpen(false);
                  }}
                >
                  Submit
                </Button>
              </>
            }
          >
            <p>
              This is an example modal dialog. It can contain any content you
              want to display.
            </p>
            <p>
              Click the X button, outside the modal, press ESC, or use the
              footer buttons to close it.
            </p>
          </Modal>
        </div>

        <h2>Toggle</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Toggle
            options={[
              { value: "grid", icon: IconName.GRID, label: "Grid view" },
              { value: "list", icon: IconName.LIST, label: "List view" },
            ]}
            variant={ToggleVariant.PRIMARY}
            value={"grid"}
            onChange={(value) => {
              alert(`Value: ${value}`);
            }}
          />

          <Toggle
            options={[
              { value: "ON", label: "ON" },
              { value: "OFF", label: "OFF" },
            ]}
            variant={ToggleVariant.NEUTRAL}
            value={"ON"}
            onChange={(value) => {
              alert(`Value: ${value}`);
            }}
          />

          <Toggle
            options={[
              { value: "ON", label: "ON" },
              { value: "OFF", label: "OFF" },
            ]}
            variant={ToggleVariant.NEUTRAL}
            value={"ON"}
            onChange={(value) => {
              alert(`Value: ${value}`);
            }}
            disabled
          />
        </div>
      </section>
    </main>
  );
}
