import { pixelToRgb } from "../state";

const MAX_CACHE_SIZE = 32 * 32;

const tileCache = new Map<string, string>();

export function createTileImage(pixels: number[]): string {
  if (tileCache.size > MAX_CACHE_SIZE) {
    tileCache.clear();
  }

  const cacheKey = pixels.join(",");

  const cached = tileCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  pixels.forEach((color, pixelIndex) => {
    const x = pixelIndex % 8;
    const y = Math.floor(pixelIndex / 8);
    ctx.fillStyle = pixelToRgb[color];
    ctx.fillRect(x, y, 1, 1);
  });

  const dataUrl = canvas.toDataURL();
  tileCache.set(cacheKey, dataUrl);
  return dataUrl;
}
