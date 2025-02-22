import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentSelectionAtom, currentMapIndexAtom } from "../../state";
import { createTileImage } from "../../utils/tileImage";
import {
  highlightMetaTilesAtom,
  hoveredMetaTileIndexAtom,
  metaTilesAtom,
} from "../../state/metatile";
import { currentTileSetTilesAtom } from "../../state/tileset";

export function MetaTileViewer() {
  const metaTiles = useAtomValue(metaTilesAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesAtom);
  const setHoveredMetaTileIndex = useSetAtom(hoveredMetaTileIndexAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const currentMapIndex = useAtomValue(currentMapIndexAtom);

  return (
    <div className="grid grid-cols-2 w-[256px] h-fit">
      {metaTiles.map(({ spottedAt, spottedCount, tileIndexes }, index) => {
        const isActive =
          currentSelection.mode === "metaTile" &&
          index === currentSelection.index;

        const locallySpotted = currentMapIndex
          ? spottedAt.get(currentMapIndex) ?? null
          : null;

        const locallySpottedLen = locallySpotted?.length ?? 0;

        return (
          <div
            className={`relative h-[128px] w-[128px] ring grid grid-cols-2 grid-rows-2 cursor-pointer ${
              isActive ? "contrast-150" : ""
            }`}
            key={index}
            onClick={() => setCurrentSelection({ mode: "metaTile", index })}
            onMouseEnter={() => {
              setHoveredMetaTileIndex(index);
              setHoveringMetaTile(locallySpotted ?? []);
            }}
            onMouseLeave={() => {
              setHoveredMetaTileIndex(null);
              setHoveringMetaTile([]);
            }}
          >
            <div className="text-xs absolute bottom-1 text-white font-bold flex flex-row justify-between w-full">
              <div className="text ml-1">
                {locallySpotted ? locallySpottedLen : null}
              </div>

              <div className="mr-1">{spottedCount}</div>
            </div>
            {tileIndexes.map((tileIndex, j) => (
              <img
                style={{ imageRendering: "pixelated" }}
                className="h-[64px] w-[64px]"
                src={createTileImage(tiles[tileIndex])}
                key={`${index}-${j}`}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
