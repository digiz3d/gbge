import { ToolbarClipboard } from "./ToolbarClipboard";
import { ToolbarGlobalSettings } from "./ToolbarGlobalSettings";
import { ToolbarMapEditor } from "./ToolbarMapEditor";
import { ToolbarTileEditor } from "./ToolbarTileEditor";
import { ToolbarTileShifter } from "./ToolbarTileShifter";

export function Toolbar() {
  return (
    <div className="bg-violet-400 w-full flex flex-row p-2 justify-between">
      <div className="flex-1">
        <div className="flex flex-row gap-2">
          <ToolbarTileEditor />
          <ToolbarTileShifter />
          <ToolbarClipboard />
        </div>
      </div>
      <div className="flex-1">
        <ToolbarMapEditor />
      </div>
      <div className="flex-1">
        <ToolbarGlobalSettings />
      </div>
    </div>
  );
}
