import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { currentSelectionAtom, selectedTabIndexAtom } from "./ui";
import { currentTileSetTilesAtom, tileSetsAtom } from "./tileset";

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
        set(focusedTile, shiftLeft(t));
        break;
      case "right":
        set(focusedTile, shiftRight(t));
        break;
      case "up":
        set(focusedTile, shiftUp(t));
        break;
      case "down":
        set(focusedTile, shiftDown(t));
        break;
      case "clockwise":
        set(focusedTile, clockwise(t));
        break;
    }
  }
);

function shiftLeft(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = (x + 1) % WIDTH;
      let newY = y;
      let newIndex = newY * HEIGHT + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

function shiftRight(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = (x - 1 + WIDTH) % WIDTH;
      let newY = y;
      let newIndex = newY * HEIGHT + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

function shiftUp(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = x;
      let newY = (y - 1 + HEIGHT) % HEIGHT;
      let newIndex = newY * WIDTH + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

function shiftDown(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = x;
      let newY = (y + 1) % HEIGHT;
      let newIndex = newY * WIDTH + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

export function clockwise(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = HEIGHT - 1 - y;
      let newY = x;
      let newIndex = newY * HEIGHT + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

export const droppickTileAtom = atom(null, (get, set, tile: Tile) => {
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode !== "tile") return;

  const tiles = get(currentTileSetTilesAtom);
  const index = tiles.findIndex((t) => t === tile);

  set(currentSelectionAtom, { mode: "tile", index });
});
