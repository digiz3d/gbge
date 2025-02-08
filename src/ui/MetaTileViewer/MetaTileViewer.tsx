import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  metaTilesAtom,
  currentTileSetTilesAtom,
  highlightMetaTilesAtom,
  currentSelectionAtom,
} from "../../state";
import { createTileImage } from "../../utils/tileImage";

export function MetaTileViewer() {
  const metaTilesTileIndexes = useAtomValue(metaTilesAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);

  return (
    <div className="grid grid-cols-2 w-[256px] h-fit">
      {metaTilesTileIndexes.map(({ tileIndexes, spottedAtMapIndex }, index) => (
        <div
          className={`h-[128px] w-[128px] ring grid grid-cols-2 grid-rows-2 cursor-pointer ${
            currentSelection.mode === "metaTile" &&
            index === currentSelection.index
              ? "contrast-150"
              : ""
          }`}
          key={index}
          onClick={() => setCurrentSelection({ mode: "metaTile", index })}
          onMouseEnter={() => setHoveringMetaTile(spottedAtMapIndex)}
          onMouseLeave={() => setHoveringMetaTile([])}
        >
          {tileIndexes.map((tileIndex, j) => (
            <img
              style={{ imageRendering: "pixelated" }}
              className="h-[64px] w-[64px]"
              src={createTileImage(tiles[tileIndex])}
              key={`${index}-${j}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
