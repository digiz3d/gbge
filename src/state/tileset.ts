import { atom } from "jotai";
import { makeFilledArray } from "./utils";
import { Color, TileSet } from "./tiles";
import { selectedTileSetTabIndexAtom } from "./ui";
import { message } from "@tauri-apps/plugin-dialog";

const initialTileSets: TileSet[] = [
  {
    name: "default",
    tiles: makeFilledArray(128, () => makeFilledArray<Color>(64, 0)),
  },
];
export const tileSetsAtom = atom(initialTileSets);

export const currentTileSetTilesAtom = atom((get) => {
  const currentTileSetIndex = get(selectedTileSetTabIndexAtom);
  const tileSets = get(tileSetsAtom);

  const tileSet = tileSets[currentTileSetIndex];
  return tileSet.tiles;
});

export const createNewTileSetAtom = atom(
  null,
  async (get, set, name: string) => {
    const tileSets = get(tileSetsAtom);
    const newTileSet = {
      name,
      tiles: makeFilledArray(128, () => makeFilledArray<Color>(64, 0)),
    };

    if (tileSets.find((tileSet) => tileSet.name === newTileSet.name)) {
      await message("A tile set with this name already exists.");
      return false;
    }

    set(tileSetsAtom, [...tileSets, newTileSet]);
    return true;
  }
);

export const updateTileSetAtom = atom(
  null,
  async (get, set, index: number, newName: string) => {
    const tileSets = get(tileSetsAtom);
    const tileSet = tileSets[index];
    if (!tileSet) return false;
    const draft = structuredClone(tileSets);
    draft[index].name = newName;
    set(tileSetsAtom, draft);
    return true;
  }
);

export const deleteTileSetAtom = atom(null, async (get, set, index: number) => {
  const tileSets = get(tileSetsAtom);
  if (tileSets.length === 1) return false;
  tileSets.splice(index, 1);
  const currentTileSetIndex = get(selectedTileSetTabIndexAtom);
  if (currentTileSetIndex >= tileSets.length) {
    set(selectedTileSetTabIndexAtom, tileSets.length - 1);
  }
  set(tileSetsAtom, tileSets);
  return true;
});
