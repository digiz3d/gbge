import { MetaTileViewer } from "./MetaTileViewer/MetaTileViewer";
import { TileSetViewer } from "./TileSetViewer";
import { TileEditor } from "./TileEditor";
import { MapVisibleOverlay } from "./MapEditor/MapVisibleOverlay";
import { MapEditor } from "./MapEditor";
import { MetaTileCompute } from "./MetaTileViewer/MetaTileCompute";
import { MetaHighlightOverlay } from "./MapEditor/MetaHighlightOverlay";
import { GridOverlay } from "./MapEditor/GridOverlay";
import { MapsTabs } from "./MapsTabs/MapsTabs";

export function Layout() {
  return (
    <div className="flex flex-row h-full p-4">
      <div className="flex flex-col h-full">
        <div className="grow-0 shrink-1 basis-0 mb-4">
          <TileEditor />
        </div>
        <div className="grow-1 shrink-0 basis-0 overflow-auto">
          <TileSetViewer />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center flex-col">
        <MapsTabs />
        <div className="relative h-[600px] w-[600px] overflow-scroll">
          <MapEditor />
          <MapVisibleOverlay />
          <MetaHighlightOverlay />
          <GridOverlay />
        </div>
      </div>
      <div className="flex flex-col h-full">
        <MetaTileCompute />
        <div className="grow-1 shrink-0 basis-0 overflow-auto">
          <MetaTileViewer />
        </div>
      </div>
    </div>
  );
}
