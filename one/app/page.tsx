"use client";

import { Button } from "ui";

export default function Home() {
  return (
    <div>
      <div>hello</div>
      <div style={{ marginTop: 12 }}>
        <Button
          label="Click me"
          variant="destructive-fill"
          onClick={() => alert("Clicked!")}
        />
      </div>
    </div>
  );
}
