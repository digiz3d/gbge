import { useAtom, useAtomValue } from "jotai";
import { selectedTabIndex, selectTileIndex, tileSets } from "../state";
import { TileViewerButSmall } from "./TileViewerButSmall";

export function TileSetViewer() {
  const sets = useAtomValue(tileSets);
  const selectedTab = useAtomValue(selectedTabIndex);
  const x = sets[selectedTab];
  const [selectedTile, setSelectedTile] = useAtom(selectTileIndex); // TODO: use to set selected cell

  return (
    <div className="grid grid-cols-4 w-fit h-fit">
      {x.tiles.map((tile, i) => {
        return (
          <div
            className={`ring ${
              selectedTile === i ? "filter contrast-150 " : ""
            }`}
            onClick={() => setSelectedTile(i)}
          >
            <TileViewerButSmall tile={tile} key={i} />
          </div>
        );
      })}
    </div>
  );
}
