import { useCallback, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  mapEditorCanvasAtom,
  selectTileIndexAtom,
  mapTileIndexesAtom,
  isVisibleMapGridAtom,
} from "../../state";
import { createTileImage } from "../../utils/tileImage";

const TILE_SIZE = 16;
const MAP_TILES = 32;

export function MapEditor() {
  const tiles = useAtomValue(mapEditorCanvasAtom);
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);
  const selectedTileIndex = useAtomValue(selectTileIndexAtom);
  const setMapTileIndexes = useSetAtom(mapTileIndexesAtom);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const updateTile = useCallback(
    (tileX: number, tileY: number) => {
      if (tileX < 0 || tileX >= MAP_TILES || tileY < 0 || tileY >= MAP_TILES) {
        return;
      }

      const mapIndex = tileY * MAP_TILES + tileX;
      setMapTileIndexes((prev) => {
        const newIndexes = [...prev];
        newIndexes[mapIndex] = selectedTileIndex;
        return newIndexes;
      });
    },
    [selectedTileIndex, setMapTileIndexes]
  );

  return (
    <div
      className="grid relative bg-transparent"
      style={{
        gridTemplateColumns: `repeat(${MAP_TILES}, ${TILE_SIZE}px)`,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
      }}
    >
      {isGridVisible && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            backgroundImage: `linear-gradient(#00000044 1px, transparent 1px),
              linear-gradient(90deg, #00000044 1px, transparent 1px)`,
            backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
            pointerEvents: "none",
          }}
        />
      )}
      {tiles.map((tile, index) => {
        const tileX = index % MAP_TILES;
        const tileY = Math.floor(index / MAP_TILES);

        return (
          <img
            className="cursor-pointer hover:contrast-125"
            key={index}
            src={createTileImage(tile)}
            width={TILE_SIZE}
            height={TILE_SIZE}
            style={{ imageRendering: "pixelated" }}
            onMouseDown={() => updateTile(tileX, tileY)}
            onMouseOver={(e) => {
              if (isDrawing) {
                e.preventDefault();
                updateTile(tileX, tileY);
              }
            }}
            draggable={false}
          />
        );
      })}
    </div>
  );
}
