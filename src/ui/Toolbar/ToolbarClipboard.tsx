import { Belt } from "./Belt";
import { BeltTileButton } from "./Belt/BeltTileButton";
import { useAtomValue } from "jotai";
import { copiedTilesAtom } from "../../state/clipboard";
import { Tile } from "../../state/tiles";

export function ToolbarClipboard() {
  const copiedTile = useAtomValue(copiedTilesAtom);

  return (
    <div className="self-center">
      <Belt>
        <BeltTileButton
          onClick={() => {}}
          tile={copiedTile?.[0] ?? emptyTile}
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
