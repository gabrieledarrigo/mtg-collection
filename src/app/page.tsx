"use client";

import { useState } from "react";
import { Checkbox } from "@components/Checkbox/Checkbox";
import { IconName } from "@components/Icon/Icon";

export default function Home() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);

  return (
    <main>
      <section>
        <h1>MTG Collection</h1>
        <h2>Checkbox Component Examples</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h3>Basic Checkbox (unchecked)</h3>
            <Checkbox checked={checked1} onChange={setChecked1} />
          </div>

          <div>
            <h3>Checkbox with Text Label (checked)</h3>
            <Checkbox
              checked={checked2}
              onChange={setChecked2}
              label="Accept terms and conditions"
            />
          </div>

          <div>
            <h3>Checkbox with Icon and Label</h3>
            <Checkbox
              checked={checked3}
              onChange={setChecked3}
              icon={IconName.FILTER}
              label="Enable filters"
            />
          </div>

          <div>
            <h3>Disabled Checkbox</h3>
            <Checkbox
              checked={checked4}
              onChange={setChecked4}
              label="This checkbox is disabled"
              disabled
            />
          </div>
        </div>
      </section>
    </main>
  );
}
