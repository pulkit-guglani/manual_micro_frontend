"use client";

import { Button } from "ui";

export default function Home() {
  return (
    <div>
      <div>hello</div>
      <div style={{ marginTop: 12 }}>
        <Button onClick={() => alert("Clicked!")}>Click me</Button>
      </div>
    </div>
  );
}
