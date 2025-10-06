"use client";

import { Button } from "ui";

export default function Home() {
  return (
    <div>
      <h1>Dummy Test Home Page</h1>
      <div style={{ marginTop: 12 }}>
        <Button onClick={() => alert("Button clicked!")}>Test Button</Button>
      </div>
    </div>
  );
}
