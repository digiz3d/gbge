import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createTileImage } from "../../utils/tileImage";
import {
  highlightMetaTilesAtom,
  hoveredMetaTileIndexAtom,
  metaTilesAtom,
} from "../../state/metatile";
import { currentTileSetTilesAtom } from "../../state/tileset";
import { currentMapIndexAtom, currentSelectionAtom } from "../../state/ui";
import { useLayoutEffect, useRef } from "react";

export function MetaTileViewer() {
  const metaTiles = useAtomValue(metaTilesAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesAtom);
  const setHoveredMetaTileIndex = useSetAtom(hoveredMetaTileIndexAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const currentMapIndex = useAtomValue(currentMapIndexAtom);
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
  }, [currentSelection.mode, currentSelection.index]);

  return (
    <div className="grow-1 shrink-0 basis-0 overflow-auto" ref={containerRef}>
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
              onClick={() =>
                setCurrentSelection({
                  mode: "metaTile",
                  index,
                  trigger: "manual",
                })
              }
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
  );
}
