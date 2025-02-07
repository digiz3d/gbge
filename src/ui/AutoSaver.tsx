import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { mapTileIndexesAtom, tileSetsAtom } from "../state";

export function AutoSaver({ enabled }: { enabled: boolean }) {
  const tileSets = useAtomValue(tileSetsAtom);
  const mapTileIndexes = useAtomValue(mapTileIndexesAtom);

  useEffect(() => {
    if (!enabled) return;

    const i = setInterval(() => {
      console.log("saving", tileSets, mapTileIndexes);
      localStorage.setItem("tileSetInitialValue", JSON.stringify(tileSets));
      localStorage.setItem(
        "mapTileIndexesInitialValue",
        JSON.stringify(mapTileIndexes)
      );
      // localStorage.clear()
    }, 1000);

    return () => clearInterval(i);
  }, [enabled, tileSets, mapTileIndexes]);

  return null;
}
