import { MetaTileViewer } from "./MetaTileViewer/MetaTileViewer";
import { TileSetViewer } from "./TileSetViewer";
import { TileEditor } from "./TileEditor";
import { MetaTileCompute } from "./MetaTileViewer/MetaTileCompute";
import { currentEditedMapIndexAtom } from "../state/ui";
import { useAtomValue } from "jotai";
import { WorldmapEdit } from "./Worldmap/WorldMapEdit";
import { Worldmap } from "./Worldmap/WorldMap";

export function Layout() {
  const isEditingMap = useAtomValue(currentEditedMapIndexAtom);
  return (
    <div className="flex flex-row h-full p-2">
      <div className="flex flex-col h-full mr-2">
        <div className="grow-0 shrink-1 basis-0 mb-2">
          <TileEditor />
        </div>
        <div className="grow-1 shrink-0 basis-0 overflow-y-scroll">
          <TileSetViewer />
        </div>
      </div>
      {isEditingMap !== null ? <WorldmapEdit /> : <Worldmap />}
      <div className="flex flex-col h-full ml-2">
        <MetaTileCompute />
        <MetaTileViewer />
      </div>
    </div>
  );
}
