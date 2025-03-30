import { MetaTileViewer } from "./MetaTileViewer/MetaTileViewer";
import { TileSetViewer } from "./TileSets/TileSetViewer";
import { TileEditor } from "./TileEditor";
import { MetaTileCompute } from "./MetaTileViewer/MetaTileCompute";
import { currentEditedMapIndexAtom } from "../state/ui";
import { useAtomValue } from "jotai";
import { WorldmapEdit } from "./Worldmap/WorldMapEdit";
import { Worldmap } from "./Worldmap/WorldMap";

export function Layout() {
  const editingMapIndex = useAtomValue(currentEditedMapIndexAtom);
  const isEditingMap = editingMapIndex !== null;
  return (
    <div className="flex flex-row h-full p-2">
      <div className="flex flex-col h-full mr-2 gap-2">
        <TileEditor />
        <TileSetViewer />
      </div>
      {isEditingMap ? <WorldmapEdit /> : <Worldmap />}
      <div className="flex flex-col h-full ml-2">
        <MetaTileCompute />
        <MetaTileViewer />
      </div>
    </div>
  );
}
