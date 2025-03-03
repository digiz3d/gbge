import { useEffect } from "react";
import { Layout } from "./Layout";
import { Toolbar } from "./Toolbar";
import { useSetAtom } from "jotai";
import { copyTriggerAtom, pasteTriggerAtom } from "../state/clipboard";

import "./App.css";

function App() {
  const copyTrigger = useSetAtom(copyTriggerAtom);
  const pasteTrigger = useSetAtom(pasteTriggerAtom);

  useEffect(() => {
    async function cpy(e: ClipboardEvent) {
      e.preventDefault();
      copyTrigger();
    }
    async function pst(e: ClipboardEvent) {
      e.preventDefault();
      pasteTrigger();
    }
    document.addEventListener("copy", cpy);
    document.addEventListener("paste", pst);
    return () => {
      document.removeEventListener("copy", cpy);
      document.removeEventListener("paste", pst);
    };
  }, [Math.random()]);

  return (
    <main
      className="bg-gray-200 h-screen w-screen flex flex-col"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Toolbar />
      <Layout />
    </main>
  );
}

export default App;
