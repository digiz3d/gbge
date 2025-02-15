import { atom } from "jotai";
import {
  currentSelectionAtom,
  selectedTabIndexAtom,
  Tile,
  tileSetsAtom,
} from ".";

export const copiedTileAtom = atom<Tile | null>(null);

export const pasteTriggerAtom = atom(null, (get, set) => {
  const copiedTile = get(copiedTileAtom);
  if (!copiedTile) return;

  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode !== "tile") return;

  const tileSetIndex = get(selectedTabIndexAtom);
  const tileSets = get(tileSetsAtom);
  const draft = structuredClone(tileSets);
  draft[tileSetIndex].tiles[currentSelection.index] = copiedTile;
  set(tileSetsAtom, draft);
});

export const copyTriggerAtom = atom(null, (get, set) => {
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode !== "tile") return;

  const tileSetIndex = get(selectedTabIndexAtom);
  const tileSet = get(tileSetsAtom)[tileSetIndex];
  const tile = tileSet.tiles[currentSelection.index];

  set(copiedTileAtom, tile);
});
