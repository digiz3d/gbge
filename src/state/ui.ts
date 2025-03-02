import { atom } from "jotai";
import { atomWithToggle } from "./utils";
import { Color } from "./tiles";

export const currentEditedMapIndexAtom = atom<number | null>(null);

type CurrentSelectionInPanel = {
  index: number;
  mode: "tile" | "metaTile";
  tool: "brush" | "selection" | "bucket";
  trigger: "auto" | "manual";
};
type CurrentSelectionInMapEditor = {
  indexes: number[];
  mode: "mapTiles";
  tool: "selection";
  width: number;
  trigger: "manual";
};
export const currentSelectionAtom = atom<
  CurrentSelectionInPanel | CurrentSelectionInMapEditor
>({ mode: "tile", index: 0, trigger: "manual", tool: "brush" });

export const selectedTabIndexAtom = atom(0);
export const selectedPaintIndexAtom = atom<Color>(0);

export const isVisibleMapGridAtom = atomWithToggle(true);
export const isVisibleZoneAtom = atomWithToggle(true);
export const areMapIdsVisibleAtom = atomWithToggle(true);

export const focusToEditMapAtom = atom(null, (_, set, index: number) => {
  set(currentEditedMapIndexAtom, index);
});

export const unfocusMapToEditAtom = atom(null, (get, set) => {
  set(currentEditedMapIndexAtom, null);
  const currentSelection = get(currentSelectionAtom);
  if (currentSelection.mode === "mapTiles") {
    const draft = structuredClone(currentSelection);
    draft.indexes = [];
    set(currentSelectionAtom, draft);
  }
});
