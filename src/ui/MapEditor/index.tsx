import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  mapEditorCanvasAtom,
  currentSelectionAtom,
  setMapTileIndexesFromMetaTileAtom,
  setMapTileIndexesAtom,
  getMetaTilesForMapAtom,
  mapSizeAtom,
} from "../../state";
import { createTileImage } from "../../utils/tileImage";

const TILE_SIZE = 16;

export function MapEditor() {
  const tiles = useAtomValue(mapEditorCanvasAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const [isDrawing, setIsDrawing] = useState(false);
  const updateTileOnMap = useSetAtom(setMapTileIndexesAtom);
  const updateMetaTileOnMap = useSetAtom(setMapTileIndexesFromMetaTileAtom);
  const metaTiles = useAtomValue(getMetaTilesForMapAtom);
  const { width: MAP_TILES } = useAtomValue(mapSizeAtom);
  useEffect(() => {
    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isDrawing]);

  return (
    <div
      className="grid relative"
      style={{
        gridTemplateColumns: `repeat(${
          currentSelection.mode === "tile" ? MAP_TILES : MAP_TILES / 2
        }, ${currentSelection.mode === "tile" ? TILE_SIZE : TILE_SIZE * 2}px)`,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
      }}
    >
      {currentSelection.mode === "tile" &&
        tiles.map((tile, index) => {
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
              onMouseDown={() => updateTileOnMap(tileX, tileY)}
              onMouseOver={(e) => {
                if (isDrawing) {
                  e.preventDefault();
                  updateTileOnMap(tileX, tileY);
                }
              }}
              draggable={false}
            />
          );
        })}
      {currentSelection.mode === "metaTile" &&
        metaTiles.map((metaTile, index) => {
          const halfMapTiles = MAP_TILES / 2;
          const metaTileX = index % halfMapTiles;
          const metaTileY = Math.floor(index / halfMapTiles);

          return (
            <div
              key={index}
              className="cursor-pointer grid grid-rows-2 grid-cols-2 hover:contrast-125"
              style={{
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 2,
              }}
              onMouseDown={() => updateMetaTileOnMap(metaTileX, metaTileY)}
              onMouseOver={(e) => {
                if (isDrawing) {
                  e.preventDefault();
                  updateMetaTileOnMap(metaTileX, metaTileY);
                }
              }}
            >
              {metaTile.map((tile, j) => (
                <img
                  key={j}
                  src={createTileImage(tile)}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  style={{ imageRendering: "pixelated" }}
                  draggable={false}
                />
              ))}
            </div>
          );
        })}
    </div>
  );
}
