import { MapEditor } from "./MapEditor";
import { MetaTileViewer } from "./MetaTileViewer";
import { TileSetViewer } from "./TileSetViewer";
import { TileEditor } from "./TileEditor";
import { MapVisibleOverlay } from "./MapEditor/MapVisibleOverlay";

export function Layout() {
  return (
    <div className="flex flex-row h-full p-4">
      <div className="flex-1 relative">
        <MapEditor />
        <MapVisibleOverlay />
      </div>
      <div className="flex flex-col h-full">
        <div>
          <button className="cursor-pointer bg-white rounded-2xl px-2 py-1 active:bg-gray-100">
            Compute
          </button>
        </div>
        <div className="grow-1 shrink-0 basis-0 overflow-auto">
          <MetaTileViewer />
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="grow-0 shrink-1 basis-0">
          <TileEditor />
        </div>
        <div className="grow-1 shrink-0 basis-0 overflow-auto">
          <TileSetViewer />
        </div>
      </div>
    </div>
  );
}
