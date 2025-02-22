import { atom } from "jotai";
import { Color, selectedTabIndexAtom, TileSet } from ".";
import { makeFilledArray } from "./utils";

const initialTileSets: TileSet[] = [
  {
    name: "default",
    tiles: makeFilledArray(128, () => makeFilledArray<Color>(64, 0)),
  },
];
export const tileSetsAtom = atom(initialTileSets);

export const currentTileSetTilesAtom = atom((get) => {
  const currentTileSetIndex = get(selectedTabIndexAtom);
  const tileSets = get(tileSetsAtom);

  const tileSet = tileSets[currentTileSetIndex];
  return tileSet.tiles;
});
