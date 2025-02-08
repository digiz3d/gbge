import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  metaTilesAtom,
  currentTileSetTilesAtom,
  highlightMetaTilesAtom,
} from "../../state";
import { createTileImage } from "../../utils/tileImage";

export function MetaTileViewer() {
  const metaTilesTileIndexes = useAtomValue(metaTilesAtom);
  const tiles = useAtomValue(currentTileSetTilesAtom);
  const setHoveringMetaTile = useSetAtom(highlightMetaTilesAtom);

  return (
    <div>
      <div>
        Meta tiles:{" "}
        {metaTilesTileIndexes.length ? metaTilesTileIndexes.length : "?"}
      </div>
      <div className="grid grid-cols-2 w-[256px] h-fit">
        {metaTilesTileIndexes.map(({ tileIndexes, spottedAtMapIndex }, i) => (
          <div
            onMouseEnter={() => setHoveringMetaTile(spottedAtMapIndex)}
            onMouseLeave={() => setHoveringMetaTile([])}
            className="h-[128px] w-[128px] ring grid grid-cols-2 grid-rows-2"
            key={i}
          >
            {tileIndexes.map((tileIndex, j) => (
              <img
                style={{ imageRendering: "pixelated" }}
                className="h-[64px] w-[64px]"
                src={createTileImage(tiles[tileIndex])}
                key={`${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
