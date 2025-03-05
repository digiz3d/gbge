import { LRUCache } from "lru-cache";

import { MapEntity } from "../state/map";
import { Color, pixelToRgb, Tile, TileSet } from "../state/tiles";

export const mapImageCache = new LRUCache<string, string>({ max: 128 });
export const tileCanvasCache = new LRUCache<string, HTMLCanvasElement>({
  max: 128,
});
export const tileImageCache = new LRUCache<string, string>({ max: 128 });

const TILE_PIXEL_SIZE = 8;

export function createTileCanvas(tile: Tile): HTMLCanvasElement {
  const cacheKey = tile.join(",");
  const cached = tileCanvasCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create tile canvas");

  drawTile(ctx, tile, 0, 0);

  tileCanvasCache.set(cacheKey, canvas);
  return canvas;
}

export function createTileImage(tile: Tile): string {
  const cacheKey = tile.join(",");
  const canvas = createTileCanvas(tile);
  const dataUrl = canvas.toDataURL();
  tileImageCache.set(cacheKey, dataUrl);
  return dataUrl;
}

export function createMapImage(map: MapEntity, tileSet: TileSet): string {
  const cacheKey = `${JSON.stringify(map.tilesIndexes)}-${JSON.stringify(
    tileSet.name
  )}`;
  console.log(cacheKey);
  const cached = mapImageCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = map.size.width * TILE_PIXEL_SIZE;
  canvas.height = map.size.height * TILE_PIXEL_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  map.tilesIndexes.forEach((tileIndex, i) => {
    const tile = tileSet.tiles[tileIndex];
    const x = (i % map.size.width) * TILE_PIXEL_SIZE;
    const y = Math.floor(i / map.size.width) * TILE_PIXEL_SIZE;
    drawTile(ctx, tile, x, y);
  });

  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.stroke();

  const dataUrl = canvas.toDataURL();
  mapImageCache.set(cacheKey, dataUrl);
  canvas.remove();
  return dataUrl;
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  tileOffsetX: number,
  tileOffsetY: number
) {
  tile.forEach((pixel, index) => {
    const x = (index % TILE_PIXEL_SIZE) + tileOffsetX;
    const y = Math.floor(index / TILE_PIXEL_SIZE) + tileOffsetY;
    drawPixel(ctx, pixel, x, y);
  });
}

function drawPixel(
  ctx: CanvasRenderingContext2D,
  pixel: Color,
  x: number,
  y: number
) {
  ctx.fillStyle = pixelToRgb[pixel];
  ctx.fillRect(x, y, 1, 1);
}
