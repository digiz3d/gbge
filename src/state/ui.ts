import { atom } from "jotai";
import { atomWithToggle } from "./utils";
import { Color } from "./tiles";

export const currentEditedMapIndexAtom = atom<number | null>(null);
export const currentSelectionAtom = atom<{
  trigger: "auto" | "manual";
  mode: "tile" | "metaTile";
  index: number;
}>({ mode: "tile", index: 0, trigger: "manual" });
export const selectedTabIndexAtom = atom(0);
export const selectedPaintIndexAtom = atom<Color>(0);

export const isVisibleMapGridAtom = atomWithToggle(true);
export const isVisibleZoneAtom = atomWithToggle(true);
export const areMapIdsVisibleAtom = atomWithToggle(true);

export const focusToEditMapAtom = atom(null, (_, set, index: number) => {
  set(currentEditedMapIndexAtom, index);
});

export const unfocusMapToEditAtom = atom(null, (_, set) => {
  set(currentEditedMapIndexAtom, null);
});
