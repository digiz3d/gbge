import { Belt } from "./Belt/index.tsx";
import { BeltTileButton } from "./Belt/BeltTileButton.tsx";
import { useAtomValue } from "jotai";
import { copiedTileAtom, Tile } from "../../state/index.ts";

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
