import { atom } from "jotai";
import { tileSetsAtom } from "./tileset";

import {
  currentEditedMapIndexAtom,
  currentSelectionAtom,
  selectedTileSetTabIndexAtom,
} from "./ui";
import { mapsAtom } from "./map";

export const copiedTilesAtom = atom<{
  tilesIndexes: number[];
  width: number;
} | null>(null);

export const copyTriggerAtom = atom(null, (get, set) => {
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode === "tile") {
    set(copiedTilesAtom, { tilesIndexes: [currentSelection.index], width: 1 });
  } else if (currentSelection.mode === "mapTiles") {
    const mapIndex = get(currentEditedMapIndexAtom);
    if (mapIndex === null) return;
    const map = get(mapsAtom)[mapIndex];
    const tiles = currentSelection.indexes.map(
      (index) => map.tilesIndexes[index]
    );
    set(copiedTilesAtom, {
      tilesIndexes: tiles,
      width: currentSelection.width,
    });
  }
});

export const pasteTriggerAtom = atom(null, (get, set) => {
  const copiedTiles = get(copiedTilesAtom);
  if (!copiedTiles) return;

  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode === "tile") {
    const tileSetIndex = get(selectedTileSetTabIndexAtom);
    const tileSets = get(tileSetsAtom);
    const draft = structuredClone(tileSets);
    const firstTilesIndexes = copiedTiles.tilesIndexes[0];
    const firstTile = tileSets[tileSetIndex].tiles[firstTilesIndexes];
    draft[tileSetIndex].tiles[currentSelection.index] = firstTile;
    set(tileSetsAtom, draft);
  } else if (currentSelection.mode === "mapTiles") {
    const mapIndex = get(currentEditedMapIndexAtom);
    if (mapIndex === null) return;
    const maps = get(mapsAtom);

    const draft = structuredClone(maps);
    const currentMap = draft[mapIndex];

    for (let i = 0; i < copiedTiles.tilesIndexes.length; i++) {
      const x = i % copiedTiles.width;
      const y = Math.floor(i / copiedTiles.width);
      if (
        (currentSelection.indexes[0] % currentMap.size.width) + x >=
        currentMap.size.width
      ) {
        console.log("out of bounds x");
        continue;
      }
      if (
        Math.floor(currentSelection.indexes[0] / currentMap.size.width) + y >=
        currentMap.size.height
      ) {
        console.log("out of bounds y");
        continue;
      }

      console.log(
        "filling index",
        currentSelection.indexes[0] + x + y * currentMap.size.width,
        "with ",
        currentSelection.indexes[0],
        x,
        y
      );
      const indexToWrite =
        currentSelection.indexes[0] + x + y * currentMap.size.width;

      if (indexToWrite >= currentMap.tilesIndexes.length) {
        throw new Error("out of bounds this should not happen");
      }

      currentMap.tilesIndexes[indexToWrite] = copiedTiles.tilesIndexes[i];
    }

    set(mapsAtom, draft);
  }
});
