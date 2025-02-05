import { useAtom, useAtomValue, WritableAtom } from "jotai";
import {
  isVisibleMapGridAtom,
  mapTileIndexesAtom,
  pixelToRgb,
  selectedTabIndexAtom,
  selectTileIndexAtom,
  tileSetsAtom,
} from "../../state";
import { useEffect, useMemo } from "react";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";

let isDrawing = false;

export function MapEditor() {
  const tab = useAtomValue(selectedTabIndexAtom);
  const index = useAtomValue(selectTileIndexAtom);
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);

  const mapTilesIndexes = useAtomValue(
    useMemo(() => {
      return splitAtom(mapTileIndexesAtom);
    }, [tab])
  );

  useEffect(() => {
    const globalMouseUp = () => {
      isDrawing = false;
    };
    window.addEventListener("mouseup", globalMouseUp);
    return () => {
      window.removeEventListener("mouseup", globalMouseUp);
    };
  }, []);

  return (
    <div
      className="grid grid-cols-32 grid-rows-32 w-fit h-fit"
      onMouseDown={(e) => {
        e.preventDefault();
        isDrawing = true;
      }}
    >
      {mapTilesIndexes.map((mapTileIndexAtom) => (
        <div className={isGridVisible ? "ring ring-[#00000044]" : ""}>
          <TileViewerButEvenSmaller
            key={`${mapTileIndexAtom}`}
            mapTileIndexAtom={mapTileIndexAtom}
            paintIndex={index}
          />
        </div>
      ))}
    </div>
  );
}

export function TileViewerButEvenSmaller({
  mapTileIndexAtom,
  paintIndex,
}: {
  mapTileIndexAtom: WritableAtom<number, [number], void>;
  paintIndex: number;
}) {
  const [mapTileIndex, setMapTileIndex] = useAtom(mapTileIndexAtom);
  const tab = useAtomValue(selectedTabIndexAtom);

  const tile = useAtomValue(
    useMemo(() => {
      return focusAtom(tileSetsAtom, (optic) =>
        optic.index(tab).prop("tiles").index(mapTileIndex)
      );
    }, [mapTileIndex])
  );

  if (!tile) return null;

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {tile.map((pixel, i) => (
        <div
          onClick={() => {
            setMapTileIndex(paintIndex);
          }}
          onMouseOver={(e) => {
            if (isDrawing) {
              e.preventDefault();
              setMapTileIndex(paintIndex);
            }
          }}
          className="h-[2px] w-[2px]"
          key={i}
          style={{
            backgroundColor: pixelToRgb[pixel],
          }}
        />
      ))}
    </div>
  );
}
