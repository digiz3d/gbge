import { Belt } from "./Belt/index.tsx";
import { shiftCurrentTileAtom, Tile } from "../../state/index.ts";
import { BeltTileButton } from "./Belt/BeltTileButton.tsx";
import { useSetAtom } from "jotai";

export function ToolbarTileShifter() {
  const shift = useSetAtom(shiftCurrentTileAtom);

  return (
    <div className="self-center">
      <Belt>
        <BeltTileButton onClick={() => shift("right")} tile={leftArrow} />
        <BeltTileButton onClick={() => shift("left")} tile={rightArrow} />
        <BeltTileButton onClick={() => shift("up")} tile={upArrow} />
        <BeltTileButton onClick={() => shift("down")} tile={downArrow} />
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
const leftArrow = rightArrow.slice().reverse();
const upArrow = rotateRight(leftArrow);
const downArrow = upArrow.slice().reverse();

function rotateRight(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = HEIGHT - 1 - y;
      let newY = x;
      let newIndex = newY * HEIGHT + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}
