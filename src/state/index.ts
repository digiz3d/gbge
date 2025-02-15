import { atom, ExtractAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";

import * as shifting from "./shifting";
import { resizeColumns, resizeRows } from "./map";

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

const DEFAULT_MAP_SIZE = { width: 32, height: 32 };

export const mapSizeAtom = atom<{ width: number; height: number }>(
  DEFAULT_MAP_SIZE
);

export const resizeMapAtom = atom(
  null,
  (get, set, width: number, height: number) => {
    const { width: currentWidth, height: currentHeight } = get(mapSizeAtom);
    if (width === currentWidth && height === currentHeight) return;

    const arr = get(mapTileIndexesAtom);

    // resize rows first as they have no impact on width/nb of columns
    // the opposite is true for columns
    const newArray = resizeRows(arr, currentWidth, height);
    const newArray2 = resizeColumns(newArray, currentWidth, width);

    set(mapTileIndexesAtom, newArray2);
    set(mapSizeAtom, { width, height });
    set(computeMetaTilesAtom);
  }
);

export function n<T>(length: number, value: T | (() => T)): T[] {
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
  : n(DEFAULT_MAP_SIZE.width * DEFAULT_MAP_SIZE.height, 0);

export const mapTileIndexesAtom = atom<number[]>(mapTileIndexesInitialValue);
export const setMapTileIndexesAtom = atom(
  null,
  (get, set, tileX: number, tileY: number) => {
    const currentSelection = get(currentSelectionAtom);
    const { height: MAP_HEIGHT, width: MAP_WIDTH } = get(mapSizeAtom);

    if (currentSelection.mode !== "tile") return;
    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
      return;
    }

    const mapIndex = tileY * MAP_WIDTH + tileX;
    set(mapTileIndexesAtom, (prev) => {
      const newIndexes = [...prev];
      newIndexes[mapIndex] = currentSelection.index;
      return newIndexes;
    });
  }
);

export const setMapTileIndexesFromMetaTileAtom = atom(
  null,
  (get, set, metaTileX: number, metaTileY: number) => {
    const currentSelection = get(currentSelectionAtom);
    if (currentSelection.mode !== "metaTile") return;

    const { width: MAP_WIDTH } = get(mapSizeAtom);
    const metaTileIndexes = get(metaTilesAtom);
    const selectedMetaTile = metaTileIndexes[currentSelection.index];
    const [i1, i2, i3, i4] = selectedMetaTile.tileIndexes;

    const baseX = metaTileX * 2;
    const baseY = metaTileY * 2;

    const clickedMapTileIndex1 = baseX + baseY * MAP_WIDTH;
    const clickedMapTileIndex2 = baseX + 1 + baseY * MAP_WIDTH;
    const clickedMapTileIndex3 = baseX + baseY * MAP_WIDTH + MAP_WIDTH;
    const clickedMapTileIndex4 = baseX + 1 + baseY * MAP_WIDTH + MAP_WIDTH;

    const focusedTile1 = focusAtom(mapTileIndexesAtom, (optic) =>
      optic.index(clickedMapTileIndex1)
    );
    const focusedTile2 = focusAtom(mapTileIndexesAtom, (optic) =>
      optic.index(clickedMapTileIndex2)
    );
    const focusedTile3 = focusAtom(mapTileIndexesAtom, (optic) =>
      optic.index(clickedMapTileIndex3)
    );
    const focusedTile4 = focusAtom(mapTileIndexesAtom, (optic) =>
      optic.index(clickedMapTileIndex4)
    );

    set(focusedTile1, i1);
    set(focusedTile2, i2);
    set(focusedTile3, i3);
    set(focusedTile4, i4);
  }
);

// meta tiles
export const metaTilesAtom = atom<
  {
    tileIndexes: [number, number, number, number];
    spottedAtMapIndex: number[];
  }[]
>([]);
export type MetaTile = ExtractAtomValue<typeof metaTilesAtom>[number];

// UI settings
export const currentSelectionAtom = atom<{
  mode: "tile" | "metaTile";
  index: number;
}>({ mode: "tile", index: 0 });
export const selectedTabIndexAtom = atom(0);
export const selectedPaintIndexAtom = atom<Color>(0);
export const isVisibleMapGridAtom = atom(true);
export const isVisibleMapOverlayAtom = atom(true);
export const highlightMetaTilesAtom = atom<number[]>([]);

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

export const currentTileSetTilesAtom = atom((get) => {
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

export const computeMetaTilesAtom = atom(null, async (get, set) => {
  const { width: MAP_WIDTH } = get(mapSizeAtom);
  const mapTileIndexes = get(mapTileIndexesAtom);

  const metaTileCache = new Map<string, MetaTile>();
  const metaTiles: MetaTile[] = [];

  for (let i = 0; i < mapTileIndexes.length; i += 2) {
    const isEndOfRow = i != 0 && i % MAP_WIDTH === 0;
    if (isEndOfRow) {
      i += MAP_WIDTH; // skip the next row
      const isEndOfMap = i >= mapTileIndexes.length;
      if (isEndOfMap) {
        break;
      }
    }

    const index1 = mapTileIndexes[i];
    const index2 = mapTileIndexes[i + 1];
    const index3 = mapTileIndexes[i + MAP_WIDTH];
    const index4 = mapTileIndexes[i + 1 + MAP_WIDTH];

    const key = `${index1}-${index2}-${index3}-${index4}`;
    if (metaTileCache.has(key)) {
      metaTileCache.get(key)!.spottedAtMapIndex.push(i);
      continue;
    }
    const metaTile: MetaTile = {
      spottedAtMapIndex: [i],
      tileIndexes: [index1, index2, index3, index4],
    };
    metaTileCache.set(key, metaTile);
    metaTiles.push(metaTile);
  }

  set(
    metaTilesAtom,
    metaTiles.sort((a, b) =>
      a.tileIndexes.join("-").localeCompare(b.tileIndexes.join("-"))
    )
  );
});

export const getMetaTilesForMapAtom = atom((get) => {
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode !== "metaTile") return [];

  const tiles = get(mapEditorCanvasAtom);
  const { width: MAP_WIDTH } = get(mapSizeAtom);

  const mTiles: Tile[][] = [];

  for (let i = 0; i < tiles.length; i += 2) {
    const isEndOfRow = i != 0 && i % MAP_WIDTH === 0;
    if (isEndOfRow) {
      i += MAP_WIDTH; // skip the next row
      const isEndOfMap = i >= tiles.length;
      if (isEndOfMap) {
        break;
      }
    }
    const t1 = tiles[i];
    const t2 = tiles[i + 1];
    const t3 = tiles[i + MAP_WIDTH];
    const t4 = tiles[i + 1 + MAP_WIDTH];

    mTiles.push([t1, t2, t3, t4]);
  }

  return mTiles;
});
