import { atom } from "jotai";

export const colorPalette: { r: number; g: number; b: number }[] = [
  { r: 155, g: 188, b: 15 },
  { r: 129, g: 162, b: 15 }, // original { r: 139, g: 172, b: 15 }
  { r: 48, g: 98, b: 48 },
  { r: 15, g: 36, b: 15 }, // original { r: 15, g: 56, b: 15 }
];

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

export const selectedTabIndexAtom = atom(0);
export const selectTileIndexAtom = atom(0);
