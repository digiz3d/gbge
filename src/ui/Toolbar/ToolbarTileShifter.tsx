import { Belt } from "./Belt/index.tsx";
import { shiftCurrentTileAtom, Tile } from "../../state/index.ts";
import { BeltTileButton } from "./Belt/BeltTileButton.tsx";
import { useSetAtom } from "jotai";
import { clockwise } from "../../state/shifting.ts";

export function ToolbarTileShifter() {
  const shift = useSetAtom(shiftCurrentTileAtom);

  return (
    <div className="self-center">
      <Belt>
        <BeltTileButton onClick={() => shift("right")} tile={leftArrow} />
        <BeltTileButton onClick={() => shift("left")} tile={rightArrow} />
        <BeltTileButton onClick={() => shift("up")} tile={upArrow} />
        <BeltTileButton onClick={() => shift("down")} tile={downArrow} />
        <BeltTileButton
          onClick={() => shift("clockwise")}
          tile={clockwiseArrow}
        />
      </Belt>
    </div>
  );
}

/* prettier-ignore */
const rightArrow: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 2, 0, 0, 2, 0, 0, 0,
  0, 0, 2, 0, 0, 2, 0, 0,
  0, 0, 0, 2, 0, 0, 2, 0,
  0, 0, 0, 2, 0, 0, 2, 0,
  0, 0, 2, 0, 0, 2, 0, 0,
  0, 2, 0, 0, 2, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];
const downArrow = clockwise(rightArrow);
const leftArrow = clockwise(downArrow);
const upArrow = clockwise(leftArrow);

/* prettier-ignore */
const clockwiseArrow: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 2, 2, 2, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 0, 0, 0,
  0, 0, 0, 0, 2, 0, 0, 0,
  0, 0, 2, 0, 2, 0, 2, 0,
  0, 0, 0, 2, 2, 2, 0,0,
  0, 0, 0, 0, 2, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];
