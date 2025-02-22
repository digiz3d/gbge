import { atom } from "jotai";
import { currentMapIndexAtom } from ".";
import { atomWithToggle } from "./utils";

export const worldmapAtom = atom(true);
export const isVisibleMapGridAtom = atomWithToggle(true);
export const isVisibleMapOverlayAtom = atomWithToggle(true);
export const areMapIdsVisibleAtom = atomWithToggle(true);

export const focusToEditMapAtom = atom(null, (_, set, index: number) => {
  set(currentMapIndexAtom, index);
  set(worldmapAtom, false);
});

export const unfocusMapToEditAtom = atom(null, (_, set) => {
  set(currentMapIndexAtom, null);
  set(worldmapAtom, true);
});
