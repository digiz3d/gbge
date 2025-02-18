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

export const mapSizeAtom = atom((get) => {
  const maps = get(mapsAtom);
  const mapIndex = get(currentMapIndexAtom);
  const map = maps[mapIndex];
  return {
    width: map.size.width,
    height: map.size.height,
  };
});

export const createMapAtom = atom(
  null,
  (get, set, id: string, name: string, width: number, height: number) => {
    const maps = get(mapsAtom);
    const maxBottom = Math.max(
      ...maps.map((map) => map.worldCoords.y + map.size.height)
    );
    const maxRight = Math.max(
      ...maps.map((map) => map.worldCoords.x + map.size.width)
    );

    const newMap: MapEntity = {
      id,
      name,
      tilesIndexes: n(width * height, 0),
      size: { width, height },
      worldCoords: { x: maxRight, y: maxBottom - height },
    };

    set(mapsAtom, [...get(mapsAtom), newMap]);
  }
);

export const resizeMapAtom = atom(
  null,
  (get, set, width: number, height: number) => {
    const { width: currentWidth, height: currentHeight } = get(mapSizeAtom);
    if (width === currentWidth && height === currentHeight) return;

    const maps = get(mapsAtom);
    const mapIndex = get(currentMapIndexAtom);
    const arr = maps[mapIndex].tilesIndexes;

    // resize rows first as they have no impact on width/nb of columns
    // the opposite is true for columns
    const newArray = resizeRows(arr, currentWidth, height);
    const newArray2 = resizeColumns(newArray, currentWidth, width);

    const mapsDraft = structuredClone(maps);
    mapsDraft[mapIndex].tilesIndexes = newArray2;
    mapsDraft[mapIndex].size = { width, height };

    set(mapsAtom, mapsDraft);
  }
);

export function n<T>(length: number, value: T | (() => T)): T[] {
  return Array(length)
    .fill(null)
    .map(() => (typeof value === "function" ? (value as () => T)() : value));
}

export type MapEntity = {
  id: string;
  name: string;
  tilesIndexes: number[];
  size: {
    height: number;
    width: number;
  };
  worldCoords: {
    x: number;
    y: number;
  };
};

export const DEFAULT_MAP_SIZE = { width: 32, height: 32 };
const initialMaps: MapEntity[] = [
  {
    id: "default",
    name: "default",
    tilesIndexes: n(DEFAULT_MAP_SIZE.width * DEFAULT_MAP_SIZE.height, 0),
    size: {
      height: DEFAULT_MAP_SIZE.height,
      width: DEFAULT_MAP_SIZE.width,
    },
    worldCoords: {
      x: 0,
      y: 0,
    },
  },
];
export const mapsAtom = atom(initialMaps);
export const currentMapIndexAtom = atom(0);
export const setMapTileIndexesAtom = atom(
  null,
  (get, set, tileX: number, tileY: number) => {
    const currentSelection = get(currentSelectionAtom);
    const currentMapIndex = get(currentMapIndexAtom);
    const { height: MAP_HEIGHT, width: MAP_WIDTH } = get(mapSizeAtom);

    if (currentSelection.mode !== "tile") return;
    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
      return;
    }

    const tileIndex = tileY * MAP_WIDTH + tileX;
    const draft = structuredClone(get(mapsAtom));
    draft[currentMapIndex].tilesIndexes[tileIndex] = currentSelection.index;
    set(mapsAtom, draft);
  }
);

export const setMapTileIndexesFromMetaTileAtom = atom(
  null,
  (get, set, metaTileX: number, metaTileY: number) => {
    const currentSelection = get(currentSelectionAtom);
    const mapIndex = get(currentMapIndexAtom);
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

    const focusedTile1 = focusAtom(mapsAtom, (optic) =>
      optic.index(mapIndex).prop("tilesIndexes").index(clickedMapTileIndex1)
    );
    const focusedTile2 = focusAtom(mapsAtom, (optic) =>
      optic.index(mapIndex).prop("tilesIndexes").index(clickedMapTileIndex2)
    );
    const focusedTile3 = focusAtom(mapsAtom, (optic) =>
      optic.index(mapIndex).prop("tilesIndexes").index(clickedMapTileIndex3)
    );
    const focusedTile4 = focusAtom(mapsAtom, (optic) =>
      optic.index(mapIndex).prop("tilesIndexes").index(clickedMapTileIndex4)
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
    spottedAt: Map<number, number[]>;
    spottedCount: number;
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

const initialTileSets: TileSet[] = [
  { filename: "string.tileset", tiles: n(128, () => n<Color>(64, 0)) },
];
export const tileSetsAtom = atom(initialTileSets);

export const mapEditorCanvasAtom = atom((get) => {
  const maps = get(mapsAtom);
  const mapIndex = get(currentMapIndexAtom);
  const tileSets = get(tileSetsAtom);

  return maps[mapIndex].tilesIndexes.map((tileIndex) => {
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
  const maps = get(mapsAtom);
  const metaTiles: MetaTile[] = [];
  const metaTileCache = new Map<string, MetaTile>();

  for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
    const map = maps[mapIndex];
    const mapTileIndexes = map.tilesIndexes;

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
        const metaTile = metaTileCache.get(key)!;
        if (metaTile.spottedAt.has(mapIndex)) {
          metaTile.spottedAt.get(mapIndex)!.push(i);
        } else {
          metaTile.spottedAt.set(mapIndex, [i]);
        }
        metaTile.spottedCount++;
        continue;
      }
      const metaTile: MetaTile = {
        spottedAt: new Map([[mapIndex, [i]]]),
        spottedCount: 1,
        tileIndexes: [index1, index2, index3, index4],
      };
      metaTileCache.set(key, metaTile);
      metaTiles.push(metaTile);
    }
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
