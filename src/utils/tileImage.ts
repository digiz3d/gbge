import { LRUCache } from "lru-cache";

import { Color, pixelToRgb, Tile, TileSet } from "../state";
import { MapEntity } from "../state/map";

const tileCache = new LRUCache<string, string>({
  max: 1024,
});

const mapCache = new LRUCache<string, string>({
  max: 128,
});

const TILE_PIXEL_SIZE = 8;

export function createTileImage(tile: Tile): string {
  const cacheKey = tile.join(",");
  const cached = tileCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  tile.forEach((pixel, index) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    ctx.fillStyle = pixelToRgb[pixel];
    ctx.fillRect(x, y, 1, 1);
  });

  const dataUrl = canvas.toDataURL();
  tileCache.set(cacheKey, dataUrl);
  return dataUrl;
}

export function createMapImage(map: MapEntity, tileSet: TileSet): string {
  const cacheKey = `${JSON.stringify(map.tilesIndexes)}-${JSON.stringify(
    tileSet
  )}`;
  const cached = mapCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = map.size.width * TILE_PIXEL_SIZE;
  canvas.height = map.size.height * TILE_PIXEL_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
  mapCache.set(cacheKey, dataUrl);
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
