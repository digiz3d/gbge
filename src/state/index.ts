import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import * as shifting from "./shifting";

const colorPalette: { r: number; g: number; b: number }[] = [
  { r: 155, g: 188, b: 15 },
  { r: 129, g: 162, b: 15 }, // original { r: 139, g: 172, b: 15 }
  { r: 48, g: 98, b: 48 },
  { r: 15, g: 36, b: 15 }, // original { r: 15, g: 56, b: 15 }
];

export const pixelToRgb = colorPalette.map(
  (color) => `rgb(${color.r}, ${color.g}, ${color.b})`
);

export type Color = 0 | 1 | 2 | 3;
export type Tile = Color[];
export type TileSet = { filename: string; tiles: Tile[] };

function n<T>(length: number, value: T | (() => T)): T[] {
  return Array(length)
    .fill(null)
    .map(() => (typeof value === "function" ? (value as () => T)() : value));
}

const LS_tileSetInitialValue = localStorage.getItem("tileSetInitialValue");
console.log("LS_tileSetInitialValue", LS_tileSetInitialValue);
const tileSetInitialValue: TileSet[] = LS_tileSetInitialValue
  ? JSON.parse(LS_tileSetInitialValue)
  : [{ filename: "string.tileset", tiles: n(128, () => n<Color>(64, 0)) }];

export const tileSetsAtom = atom<TileSet[]>(tileSetInitialValue);

const LS_mapTileIndexesInitialValue = localStorage.getItem(
  "mapTileIndexesInitialValue"
);
console.log("LS_mapTileIndexesInitialValue", LS_mapTileIndexesInitialValue);
const mapTileIndexesInitialValue: number[] = LS_mapTileIndexesInitialValue
  ? JSON.parse(LS_mapTileIndexesInitialValue)
  : n(32 * 32, 0);

export const mapTileIndexesAtom = atom<number[]>(mapTileIndexesInitialValue);
export const mapMetaTilesTileIndexesAtom = atom<
  [number, number, number, number][]
>([]);

// UI settings
export const selectedTabIndexAtom = atom(0);
export const selectTileIndexAtom = atom(0);
export const selectedPaintIndexAtom = atom<Color>(0);
export const isVisibleMapGridAtom = atom(true);
export const isVisibleMapOverlayAtom = atom(true);

// derived data
export const mapEditorCanvasAtom = atom((get) => {
  const mapTileIndexes = get(mapTileIndexesAtom);
  const tileSets = get(tileSetsAtom);

  return mapTileIndexes.map((tileIndex) => {
    const tileSetIndex = Math.floor(tileIndex / 64);
    const tileIndexInSet = tileIndex % 64;
    const tileSet = tileSets[tileSetIndex];
    return tileSet.tiles[tileIndexInSet];
  });
});

export const metaTilesAtom = atom((get) => {
  const currentTileSetIndex = get(selectedTabIndexAtom);
  const tileSets = get(tileSetsAtom);

  const tileSet = tileSets[currentTileSetIndex];
  return tileSet.tiles;
});

// utils
export const shiftCurrentTileAtom = atom(
  null,
  (
    get,
    set,
    shiftDirection: "left" | "right" | "up" | "down" | "clockwise"
  ) => {
    const tab = get(selectedTabIndexAtom);
    const index = get(selectTileIndexAtom);

    const focusedTile = focusAtom(tileSetsAtom, (optic) =>
      optic.index(tab).prop("tiles").index(index)
    );
    const t = get(focusedTile);
    if (!t) return;

    switch (shiftDirection) {
      case "left":
        set(focusedTile, shifting.shiftLeft(t));
        break;
      case "right":
        set(focusedTile, shifting.shiftRight(t));
        break;
      case "up":
        set(focusedTile, shifting.shiftUp(t));
        break;
      case "down":
        set(focusedTile, shifting.shiftDown(t));
        break;
      case "clockwise":
        set(focusedTile, shifting.clockwise(t));
        break;
    }
  }
);

export const computeMetaTilesAtom = atom(null, async (get, set) => {
  const mapTileIndexes = get(mapTileIndexesAtom);

  const metaTileCache = new Map<string, [number, number, number, number]>();
  const MAP_TILES_SQUARED = 32;
  const metaTiles: [number, number, number, number][] = [];

  for (let i = 0; i < mapTileIndexes.length; i += 2) {
    if (i != 0 && i % MAP_TILES_SQUARED === 0) {
      i += MAP_TILES_SQUARED;
      if (i >= mapTileIndexes.length) {
        break;
      }
    }

    const index1 = mapTileIndexes[i];
    const index2 = mapTileIndexes[i + 1];
    const index3 = mapTileIndexes[i + MAP_TILES_SQUARED];
    const index4 = mapTileIndexes[i + 1 + MAP_TILES_SQUARED];

    const key = `${index1}-${index2}-${index3}-${index4}`;
    console.log("key", key);
    if (metaTileCache.has(key)) {
      continue;
    }
    metaTileCache.set(key, [index1, index2, index3, index4]);
    metaTiles.push(metaTileCache.get(key)!);
  }

  console.log("metaTiles", metaTiles);

  set(mapMetaTilesTileIndexesAtom, metaTiles);
});
