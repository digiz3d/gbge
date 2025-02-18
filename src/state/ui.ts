import { atom } from "jotai";
import { currentMapIndexAtom } from ".";

export const worldmapAtom = atom(true);

export const focusToEditMapAtom = atom(null, (_, set, index: number) => {
  set(currentMapIndexAtom, index);
  set(worldmapAtom, false);
});

export const unfocusMapToEditAtom = atom(null, (_, set) => {
  set(currentMapIndexAtom, 0);
  set(worldmapAtom, true);
});
