import { useAtom, useAtomValue } from "jotai";
import { TileViewerButSmall } from "../TileViewerButSmall";
import { tileSetsAtom } from "../../state/tileset";
import {
  currentSelectionAtom,
  selectedTileSetTabIndexAtom,
} from "../../state/ui";
import { TileSetTabs } from "./TileSetTabs";

export function TileSetViewer() {
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const tileSets = useAtomValue(tileSetsAtom);
  const tab = useAtomValue(selectedTileSetTabIndexAtom);
  const currentTileSet = tileSets[tab];

  return (
    <div>
      <TileSetTabs />
      <div className="grid grid-cols-4">
        {currentTileSet.tiles.map((tile, index) => {
          return (
            <div
              className={`cursor-pointer ring ${
                currentSelection.mode === "tile" &&
                currentSelection.index === index
                  ? "contrast-150"
                  : "contrast-100 hover:contrast-125" // scaling issue when not applying this filter on other cells
              }`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onClick={() => {
                setCurrentSelection((x) => ({
                  index,
                  mode: "tile",
                  tool: x.tool === "selection" ? "brush" : x.tool,
                  trigger: "manual",
                }));
              }}
            >
              <TileViewerButSmall tile={tile} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
