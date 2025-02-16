import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { TileSet, tileSetsAtom } from "../state";
import { atom } from "jotai";

const filters = [{ name: "GBGE TileSet", extensions: ["gbge-tileset"] }];

export const saveTileSetAtom = atom(null, async (get) => {
  const tileSets = get(tileSetsAtom);
  const tileSetsJson = JSON.stringify(tileSets);
  const savePath = await save({ filters });
  if (!savePath) return;
  await writeTextFile(savePath, tileSetsJson);
});

export const loadTileSetAtom = atom(null, async (_, set) => {
  const loadPath = await open({ filters });
  if (!loadPath) return;
  const tileSetsJson = await readTextFile(loadPath);
  const tileSets = JSON.parse(tileSetsJson) as TileSet[];
  if (tileSets.length === 0) return;
  set(tileSetsAtom, tileSets);
});
