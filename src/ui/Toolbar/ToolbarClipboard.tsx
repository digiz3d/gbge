import { Belt } from "./Belt";
import { BeltTileButton } from "./Belt/BeltTileButton";
import { useAtomValue } from "jotai";
import { copiedTileAtom } from "../../state/clipboard";
import { Tile } from "../../state/tiles";

export function ToolbarClipboard() {
  const copiedTile = useAtomValue(copiedTileAtom);

  return (
    <div className="self-center">
      <Belt>
        <BeltTileButton onClick={() => {}} tile={copiedTile ?? emptyTile} />
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
