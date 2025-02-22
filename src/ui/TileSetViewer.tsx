import { useAtom, useAtomValue } from "jotai";
import { TileViewerButSmall } from "./TileViewerButSmall";
import { focusAtom } from "jotai-optics";
import { splitAtom } from "jotai/utils";
import { useMemo } from "react";
import { WritableAtom } from "jotai";
import { SetStateAction } from "jotai";
import { tileSetsAtom } from "../state/tileset";
import { currentSelectionAtom, selectedTabIndexAtom } from "../state/ui";
import { Tile } from "../state/tiles";

export function TileSetViewer() {
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
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
      {tiles.map((tileAtom, index) => {
        return (
          <div
            key={`${tileAtom}`}
            className={`cursor-pointer ring filter ${
              currentSelection.mode === "tile" &&
              currentSelection.index === index
                ? "contrast-150"
                : "contrast-100 hover:contrast-125" // scaling issue when not applying this filter on other cells
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onClick={() => setCurrentSelection({ mode: "tile", index })}
          >
            <TileViewerButSmall tileAtom={tileAtom} />
          </div>
        );
      })}
    </div>
  );
}
