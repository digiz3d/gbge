import { Belt } from "./Belt/index.tsx";
import { pixelToRgb, Tile } from "../../state/index.ts";
import { useAtom } from "jotai";
import { BeltTileButton } from "./Belt/BeltTileButton.tsx";
import {
  areMapIdsVisibleAtom,
  isVisibleMapGridAtom,
  isVisibleMapOverlayAtom,
} from "../../state/ui.ts";

export function ToolbarMapEditor() {
  const [isGridVisible, toggleGrid] = useAtom(isVisibleMapGridAtom);
  const [isOverlayVisible, toggleScreen] = useAtom(isVisibleMapOverlayAtom);
  const [areMapIdsVisible, toggleMapIDs] = useAtom(areMapIdsVisibleAtom);

  return (
    <div className="self-center">
      <Belt>
        <BeltTileButton
          tile={grid}
          onClick={toggleGrid}
          colors={
            isGridVisible
              ? undefined
              : [pixelToRgb[0], pixelToRgb[0], pixelToRgb[0], pixelToRgb[1]]
          }
        />
        <BeltTileButton
          tile={screen}
          onClick={toggleScreen}
          colors={
            isOverlayVisible ? [pixelToRgb[0], "rgb(255,0,0)"] : undefined
          }
        />
        <BeltTileButton
          tile={ID}
          onClick={toggleMapIDs}
          colors={
            areMapIdsVisible
              ? undefined
              : [pixelToRgb[0], pixelToRgb[0], pixelToRgb[0], pixelToRgb[1]]
          }
        />
      </Belt>
    </div>
  );
}

/* prettier-ignore */
const grid: Tile = [
  0, 0, 3, 0, 0, 3, 0, 0,
  0, 0, 3, 0, 0, 3, 0, 0,
  3, 3, 3, 3, 3, 3, 3, 3,
  0, 0, 3, 0, 0, 3, 0, 0,
  0, 0, 3, 0, 0, 3, 0, 0,
  3, 3, 3, 3, 3, 3, 3, 3,
  0, 0, 3, 0, 0, 3, 0, 0,
  0, 0, 3, 0, 0, 3, 0, 0,
];

/* prettier-ignore */
const screen: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 0, 0, 0, 0, 1, 0,
  0, 1, 0, 0, 0, 0, 1, 0,
  0, 1, 0, 0, 0, 0, 1, 0,
  0, 1, 0, 0, 0, 0, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];

/* prettier-ignore */
const ID: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 0, 3, 3, 3, 0, 0,
  0, 3, 0, 3, 0, 0, 3, 0,
  0, 3, 0, 3, 0, 0, 3, 0,
  0, 3, 0, 3, 0, 0, 3, 0,
  0, 3, 0, 3, 0, 0, 3, 0,
  0, 3, 0, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];
