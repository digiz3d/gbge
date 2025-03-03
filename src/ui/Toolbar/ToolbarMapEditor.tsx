import { Belt } from "./Belt";
import { useAtom } from "jotai";
import { BeltTileButton } from "./Belt/BeltTileButton";
import {
  areMapIdsVisibleAtom,
  currentSelectionAtom,
  isVisibleMapGridAtom,
  isVisibleZoneAtom,
} from "../../state/ui";
import { pixelToRgb, Tile } from "../../state/tiles";

export function ToolbarMapEditor() {
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const [isGridVisible, toggleGrid] = useAtom(isVisibleMapGridAtom);
  const [isOverlayVisible, toggleScreen] = useAtom(isVisibleZoneAtom);
  const [areMapIdsVisible, toggleMapIDs] = useAtom(areMapIdsVisibleAtom);

  return (
    <div className="self-center flex flex-row gap-2">
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
      <div className="self-center">
        <Belt>
          <BeltTileButton
            tile={brush}
            onClick={() => {
              setCurrentSelection((x) => {
                const tool = "brush";
                const trigger = "manual";
                if (x.mode === "tile" || x.mode === "metaTile") {
                  return { index: x.index, mode: x.mode, tool, trigger };
                }
                return { index: 0, mode: "tile", tool, trigger };
              });
            }}
            colors={
              currentSelection.tool === "brush"
                ? undefined
                : [pixelToRgb[0], pixelToRgb[1], pixelToRgb[1], pixelToRgb[1]]
            }
          />

          {/* <BeltTileButton
            tile={bucket}
            onClick={() => {
              setCurrentSelection((x) => {
                if (x.mode === "tile") {
                  return {
                    index: x.index,
                    mode: x.mode,
                    tool: "bucket",
                    trigger: "manual",
                  };
                }
                return {
                  index: 0,
                  mode: "tile",
                  tool: "bucket",
                  trigger: "manual",
                };
              });
            }}
            colors={
              currentSelection.tool === "bucket"
                ? undefined
                : [pixelToRgb[0], pixelToRgb[0], pixelToRgb[1], pixelToRgb[0]]
            }
          /> */}

          <BeltTileButton
            tile={selection}
            onClick={() => {
              setCurrentSelection(() => ({
                indexes: [],
                mode: "mapTiles",
                tool: "selection",
                trigger: "manual",
                width: 0,
              }));
            }}
            colors={
              currentSelection.tool === "selection"
                ? undefined
                : [pixelToRgb[0], pixelToRgb[0], pixelToRgb[0], pixelToRgb[1]]
            }
          />
        </Belt>
      </div>
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

// /* prettier-ignore */
// const bucket: Tile = [
//   0, 0, 0, 0, 2, 0, 0, 0,
//   0, 0, 0, 2, 2, 0, 0, 0,
//   0, 0, 2, 2, 2, 2, 0, 0,
//   0, 0, 2, 2, 2, 2, 0, 0,
//   0, 2, 2, 2, 2, 2, 2, 0,
//   0, 2, 2, 2, 2, 2, 2, 0,
//   0, 0, 2, 2, 2, 2, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
// ];

/* prettier-ignore */
const brush: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0, 
  0, 3, 2, 2, 2, 2, 3, 0, 
  0, 3, 2, 2, 2, 2, 3, 0, 
  0, 3, 0, 0, 0, 0, 3, 0, 
  0, 3, 3, 3, 3, 3, 3, 0, 
  0, 0, 0, 3, 3, 0, 0, 0, 
  0, 0, 0, 3, 3, 0, 0, 0, 
  0, 0, 0, 3, 3, 0, 0, 0, 
];

/* prettier-ignore */
const selection: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0, 
  0, 3, 3, 3, 3, 0, 0, 0, 
  0, 3, 0, 0, 0, 0, 0, 0, 
  0, 3, 0, 0, 0, 0, 3, 0, 
  0, 3, 0, 0, 0, 0, 3, 0, 
  0, 0, 0, 0, 0, 0, 3, 0, 
  0, 0, 0, 3, 3, 3, 3, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 
];
