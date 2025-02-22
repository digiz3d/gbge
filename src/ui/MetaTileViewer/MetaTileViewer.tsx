import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  metaTilesAtom,
  currentTileSetTilesAtom,
  highlightMetaTilesAtom,
  currentSelectionAtom,
  currentMapIndexAtom,
} from "../../state";
import { createTileImage } from "../../utils/tileImage";

export function MetaTileViewer() {
  const metaTiles = useAtomValue(metaTilesAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const currentMapIndex = useAtomValue(currentMapIndexAtom);

  if (currentMapIndex === null) return null;

  return (
    <div className="grid grid-cols-2 w-[256px] h-fit">
      {metaTiles.map(({ spottedAt, spottedCount, tileIndexes }, index) => {
        const isActive =
          currentSelection.mode === "metaTile" &&
          index === currentSelection.index;

        const locallySpotted = spottedAt.get(currentMapIndex)?.length ?? 0;

        return (
          <div
            className={`relative h-[128px] w-[128px] ring grid grid-cols-2 grid-rows-2 cursor-pointer ${
              isActive ? "contrast-150" : ""
            }`}
            key={index}
            onClick={() => setCurrentSelection({ mode: "metaTile", index })}
            onMouseEnter={() =>
              setHoveringMetaTile(spottedAt.get(currentMapIndex) ?? [])
            }
            onMouseLeave={() => setHoveringMetaTile([])}
          >
            <div className="text-xs absolute bottom-1 right-1 text-white font-bold">
              {locallySpotted} [{spottedCount}]
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
