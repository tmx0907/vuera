import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: "24px" }}>
      Vuera is live ✅
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
