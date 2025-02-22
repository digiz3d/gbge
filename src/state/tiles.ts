import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import * as shifting from "./tiles-shifting";
import { currentSelectionAtom, selectedTabIndexAtom } from "./ui";
import { tileSetsAtom } from "./tileset";

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
export type TileSet = { name: string; tiles: Tile[] };

export const shiftCurrentTileAtom = atom(
  null,
  (
    get,
    set,
    shiftDirection: "left" | "right" | "up" | "down" | "clockwise"
  ) => {
    const tab = get(selectedTabIndexAtom);
    const currentSelection = get(currentSelectionAtom);
    if (currentSelection.mode !== "tile") return;

    const { index } = currentSelection;
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
