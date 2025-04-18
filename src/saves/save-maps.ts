import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { atom } from "jotai";
import { computeMetaTilesAtom } from "../state/metatile";
import { MapEntity, mapsAtom } from "../state/map";
import { currentEditedMapIndexAtom } from "../state/ui";

const filters = [{ name: "GBGE Maps", extensions: ["gbge-maps"] }];

export const saveMapsAtom = atom(null, async (get) => {
  const maps = get(mapsAtom);
  const mapsJson = JSON.stringify(maps);
  const savePath = await save({ filters });
  if (!savePath) return;
  await writeTextFile(savePath, mapsJson);
});

export const loadMapsAtom = atom(null, async (_, set) => {
  const loadPath = await open({ filters });
  if (!loadPath) return;
  const mapsJson = await readTextFile(loadPath);
  const maps = JSON.parse(mapsJson) as MapEntity[];
  if (maps.length === 0) return;
  set(currentEditedMapIndexAtom, null);
  set(mapsAtom, maps);
  set(computeMetaTilesAtom);
});
