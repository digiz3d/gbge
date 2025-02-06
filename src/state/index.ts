import { atom } from "jotai";

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

export const tileSetsAtom = atom<TileSet[]>([
  { filename: "string.tileset", tiles: n(128, () => n<Color>(64, 0)) },
]);

export const mapTileIndexesAtom = atom<number[]>(n(32 * 32, 0));

export const selectedTabIndexAtom = atom(0);
export const selectTileIndexAtom = atom(0);
export const selectedPaintIndexAtom = atom<Color>(0);

// map settings
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
