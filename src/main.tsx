// import { scan } from "react-scan";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./ui/App";

// if (typeof window !== "undefined") {
//   scan({ enabled: true });
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
