// import { scan } from "react-scan";

// if (typeof window !== "undefined") {
//   scan({ enabled: true });
// }

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./ui/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
