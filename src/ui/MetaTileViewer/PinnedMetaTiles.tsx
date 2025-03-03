import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createTileImage } from "../../utils/tileImage";
import {
  highlightMetaTilesIndexesAtom,
  hoveredMetaTileIndexAtom,
  metaTilesAtom,
} from "../../state/metatile";
import { currentTileSetTilesAtom } from "../../state/tileset";
import {
  currentEditedMapIndexAtom,
  currentSelectionAtom,
} from "../../state/ui";
import {
  pinnedMetaTileIndexesAtom,
  togglePinnedMetaTileAtom,
} from "../../state/metatiles-pinned";
import { LEFT_CLICK, RIGHT_CLICK } from "../../state/utils";

export function PinnedMetaTiles() {
  const metaTiles = useAtomValue(metaTilesAtom);
  const pinnedMetaTileIndexes = useAtomValue(pinnedMetaTileIndexesAtom);
  const togglePinnedMetaTile = useSetAtom(togglePinnedMetaTileAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesIndexesAtom);
  const setHoveredMetaTileIndex = useSetAtom(hoveredMetaTileIndexAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const currentMapIndex = useAtomValue(currentEditedMapIndexAtom);

  if (pinnedMetaTileIndexes.length === 0) return null;

  return (
    <div className="grid grid-cols-4 w-[256px] h-fit mb-4">
      {pinnedMetaTileIndexes.map((index) => {
        const isSelected =
          currentSelection.mode === "metaTile" &&
          index === currentSelection.index;

        const metaTile = metaTiles[index];

        const locallySpotted =
          currentMapIndex !== null
            ? metaTile.spottedAt.get(currentMapIndex) ?? null
            : null;

        const { tileIndexes } = metaTile;

        return (
          <div
            className={`relative h-[64px] w-[64px] ring grid grid-cols-2 grid-rows-2 cursor-pointer ${
              isSelected ? "contrast-150" : ""
            }`}
            key={index}
            onMouseDown={(e) => {
              if (e.button === LEFT_CLICK) {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSelection({
                  mode: "metaTile",
                  index,
                  trigger: "manual",
                  tool: "brush",
                });
              } else if (e.button === RIGHT_CLICK) {
                e.preventDefault();
                e.stopPropagation();
                togglePinnedMetaTile(index);
              }
            }}
            onMouseEnter={() => {
              setHoveredMetaTileIndex(index);
              setHoveringMetaTile(locallySpotted ?? []);
            }}
            onMouseLeave={() => {
              setHoveredMetaTileIndex(null);
              setHoveringMetaTile([]);
            }}
          >
            {tileIndexes.map((tileIndex, j) => (
              <img
                style={{ imageRendering: "pixelated" }}
                className="h-[32px] w-[32px]"
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
