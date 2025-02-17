import { Color, MapEntity, pixelToRgb, Tile, TileSet } from "../state";

const MAX_CACHE_SIZE = 32 * 32;

const tileCache = new Map<string, string>();

export function createTileImage(tile: Tile): string {
  const cacheKey = tile.join(",");
  const cached = tileCache.get(cacheKey);
  if (cached) return cached;

  if (tileCache.size > MAX_CACHE_SIZE) {
    tileCache.clear();
  }

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

export function createMapImage(
  tileSize: number,
  map: MapEntity,
  tileSet: TileSet
): string {
  const canvas = document.createElement("canvas");
  canvas.width = map.size.width * tileSize;
  canvas.height = map.size.height * tileSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "";

  map.tilesIndexes.forEach((tileIndex, i) => {
    const tile = tileSet.tiles[tileIndex];
    const x = (i % map.size.width) * tileSize;
    const y = Math.floor(i / map.size.width) * tileSize;
    drawTile(ctx, tile, tileSize, x, y);
  });

  const dataUrl = canvas.toDataURL();
  return dataUrl;
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  tileSize: number,
  tileOffsetX: number,
  tileOffsetY: number
) {
  tile.forEach((pixel, index) => {
    const x = (index % 8) + tileOffsetX;
    const y = Math.floor(index / 8) + tileOffsetY;
    drawPixel(ctx, pixel, x, y, tileSize, tileSize);
  });
}

function drawPixel(
  ctx: CanvasRenderingContext2D,
  pixel: Color,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = pixelToRgb[pixel];
  ctx.fillRect(x, y, w, h);
}
