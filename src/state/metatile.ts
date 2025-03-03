import { atom, ExtractAtomValue, Getter, Setter } from "jotai";

import { mapsAtom } from "./map";
import { currentSelectionAtom } from "./ui";
import { pinnedMetaTileIndexesAtom } from "./metatiles-pinned";

export const metaTilesAtom = atom<
  {
    tileIndexes: [number, number, number, number];
    spottedAt: Map<number, number[]>;
    spottedCount: number;
  }[]
>([]);
export const hoveredMetaTileIndexAtom = atom<number | null>(null);
export const highlightMetaTilesIndexesAtom = atom<number[]>([]);

export type MetaTile = ExtractAtomValue<typeof metaTilesAtom>[number];

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

      const t1 = mapTileIndexes[i];
      const t2 = mapTileIndexes[i + 1];
      const t3 = mapTileIndexes[i + mapWidth];
      const t4 = mapTileIndexes[i + 1 + mapWidth];

      const key = makeMetaTileSignature([t1, t2, t3, t4]);

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
        tileIndexes: [t1, t2, t3, t4],
      };
      metaTileCache.set(key, metaTile);
      metaTiles.push(metaTile);
    }
  }

  const sortedMetaTiles = metaTiles.sort((a, b) =>
    a.tileIndexes.join("-").localeCompare(b.tileIndexes.join("-"))
  );
  updatePinnedMetaTileIndexes(sortedMetaTiles, get, set);
  set(metaTilesAtom, sortedMetaTiles);
});

function updatePinnedMetaTileIndexes(
  sortedMetaTiles: MetaTile[],
  get: Getter,
  set: Setter
) {
  const currentMetaTiles = get(metaTilesAtom);
  const pinnedMetaTileIndexes = get(pinnedMetaTileIndexesAtom);
  const pinnedMetaTilesSignatures = pinnedMetaTileIndexes.map((i) =>
    makeMetaTileSignature(currentMetaTiles[i].tileIndexes)
  );

  const newPinnedMetaTilesIndexes = pinnedMetaTilesSignatures
    .map((signature) =>
      sortedMetaTiles.findIndex(
        (m) => makeMetaTileSignature(m.tileIndexes) === signature
      )
    )
    .filter((i) => i !== -1);
  set(pinnedMetaTileIndexesAtom, newPinnedMetaTilesIndexes);
}

type SimplerMetaTile = Pick<MetaTile, "tileIndexes">;

function makeMetaTileSignature(
  tileIndexes: [number, number, number, number]
): string {
  return tileIndexes.join("-");
}

export const droppickMetaTileAtom = atom(
  null,
  (get, set, metaTile: SimplerMetaTile) => {
    const currentSelection = get(currentSelectionAtom);
    if (currentSelection.mode !== "metaTile") return;

    let metaTiles = get(metaTilesAtom);
    let index = metaTiles.findIndex(
      (m) =>
        makeMetaTileSignature(m.tileIndexes) ===
        makeMetaTileSignature(metaTile.tileIndexes)
    );
    const metaTilesAreOutdated = index == -1;
    if (metaTilesAreOutdated) {
      set(computeMetaTilesAtom);
      metaTiles = get(metaTilesAtom);
      index = metaTiles.findIndex(
        (m) =>
          makeMetaTileSignature(m.tileIndexes) ===
          makeMetaTileSignature(metaTile.tileIndexes)
      );
    }
    set(currentSelectionAtom, {
      mode: "metaTile",
      index,
      trigger: "auto",
      tool: "brush",
    });
  }
);
