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
import { useLayoutEffect, useRef } from "react";
import { togglePinnedMetaTileAtom } from "../../state/metatiles-pinned";
import { LEFT_CLICK, RIGHT_CLICK } from "../../state/utils";
import { PinnedMetaTiles } from "./PinnedMetaTiles";

export function MetaTileViewer() {
  const metaTiles = useAtomValue(metaTilesAtom);
  const togglePinnedMetaTile = useSetAtom(togglePinnedMetaTileAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesIndexesAtom);
  const setHoveredMetaTileIndex = useSetAtom(hoveredMetaTileIndexAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const currentMapIndex = useAtomValue(currentEditedMapIndexAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (currentSelection.mode !== "metaTile") return;
    if (currentSelection.trigger === "manual") return;

    const halfTileHeight = 128 / 2;
    const top =
      ((currentSelection.index - (currentSelection.index % 2)) * 128) / 2 -
      halfTileHeight;

    containerRef.current.scrollTo({
      top,
      behavior: "smooth",
    });
  }, [currentSelection]);

  return (
    <div className="grow-1 shrink-0 basis-0 flex flex-col">
      <PinnedMetaTiles />
      <div
        className="overflow-y-scroll grow-1 shrink-0 basis-0"
        ref={containerRef}
      >
        <div className="grid grid-cols-2 w-[256px] h-fit">
          {metaTiles.map(({ spottedAt, spottedCount, tileIndexes }, index) => {
            const isSelected =
              currentSelection.mode === "metaTile" &&
              index === currentSelection.index;

            const locallySpotted =
              currentMapIndex !== null
                ? spottedAt.get(currentMapIndex) ?? null
                : null;

            const locallySpottedLen = locallySpotted?.length ?? 0;

            return (
              <div
                className={`relative h-[128px] w-[128px] ring grid grid-cols-2 grid-rows-2 cursor-pointer ${
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
      </div>
    </div>
  );
}
