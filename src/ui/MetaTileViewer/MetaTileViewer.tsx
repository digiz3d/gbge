import { useAtomValue } from "jotai";
import { mapMetaTilesTileIndexesAtom, metaTilesAtom } from "../../state";
import { createTileImage } from "../../utils/tileImage";

export function MetaTileViewer() {
  const metaTilesTileIndexes = useAtomValue(mapMetaTilesTileIndexesAtom);
  const tiles = useAtomValue(metaTilesAtom);

  return (
    <div>
      <div>
        Meta tiles:{" "}
        {metaTilesTileIndexes.length ? metaTilesTileIndexes.length : "?"}
      </div>
      <div className="grid grid-cols-2 grid-rows-16 w-[256px] h-fit">
        {metaTilesTileIndexes.map((tileIndexes, i) => (
          <div
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
