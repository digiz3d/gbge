import { ToolbarMapEditor } from "./ToolbarMapEditor";
import { ToolbarSeparator } from "./ToolbarSeparator";
import { ToolbarTileEditor } from "./ToolbarTileEditor";
import { ToolbarTileShifter } from "./ToolbarTileShifter";

export function Toolbar() {
  return (
    <div className="bg-blue-500 w-full flex flex-row p-2 justify-between">
      <ToolbarMapEditor />
      <div className="flex flex-row">
        <ToolbarTileShifter />
        <ToolbarSeparator />
        <ToolbarTileEditor />
      </div>
    </div>
  );
}
