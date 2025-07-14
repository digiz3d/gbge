import { writeFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import { atom } from "jotai";
import { currentTileSetTilesAtom } from "../state/tileset";
import { mapsAtom } from "../state/map";
import { computeMetaTilesAtom } from "../state/metatile";
import { createTileCanvas } from "../utils/tileImage";

const filtersPNG = [{ name: "PNG file", extensions: ["png"] }];
const TILE_SIZE = 8;

export const exportToPNGAtom = atom(null, async (get, set) => {
  const tileSetTiles = get(currentTileSetTilesAtom);
  const maps = get(mapsAtom);
  set(computeMetaTilesAtom);

  const savePath = await save({
    filters: filtersPNG,
    defaultPath: "worldmap.png",
  });
  if (!savePath) return;

  let maxX = 0;
  let maxY = 0;
  let minX = Infinity;
  let minY = Infinity;
  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    maxX = Math.max(maxX, map.size.width + map.worldCoords.x);
    maxY = Math.max(maxY, map.size.height + map.worldCoords.y);
    minX = Math.min(minX, map.worldCoords.x);
    minY = Math.min(minY, map.worldCoords.y);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.canvas.width = (maxX - minX) * TILE_SIZE;
  ctx.canvas.height = (maxY - minY) * TILE_SIZE;

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    const { x, y } = map.worldCoords;
    for (let yy = 0; yy < map.size.height; yy++) {
      for (let xx = 0; xx < map.size.width; xx++) {
        const tileIndexInTileSet = map.tilesIndexes[yy * map.size.width + xx];
        const tileCanvas = createTileCanvas(tileSetTiles[tileIndexInTileSet]);
        ctx.drawImage(
          tileCanvas,
          (x + xx - minX) * TILE_SIZE,
          (y + yy - minY) * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }

  ctx.imageSmoothingEnabled = false;

  canvas.toBlob(async (blob) => {
    if (blob) {
      const buf = await blob.arrayBuffer();
      await writeFile(savePath, new Uint8Array(buf));
    }
  });
});
