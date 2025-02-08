import "./App.css";
import { AutoSaver } from "./AutoSaver";
import { Layout } from "./Layout";
import { Toolbar } from "./Toolbar";

function App() {
  return (
    <main className="bg-gray-200 h-screen w-screen flex flex-col">
      <Toolbar />
      <Layout />
      <AutoSaver enabled={false} />
    </main>
  );
}

export default App;
