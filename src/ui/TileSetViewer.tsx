import { useAtom, useAtomValue } from "jotai";
import {
  selectedTabIndexAtom,
  selectTileIndexAtom,
  Tile,
  tileSetsAtom,
} from "../state";
import { TileViewerButSmall } from "./TileViewerButSmall";
import { focusAtom } from "jotai-optics";
import { splitAtom } from "jotai/utils";
import { useMemo } from "react";
import { WritableAtom } from "jotai";
import { SetStateAction } from "jotai";

export function TileSetViewer() {
  const [selectedTile, setSelectedTile] = useAtom(selectTileIndexAtom);

  const tab = useAtomValue(selectedTabIndexAtom);

  const tiles = useAtomValue(
    useMemo(() => {
      const focusedAtom = focusAtom(tileSetsAtom, (optic) =>
        optic.index(tab).prop("tiles")
      );
      return splitAtom(
        focusedAtom as WritableAtom<Tile[], [SetStateAction<Tile[]>], void> // IDK
      );
    }, [tab])
  );

  if (!tiles) return null;

  return (
    <div className="grid grid-cols-4 w-fit h-fit">
      {tiles.map((tileAtom, i) => {
        return (
          <div
            className={`ring ${
              selectedTile === i ? "filter contrast-150 " : ""
            }`}
            onClick={() => setSelectedTile(i)}
          >
            <TileViewerButSmall tileAtom={tileAtom} key={`${tileAtom}`} />
          </div>
        );
      })}
    </div>
  );
}
