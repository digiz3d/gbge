import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  computeMetaTilesAtom,
  LOCALSTORAGE_MAPS_KEY,
  mapsAtom,
  tileSetsAtom,
} from "../state";

export function AutoSaver({ enabled }: { enabled: boolean }) {
  const tileSets = useAtomValue(tileSetsAtom);
  const maps = useAtomValue(mapsAtom);
  const computeMetaTiles = useSetAtom(computeMetaTilesAtom);

  useEffect(() => {
    computeMetaTiles();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const i = setInterval(() => {
      localStorage.setItem("tileSetInitialValue", JSON.stringify(tileSets));
      localStorage.setItem(LOCALSTORAGE_MAPS_KEY, JSON.stringify(maps));
    }, 1000);

    return () => clearInterval(i);
  }, [enabled, tileSets, maps]);

  return null;
}
