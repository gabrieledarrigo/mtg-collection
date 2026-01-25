"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, BadgeVariant } from "./Badge/Badge";
import { Button, ButtonVariant } from "./Button/Button";
import { Icon, IconName } from "./Icon/Icon";
import { Modal } from "./Modal/Modal";
import { Toggle, ToggleVariant } from "./Toggle/Toggle";
import { Select } from "./Select/Select";
import { Input } from "./Input/Input";
import { Checkbox } from "./Checkbox/Checkbox";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState("m21");
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);

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
          <Icon name={IconName.G} size={30} />
          <Icon name={IconName.R} size={30} />
          <Icon name={IconName.U} size={30} />
          <Icon name={IconName.W} size={30} />
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

        <h2>Input</h2>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            maxWidth: "300px",
          }}
        >
          <Input
            label="Username"
            placeholder="Enter your username"
            value={inputValue}
            onChange={setInputValue}
          />

          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={emailValue}
            onChange={setEmailValue}
          />

          <Input
            type="search"
            placeholder="Search for cards..."
            value={searchValue}
            onChange={setSearchValue}
          />

          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
          />

          <Input
            label="Input with Error"
            placeholder="Enter your username"
            error="Username is required"
          />

          <div>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Current values:
              <br />
              Username: <strong>{inputValue || "(empty)"}</strong>
              <br />
              Email: <strong>{emailValue || "(empty)"}</strong>
              <br />
              Search: <strong>{searchValue || "(empty)"}</strong>
            </p>
          </div>
        </div>

        <h2>Select</h2>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            maxWidth: "300px",
          }}
        >
          <Select
            options={[
              { value: "m21", label: "Core Set 2021" },
              { value: "znr", label: "Zendikar Rising" },
              { value: "khm", label: "Kaldheim" },
              { value: "stx", label: "Strixhaven" },
              { value: "afr", label: "Adventures in the Forgotten Realms" },
              { value: "mid", label: "Innistrad: Midnight Hunt" },
              { value: "vow", label: "Innistrad: Crimson Vow" },
              { value: "neo", label: "Kamigawa: Neon Dynasty" },
              { value: "snc", label: "Streets of New Capenna" },
              { value: "dmu", label: "Dominaria United" },
              { value: "bro", label: "The Brothers' War" },
              { value: "one", label: "Phyrexia: All Will Be One" },
              { value: "mom", label: "March of the Machine" },
              { value: "mat", label: "March of the Machine: The Aftermath" },
              { value: "woe", label: "Wilds of Eldraine" },
              { value: "lci", label: "The Lost Caverns of Ixalan" },
              { value: "mkm", label: "Murders at Karlov Manor" },
              { value: "otj", label: "Outlaws of Thunder Junction" },
              { value: "blb", label: "Bloomburrow" },
              { value: "dsk", label: "Duskmourn: House of Horror" },
              { value: "m20", label: "Core Set 2020" },
              { value: "m19", label: "Core Set 2019" },
              { value: "dom", label: "Dominaria" },
              { value: "rix", label: "Rivals of Ixalan" },
              { value: "xln", label: "Ixalan" },
              { value: "hou", label: "Hour of Devastation" },
              { value: "akh", label: "Amonkhet" },
              { value: "aer", label: "Aether Revolt" },
              { value: "kld", label: "Kaladesh" },
              { value: "emn", label: "Eldritch Moon" },
              { value: "soi", label: "Shadows over Innistrad" },
              { value: "ogw", label: "Oath of the Gatewatch" },
              { value: "bfz", label: "Battle for Zendikar" },
              { value: "ori", label: "Magic Origins" },
              { value: "dtk", label: "Dragons of Tarkir" },
              { value: "frf", label: "Fate Reforged" },
              { value: "ktk", label: "Khans of Tarkir" },
              { value: "m15", label: "Magic 2015" },
              { value: "jou", label: "Journey into Nyx" },
              { value: "bng", label: "Born of the Gods" },
              { value: "ths", label: "Theros" },
              { value: "m14", label: "Magic 2014" },
              { value: "dgm", label: "Dragon's Maze" },
              { value: "gtc", label: "Gatecrash" },
              { value: "rtr", label: "Return to Ravnica" },
              { value: "m13", label: "Magic 2013" },
              { value: "avr", label: "Avacyn Restored" },
              { value: "dka", label: "Dark Ascension" },
              { value: "isd", label: "Innistrad" },
              { value: "m12", label: "Magic 2012" },
              { value: "nph", label: "New Phyrexia" },
              { value: "mbs", label: "Mirrodin Besieged" },
              { value: "som", label: "Scars of Mirrodin" },
              { value: "m11", label: "Magic 2011" },
              { value: "roe", label: "Rise of the Eldrazi" },
              { value: "wwk", label: "Worldwake" },
              { value: "zen", label: "Zendikar" },
              { value: "m10", label: "Magic 2010" },
              { value: "arb", label: "Alara Reborn" },
              { value: "con", label: "Conflux" },
              { value: "ala", label: "Shards of Alara" },
              { value: "eve", label: "Eventide" },
              { value: "shm", label: "Shadowmoor" },
              { value: "mor", label: "Morningtide" },
              { value: "lrw", label: "Lorwyn" },
              { value: "10e", label: "Tenth Edition" },
              { value: "fut", label: "Future Sight" },
              { value: "plc", label: "Planar Chaos" },
              { value: "tsp", label: "Time Spiral" },
              { value: "csp", label: "Coldsnap" },
              { value: "dis", label: "Dissension" },
              { value: "gpt", label: "Guildpact" },
              { value: "rav", label: "Ravnica: City of Guilds" },
              { value: "9ed", label: "Ninth Edition" },
              { value: "sok", label: "Saviors of Kamigawa" },
              { value: "bok", label: "Betrayers of Kamigawa" },
              { value: "chk", label: "Champions of Kamigawa" },
              { value: "5dn", label: "Fifth Dawn" },
              { value: "dst", label: "Darksteel" },
              { value: "mrd", label: "Mirrodin" },
              { value: "8ed", label: "Eighth Edition" },
              { value: "scg", label: "Scourge" },
              { value: "lgn", label: "Legions" },
              { value: "ons", label: "Onslaught" },
              { value: "jud", label: "Judgment" },
              { value: "tor", label: "Torment" },
              { value: "ody", label: "Odyssey" },
              { value: "7ed", label: "Seventh Edition" },
              { value: "apc", label: "Apocalypse" },
              { value: "pls", label: "Planeshift" },
              { value: "inv", label: "Invasion" },
              { value: "pcy", label: "Prophecy" },
              { value: "nem", label: "Nemesis" },
              { value: "mmq", label: "Mercadian Masques" },
              { value: "6ed", label: "Classic Sixth Edition" },
              { value: "uds", label: "Urza's Destiny" },
              { value: "ulg", label: "Urza's Legacy" },
              { value: "usg", label: "Urza's Saga" },
              { value: "exo", label: "Exodus" },
              { value: "sth", label: "Stronghold" },
              { value: "tmp", label: "Tempest" },
            ]}
            value={selectedSet}
            onChange={setSelectedSet}
            label="Select a Set"
          />

          <Select
            options={[
              { value: "en", label: "English" },
              { value: "it", label: "Italian" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
            ]}
            value="en"
            onChange={(value) => alert(`Language: ${value}`)}
            placeholder="Choose a language"
          />

          <Select
            options={[
              { value: "common", label: "Common" },
              { value: "uncommon", label: "Uncommon" },
              { value: "rare", label: "Rare" },
              { value: "mythic", label: "Mythic" },
            ]}
            value="rare"
            onChange={() => {}}
            label="Rarity"
            disabled
          />

          <Select
            options={[
              { value: "nm", label: "Near Mint" },
              { value: "lp", label: "Lightly Played" },
              { value: "mp", label: "Moderately Played" },
              { value: "hp", label: "Heavily Played" },
            ]}
            value=""
            onChange={() => {}}
            label="Condition"
            required
            error="Please select a condition"
          />
        </div>

        <h2>Checkbox</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h5>Basic Checkbox (unchecked)</h5>
            <Checkbox
              id="checkbox-1"
              checked={checked1}
              onChange={setChecked1}
            />
          </div>

          <div>
            <h5>Checkbox with Text Label (checked)</h5>
            <Checkbox
              id="checkbox-2"
              checked={checked2}
              onChange={setChecked2}
              label="Label"
            />
          </div>

          <div>
            <h5>Checkbox with Icon and Label</h5>
            <Checkbox
              id="checkbox-3"
              checked={checked3}
              onChange={setChecked3}
              icon={IconName.B}
            />
          </div>

          <div>
            <h5>Disabled Checkbox</h5>
            <Checkbox
              id="checkbox-4"
              checked={checked4}
              onChange={setChecked4}
              label="Disabled"
              disabled
            />
          </div>
        </div>

        <div style={{ marginTop: "4rem", height: "10rem" }}>
          <p>
            This space is to ensure components at the bottom of the page are
            visible.
          </p>
        </div>
      </section>
    </main>
  );
}
