import { atom } from "jotai";
import { atomWithToggle } from "./utils";
import { Color } from "./tiles";

export const currentMapIndexAtom = atom<number | null>(null);
export const currentSelectionAtom = atom<{
  trigger: "auto" | "manual";
  mode: "tile" | "metaTile";
  index: number;
}>({ mode: "tile", index: 0, trigger: "manual" });
export const selectedTabIndexAtom = atom(0);
export const selectedPaintIndexAtom = atom<Color>(0);

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
