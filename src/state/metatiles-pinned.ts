import { atom } from "jotai";

export const pinnedMetaTileIndexesAtom = atom<number[]>([]);

export const togglePinnedMetaTileAtom = atom(
  null,
  (get, set, index: number) => {
    const pinnedMetaTileIndexes = get(pinnedMetaTileIndexesAtom);
    console.log("togglePinnedMetaTileAtom", index);
    if (pinnedMetaTileIndexes.includes(index)) {
      set(
        pinnedMetaTileIndexesAtom,
        pinnedMetaTileIndexes.filter((i) => i !== index)
      );
      console.log("rem", pinnedMetaTileIndexes);
    } else {
      set(pinnedMetaTileIndexesAtom, [...pinnedMetaTileIndexes, index]);
      console.log("add", pinnedMetaTileIndexes);
    }
  }
);
