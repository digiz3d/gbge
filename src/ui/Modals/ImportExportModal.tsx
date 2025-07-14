import { useSetAtom } from "jotai";
import { loadMapsAtom, saveMapsAtom } from "../../saves/save-maps";
import { BeltTileButton } from "../Toolbar/Belt/BeltTileButton";
import { Modal } from "./Modal";
import type { Tile } from "../../state/tiles";
import { loadTileSetsAtom, saveTileSetsAtom } from "../../saves/save-tileset";
import { exportToCAtom } from "../../saves/export-to-c";

export function ImportExportModal({
  close,
  isOpen,
}: {
  close: () => void;
  isOpen: boolean;
}) {
  if (!isOpen) return null;

  const loadMaps = useSetAtom(loadMapsAtom);
  const saveMaps = useSetAtom(saveMapsAtom);
  const loadTileSet = useSetAtom(loadTileSetsAtom);
  const saveTileSet = useSetAtom(saveTileSetsAtom);
  const exportToC = useSetAtom(exportToCAtom);

  return (
    <Modal onClick={close}>
      <div
        className="flex flex-col gap-2 max-w-64 bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Import/Export</h1>

        <button
          className="flex align-center gap-1 cursor-pointer"
          onClick={async () => {
            await loadMaps();
            close();
          }}
        >
          <BeltTileButton tile={loadMapsIcon} />
          <span className="self-center">Load maps</span>
        </button>

        <button
          className="flex align-center gap-1 cursor-pointer"
          onClick={async () => {
            await saveMaps();
            close();
          }}
        >
          <BeltTileButton tile={saveMapsIcon} />
          <span className="self-center">Save maps</span>
        </button>

        <button
          className="flex align-center gap-1 cursor-pointer"
          onClick={async () => {
            await loadTileSet();
            close();
          }}
        >
          <BeltTileButton tile={loadTileSetIcon} />
          <span className="self-center">Load tileset</span>
        </button>

        <button
          className="flex align-center gap-1 cursor-pointer"
          onClick={async () => {
            await saveTileSet();
            close();
          }}
        >
          <BeltTileButton tile={saveTileSetIcon} />
          <span className="self-center">Save tileset</span>
        </button>

        <button
          className="flex align-center gap-1 cursor-pointer"
          onClick={async () => {
            await exportToC();
            close();
          }}
        >
          <BeltTileButton tile={exportToCIcon} />
          <span className="self-center">Export to C</span>
        </button>
      </div>
    </Modal>
  );
}

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
