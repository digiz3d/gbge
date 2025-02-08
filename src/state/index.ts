import { atom, ExtractAtomValue } from "jotai";
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
export const MAP_ROW_LENGTH = 32;

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
export const setMapTileIndexesAtom = atom(
  null,
  (get, set, tileX: number, tileY: number) => {
    const currentSelection = get(currentSelectionAtom);

    if (currentSelection.mode !== "tile") return;
    if (
      tileX < 0 ||
      tileX >= MAP_ROW_LENGTH ||
      tileY < 0 ||
      tileY >= MAP_ROW_LENGTH
    ) {
      return;
    }

    const mapIndex = tileY * MAP_ROW_LENGTH + tileX;
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

    const metaTileIndexes = get(metaTilesAtom);
    const selectedMetaTile = metaTileIndexes[currentSelection.index];
    const [i1, i2, i3, i4] = selectedMetaTile.tileIndexes;

    const baseX = metaTileX * 2;
    const baseY = metaTileY * 2;

    const clickedMapTileIndex1 = baseX + baseY * MAP_ROW_LENGTH;
    const clickedMapTileIndex2 = baseX + 1 + baseY * MAP_ROW_LENGTH;
    const clickedMapTileIndex3 =
      baseX + baseY * MAP_ROW_LENGTH + MAP_ROW_LENGTH;
    const clickedMapTileIndex4 =
      baseX + 1 + baseY * MAP_ROW_LENGTH + MAP_ROW_LENGTH;

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
  const mapTileIndexes = get(mapTileIndexesAtom);

  const metaTileCache = new Map<string, MetaTile>();
  const MAP_TILES_SQUARED = 32;
  const metaTiles: MetaTile[] = [];

  for (let i = 0; i < mapTileIndexes.length; i += 2) {
    const isEndOfRow = i != 0 && i % MAP_TILES_SQUARED === 0;
    if (isEndOfRow) {
      i += MAP_TILES_SQUARED; // skip the next row
      const isEndOfMap = i >= mapTileIndexes.length;
      if (isEndOfMap) {
        break;
      }
    }

    const index1 = mapTileIndexes[i];
    const index2 = mapTileIndexes[i + 1];
    const index3 = mapTileIndexes[i + MAP_TILES_SQUARED];
    const index4 = mapTileIndexes[i + 1 + MAP_TILES_SQUARED];

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

  console.log("metaTiles", metaTiles);

  set(metaTilesAtom, metaTiles);
});

export const getMetaTilesForMapAtom = atom((get) => {
  const currentSelection = get(currentSelectionAtom);
  const tiles = get(mapEditorCanvasAtom);

  if (currentSelection.mode !== "metaTile") return [];

  const mTiles: Tile[][] = [];

  for (let i = 0; i < tiles.length; i += 2) {
    const isEndOfRow = i != 0 && i % MAP_ROW_LENGTH === 0;
    if (isEndOfRow) {
      i += MAP_ROW_LENGTH; // skip the next row
      const isEndOfMap = i >= tiles.length;
      if (isEndOfMap) {
        break;
      }
    }
    const t1 = tiles[i];
    const t2 = tiles[i + 1];
    const t3 = tiles[i + MAP_ROW_LENGTH];
    const t4 = tiles[i + 1 + MAP_ROW_LENGTH];

    mTiles.push([t1, t2, t3, t4]);
  }

  return mTiles;
});
