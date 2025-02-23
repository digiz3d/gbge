import { atom } from "jotai";

export const pinnedMetaTileIndexesAtom = atom<number[]>([]);

export const togglePinnedMetaTileAtom = atom(
  null,
  (get, set, index: number) => {
    const pinnedMetaTileIndexes = get(pinnedMetaTileIndexesAtom);
    if (pinnedMetaTileIndexes.includes(index)) {
      set(
        pinnedMetaTileIndexesAtom,
        pinnedMetaTileIndexes.filter((i) => i !== index)
      );
    } else {
      set(pinnedMetaTileIndexesAtom, [...pinnedMetaTileIndexes, index]);
    }
  }
);
