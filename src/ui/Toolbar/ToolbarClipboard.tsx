import { Belt } from "./Belt";
import { BeltTileButton } from "./Belt/BeltTileButton";
import { useAtomValue } from "jotai";
import { copiedTilesAtom } from "../../state/clipboard";
import { Tile } from "../../state/tiles";
import { tileSetsAtom } from "../../state/tileset";
import { selectedTileSetTabIndexAtom } from "../../state/ui";

export function ToolbarClipboard() {
  const copiedTile = useAtomValue(copiedTilesAtom);
  const tileSetIndex = useAtomValue(selectedTileSetTabIndexAtom);
  const tileSets = useAtomValue(tileSetsAtom);

  const tileIndex = copiedTile?.tilesIndexes[0];

  return (
    <div className="self-center">
      <Belt>
        <BeltTileButton
          onClick={() => {}}
          tile={
            tileIndex !== undefined
              ? tileSets[tileSetIndex].tiles[tileIndex]
              : emptyTile
          }
        />
      </Belt>
    </div>
  );
}

/* prettier-ignore */
const emptyTile: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];
