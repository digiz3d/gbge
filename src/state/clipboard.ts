import { atom } from "jotai";
import { tileSetsAtom } from "./tileset";
import type { Tile } from "./tiles";
import {
  currentEditedMapIndexAtom,
  currentSelectionAtom,
  selectedTabIndexAtom,
} from "./ui";
import { mapsAtom } from "./map";

export const copiedTilesAtom = atom<Tile[] | null>(null);

export const pasteTriggerAtom = atom(null, (get, set) => {
  const copiedTiles = get(copiedTilesAtom);
  if (!copiedTiles) return;

  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode === "tile") {
    const tileSetIndex = get(selectedTabIndexAtom);
    const tileSets = get(tileSetsAtom);
    const draft = structuredClone(tileSets);
    draft[tileSetIndex].tiles[currentSelection.index] = copiedTiles[0];
    set(tileSetsAtom, draft);
  }
});

export const copyTriggerAtom = atom(null, (get, set) => {
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode === "tile") {
    const tileSetIndex = get(selectedTabIndexAtom);
    const tileSet = get(tileSetsAtom)[tileSetIndex];
    const tile = tileSet.tiles[currentSelection.index];
    set(copiedTilesAtom, [tile]);
  } else if (currentSelection.mode === "mapTiles") {
    const mapIndex = get(currentEditedMapIndexAtom);
    if (mapIndex === null) return;
    const map = get(mapsAtom)[mapIndex];
    const tiles = currentSelection.indexes.map(
      (index) => map.tilesIndexes[index]
    );
    const tileSetIndex = get(selectedTabIndexAtom);
    const tileSet = get(tileSetsAtom)[tileSetIndex];
    const copiedTiles = tiles.map((index) => tileSet.tiles[index]);
    set(copiedTilesAtom, copiedTiles);
  }
});
