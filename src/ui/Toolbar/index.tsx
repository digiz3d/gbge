import { ToolbarMapEditor } from "./ToolbarMapEditor";
import { ToolbarTileEditor } from "./ToolbarTileEditor";

export function Toolbar() {
  return (
    <div className="bg-blue-500 h-10 w-full flex flex-row">
      <div className="flex-1"></div>
      <ToolbarMapEditor />
      <ToolbarTileEditor />
    </div>
  );
}
