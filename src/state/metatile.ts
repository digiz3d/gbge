import { atom, ExtractAtomValue } from "jotai";

import { currentMapIndexAtom, currentSelectionAtom, Tile } from ".";
import { focusAtom } from "jotai-optics";
import { mapEditorCanvasAtom, mapsAtom, mapSizeAtom } from "./map";

export const metaTilesAtom = atom<
  {
    tileIndexes: [number, number, number, number];
    spottedAt: Map<number, number[]>;
    spottedCount: number;
  }[]
>([]);
export const hoveredMetaTileIndexAtom = atom<number | null>(null);
export const highlightMetaTilesAtom = atom<number[]>([]);

export type MetaTile = ExtractAtomValue<typeof metaTilesAtom>[number];

export const setMapTileIndexesFromMetaTileAtom = atom(
  null,
  (get, set, metaTileX: number, metaTileY: number) => {
    const currentSelection = get(currentSelectionAtom);
    const mapIndex = get(currentMapIndexAtom);

    if (mapIndex === null) return;
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

export const computeMetaTilesAtom = atom(null, async (get, set) => {
  const maps = get(mapsAtom);
  const metaTiles: MetaTile[] = [];
  const metaTileCache = new Map<string, MetaTile>();

  for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
    const map = maps[mapIndex];
    const mapTileIndexes = map.tilesIndexes;
    const mapWidth = map.size.width;

    for (let i = 0; i < mapTileIndexes.length; i += 2) {
      const isEndOfRow = i != 0 && i % mapWidth === 0;
      if (isEndOfRow) {
        i += mapWidth; // skip the next row
        const isEndOfMap = i >= mapTileIndexes.length;
        if (isEndOfMap) {
          break;
        }
      }

      const index1 = mapTileIndexes[i];
      const index2 = mapTileIndexes[i + 1];
      const index3 = mapTileIndexes[i + mapWidth];
      const index4 = mapTileIndexes[i + 1 + mapWidth];

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
