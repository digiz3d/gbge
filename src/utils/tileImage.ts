import { pixelToRgb, Tile } from "../state";

const MAX_CACHE_SIZE = 32 * 32;

const tileCache = new Map<string, string>();

export function createTileImage(tile: Tile): string {
  if (tileCache.size > MAX_CACHE_SIZE) {
    tileCache.clear();
  }

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
