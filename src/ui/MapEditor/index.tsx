import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { createTileImage } from "../../utils/tileImage";
import {
  droppickMetaTileAtom,
  getMetaTilesIndexesForMapAtom,
  setMapTileIndexesFromMetaTileAtom,
} from "../../state/metatile";
import {
  mapSizeAtom,
  mapTilesAtom,
  setMapTileIndexesAtom,
} from "../../state/map";
import { currentSelectionAtom } from "../../state/ui";
import { TILE_SIZE } from "./constants";
import { LEFT_CLICK, RIGHT_CLICK } from "../../state/utils";
import { currentTileSetTilesAtom } from "../../state/tileset";
import { droppickTileAtom } from "../../state/tiles";

export function MapEditor() {
  const globalTiles = useAtomValue(currentTileSetTilesAtom);
  const mapTiles = useAtomValue(mapTilesAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const [isDrawing, setIsDrawing] = useState(false);
  const updateTileOnMap = useSetAtom(setMapTileIndexesAtom);
  const updateMetaTileOnMap = useSetAtom(setMapTileIndexesFromMetaTileAtom);
  const metaTiles = useAtomValue(getMetaTilesIndexesForMapAtom);
  const { width: MAP_TILES } = useAtomValue(mapSizeAtom);
  const droppickMetaTile = useSetAtom(droppickMetaTileAtom);
  const droppickTile = useSetAtom(droppickTileAtom);

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
    >
      {currentSelection.mode === "tile" &&
        mapTiles.map((tile, index) => {
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
              onMouseDown={(e) => {
                if (e.button === LEFT_CLICK) {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDrawing(true);
                  updateTileOnMap(tileX, tileY);
                } else if (e.button === RIGHT_CLICK) {
                  e.preventDefault();
                  e.stopPropagation();
                  droppickTile(tile);
                }
              }}
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
              onMouseDown={(e) => {
                if (e.button === LEFT_CLICK) {
                  e.preventDefault();
                  e.stopPropagation();
                  updateMetaTileOnMap(metaTileX, metaTileY);
                  setIsDrawing(true);
                } else if (e.button === RIGHT_CLICK) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentSelection.mode === "metaTile") {
                    droppickMetaTile(metaTile);
                  } else if (currentSelection.mode === "tile") {
                  }
                }
              }}
              onMouseOver={(e) => {
                if (isDrawing) {
                  e.preventDefault();
                  updateMetaTileOnMap(metaTileX, metaTileY);
                }
              }}
            >
              {metaTile.tileIndexes.map((tile, j) => (
                <img
                  key={j}
                  src={createTileImage(globalTiles[tile])}
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
