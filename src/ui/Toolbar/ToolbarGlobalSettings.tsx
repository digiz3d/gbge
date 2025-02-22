import { useState } from "react";
import { ResizeMapModal } from "../Modals/ResizeMapModal";
import { BeltTileButton } from "./Belt/BeltTileButton";
import { useSetAtom } from "jotai";
import { loadMapsAtom, saveMapsAtom } from "../../saves/save-maps";
import { loadTileSetsAtom, saveTileSetsAtom } from "../../saves/save-tileset";
import { exportToCAtom } from "../../saves/export-to-c";
import type { Tile } from "../../state/tiles";

export function ToolbarGlobalSettings() {
  const [isResizeMapModalOpen, setIsResizeMapModalOpen] = useState(false);
  const loadMaps = useSetAtom(loadMapsAtom);
  const saveMaps = useSetAtom(saveMapsAtom);
  const loadTileSet = useSetAtom(loadTileSetsAtom);
  const saveTileSet = useSetAtom(saveTileSetsAtom);
  const exportToC = useSetAtom(exportToCAtom);

  return (
    <div className="flex flex-row gap-1 justify-end">
      <BeltTileButton
        tile={resize}
        onClick={() => setIsResizeMapModalOpen(true)}
      />
      <ResizeMapModal
        isOpen={isResizeMapModalOpen}
        close={() => setIsResizeMapModalOpen(false)}
      />
      <BeltTileButton tile={loadMapsIcon} onClick={loadMaps} />
      <BeltTileButton tile={saveMapsIcon} onClick={saveMaps} />
      <BeltTileButton tile={loadTileSetIcon} onClick={loadTileSet} />
      <BeltTileButton tile={saveTileSetIcon} onClick={saveTileSet} />
      <BeltTileButton tile={exportToCIcon} onClick={exportToC} />
    </div>
  );
}

/* prettier-ignore */
const resize: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 3, 2, 2, 2, 0,
  0, 3, 3, 1, 1, 1, 2, 0,
  0, 3, 1, 3, 1, 1, 2, 0,
  0, 2, 1, 1, 3, 1, 3, 0,
  0, 2, 1, 1, 1, 3, 3, 0,
  0, 2, 2, 2, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

/* prettier-ignore */
const saveMapsIcon: Tile = [
  0, 0, 0, 0, 0, 2, 0, 0,
  0, 0, 1, 3, 3, 1, 2, 0,
  0, 1, 3, 2, 2, 2, 2, 2,
  0, 3, 3, 2, 3, 3, 2, 0,
  0, 3, 3, 2, 3, 2, 3, 0,
  0, 1, 3, 2, 3, 3, 1, 0,
  0, 0, 1, 3, 3, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

/* prettier-ignore */
const loadMapsIcon: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  2, 2, 2, 2, 3, 1, 0, 0,
  0, 1, 3, 2, 3, 3, 1, 0,
  0, 2, 3, 2, 3, 2, 3, 0,
  0, 3, 2, 2, 2, 3, 3, 0,
  0, 1, 3, 2, 3, 3, 1, 0,
  0, 0, 1, 3, 3, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

/* prettier-ignore */
const loadTileSetIcon: Tile=[
  0, 0, 0, 0, 0, 0, 0, 0,
  2, 2, 2, 2, 3, 3, 3, 0,
  0, 3, 3, 2, 3, 3, 3, 0,
  0, 2, 3, 2, 3, 2, 3, 0,
  0, 3, 2, 2, 2, 3, 3, 0,
  0, 3, 3, 2, 3, 3, 3, 0,
  0, 3, 3, 3, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

/* prettier-ignore */
const saveTileSetIcon: Tile = [
  0, 0, 0, 0, 0, 2, 0, 0,
  0, 3, 3, 3, 3, 3, 2, 0,
  0, 3, 3, 2, 2, 2, 2, 2,
  0, 3, 3, 2, 3, 3, 2, 0,
  0, 3, 3, 2, 3, 2, 3, 0,
  0, 3, 3, 2, 3, 3, 3, 0,
  0, 3, 3, 3, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

/* prettier-ignore */
const exportToCIcon: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 2, 3, 3, 0, 0,
  0, 0, 2, 3, 0, 2, 3, 0,
  0, 0, 2, 3, 0, 0, 0, 0,
  0, 0, 2, 3, 0, 0, 0, 0,
  0, 0, 2, 3, 0, 2, 3, 0,
  0, 3, 0, 2, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];
