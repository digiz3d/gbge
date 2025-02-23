import { atom, ExtractAtomValue } from "jotai";

import { focusAtom } from "jotai-optics";
import { mapsAtom, mapSizeAtom, mapTilesAtom } from "./map";
import { currentMapIndexAtom, currentSelectionAtom } from "./ui";
import { Tile } from "./tiles";
import { currentTileSetTilesAtom } from "./tileset";

export const metaTilesAtom = atom<
  {
    key: string; // hash of the metatiles -> tile -> pixels
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
  const globalTiles = get(currentTileSetTilesAtom);
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

      const t1 = mapTileIndexes[i];
      const t2 = mapTileIndexes[i + 1];
      const t3 = mapTileIndexes[i + mapWidth];
      const t4 = mapTileIndexes[i + 1 + mapWidth];

      const key = makeMetaTileSignature([
        globalTiles[t1],
        globalTiles[t2],
        globalTiles[t3],
        globalTiles[t4],
      ]);

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
        key,
        spottedAt: new Map([[mapIndex, [i]]]),
        spottedCount: 1,
        tileIndexes: [t1, t2, t3, t4],
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

type SimplerMetaTile = Pick<MetaTile, "key" | "tileIndexes">;

export const getMetaTilesIndexesForMapAtom = atom((get) => {
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode !== "metaTile") return [];

  const mapTiles = get(mapTilesAtom);
  const globalTiles = get(currentTileSetTilesAtom);
  const { width: MAP_WIDTH } = get(mapSizeAtom);

  const metaTiles: SimplerMetaTile[] = [];

  for (let i = 0; i < mapTiles.length; i += 2) {
    const isEndOfRow = i != 0 && i % MAP_WIDTH === 0;
    if (isEndOfRow) {
      i += MAP_WIDTH; // skip the next row
      const isEndOfMap = i >= mapTiles.length;
      if (isEndOfMap) {
        break;
      }
    }
    const t1 = mapTiles[i];
    const t2 = mapTiles[i + 1];
    const t3 = mapTiles[i + MAP_WIDTH];
    const t4 = mapTiles[i + 1 + MAP_WIDTH];

    const i1 = globalTiles.findIndex(
      (tile) => makeTileSignature(tile) === makeTileSignature(t1)
    );
    const i2 = globalTiles.findIndex(
      (tile) => makeTileSignature(tile) === makeTileSignature(t2)
    );
    const i3 = globalTiles.findIndex(
      (tile) => makeTileSignature(tile) === makeTileSignature(t3)
    );
    const i4 = globalTiles.findIndex(
      (tile) => makeTileSignature(tile) === makeTileSignature(t4)
    );

    const key = makeMetaTileSignature([
      globalTiles[i1],
      globalTiles[i2],
      globalTiles[i3],
      globalTiles[i4],
    ]);

    metaTiles.push({ key, tileIndexes: [i1, i2, i3, i4] });
  }

  return metaTiles;
});

function makeMetaTileSignature(tiles: [Tile, Tile, Tile, Tile]): string {
  return tiles.map(makeTileSignature).join("-");
}

function makeTileSignature(tile: Tile): string {
  return tile.join("-");
}

export const droppickMetaTileAtom = atom(
  null,
  (get, set, metaTile: SimplerMetaTile) => {
    const currentSelection = get(currentSelectionAtom);
    if (currentSelection.mode !== "metaTile") return;

    let metaTiles = get(metaTilesAtom);
    let index = metaTiles.findIndex((m) => m.key === metaTile.key);
    const metaTilesAreOutdated = index == -1;
    if (metaTilesAreOutdated) {
      set(computeMetaTilesAtom);
      metaTiles = get(metaTilesAtom);
      index = metaTiles.findIndex((m) => m.key === metaTile.key);
    }
    set(currentSelectionAtom, { mode: "metaTile", index, trigger: "auto" });
  }
);
