import { useEffect } from "react";
import "./App.css";
import { AutoSaver } from "./AutoSaver";
import { Layout } from "./Layout";
import { Toolbar } from "./Toolbar";
import { useSetAtom } from "jotai";
import { copyTriggerAtom, pasteTriggerAtom } from "../state";

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
  }, []);

  return (
    <main className="bg-gray-200 h-screen w-screen flex flex-col">
      <Toolbar />
      <Layout />
      <AutoSaver enabled={false} />
    </main>
  );
}

export default App;
