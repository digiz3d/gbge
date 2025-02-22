import { atom } from "jotai";

import { currentMapIndexAtom, currentSelectionAtom } from ".";
import { tileSetsAtom } from "./tileset";
import { makeFilledArray } from "./utils";

export type MapEntity = {
  id: string;
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
    tilesIndexes: makeFilledArray(
      DEFAULT_MAP_SIZE.width * DEFAULT_MAP_SIZE.height,
      0
    ),
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

export const mapSizeAtom = atom((get) => {
  const maps = get(mapsAtom);
  const mapIndex = get(currentMapIndexAtom);
  if (mapIndex === null) return { width: 0, height: 0 };
  const map = maps[mapIndex];
  return {
    width: map.size.width,
    height: map.size.height,
  };
});

export const createMapAtom = atom(
  null,
  (get, set, id: string, width: number, height: number) => {
    const maps = get(mapsAtom);
    const maxBottom = Math.max(
      ...maps.map((map) => map.worldCoords.y + map.size.height)
    );
    const maxRight = Math.max(
      ...maps.map((map) => map.worldCoords.x + map.size.width)
    );

    const newMap: MapEntity = {
      id,
      tilesIndexes: makeFilledArray(width * height, 0),
      size: { width, height },
      worldCoords: { x: maxRight, y: maxBottom - height },
    };

    set(mapsAtom, [...get(mapsAtom), newMap]);
  }
);

export const setMapTileIndexesAtom = atom(
  null,
  (get, set, tileX: number, tileY: number) => {
    const currentSelection = get(currentSelectionAtom);
    const currentMapIndex = get(currentMapIndexAtom);
    if (currentMapIndex === null) return;
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

export const resizeMapAtom = atom(
  null,
  (get, set, width: number, height: number) => {
    const { width: currentWidth, height: currentHeight } = get(mapSizeAtom);
    if (width === currentWidth && height === currentHeight) return;

    const maps = get(mapsAtom);
    const mapIndex = get(currentMapIndexAtom);
    if (mapIndex === null) return;

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

export const moveMapInWorldAtom = atom(
  null,
  (get, set, mapIndex: number, newX: number, newY: number) => {
    const maps = get(mapsAtom);
    maps[mapIndex].worldCoords.x = Math.round(newX);
    maps[mapIndex].worldCoords.y = Math.round(newY);
    set(mapsAtom, maps);
  }
);

export const deleteMapByIndexAtom = atom(null, (get, set, mapIndex: number) => {
  const maps = get(mapsAtom);
  if (maps.length === 1) {
    return;
  }
  const draft = structuredClone(maps);
  draft.splice(mapIndex, 1);
  set(mapsAtom, draft);
});

export const mapEditorCanvasAtom = atom((get) => {
  const maps = get(mapsAtom);
  const mapIndex = get(currentMapIndexAtom);
  if (mapIndex === null) return [];
  const tileSets = get(tileSetsAtom);

  return maps[mapIndex].tilesIndexes.map((tileIndex) => {
    const tileSetIndex = Math.floor(tileIndex / 64);
    const tileIndexInSet = tileIndex % 64;
    const tileSet = tileSets[tileSetIndex];
    return tileSet.tiles[tileIndexInSet];
  });
});

function resizeColumns(
  arr: number[],
  currentColumns: number,
  wantedColumns: number
): number[] {
  if (currentColumns === wantedColumns) return arr;

  const rows = arr.length / currentColumns;
  const result: number[] = [];

  for (let row = 0; row < rows; row++) {
    const start = row * currentColumns;
    const rowElements = arr.slice(start, start + currentColumns);

    if (wantedColumns > currentColumns) {
      result.push(
        ...rowElements,
        ...new Array(wantedColumns - currentColumns).fill(0)
      );
    } else {
      result.push(...rowElements.slice(0, wantedColumns));
    }
  }

  return result;
}

function resizeRows(
  arr: number[],
  currentColumns: number,
  wantedRows: number
): number[] {
  const currentRows = arr.length / currentColumns;

  if (wantedRows === currentRows) return arr;

  if (wantedRows > currentRows) {
    const additionalElements = (wantedRows - currentRows) * currentColumns;
    return [...arr, ...new Array(additionalElements).fill(0)];
  } else {
    return arr.slice(0, wantedRows * currentColumns);
  }
}
