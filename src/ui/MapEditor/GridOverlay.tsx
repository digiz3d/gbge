import { useAtomValue } from "jotai";
import { currentSelectionAtom } from "../../state";
import { mapSizeAtom } from "../../state/map";
import { isVisibleMapGridAtom } from "../../state/ui";

const TILE_SIZE = 16;
const METATILE_SIZE = TILE_SIZE * 2;

export function GridOverlay() {
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const { height, width } = useAtomValue(mapSizeAtom);

  if (!isGridVisible) return null;

  const gridSize = currentSelection.mode === "tile" ? TILE_SIZE : METATILE_SIZE;
  const Xpx = width * TILE_SIZE;
  const Ypx = height * TILE_SIZE;

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0"
      style={{
        backgroundImage: `linear-gradient(#00000044 1px, transparent 1px),
        linear-gradient(90deg, #00000044 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        pointerEvents: "none",
        height: `${Ypx}px`,
        width: `${Xpx}px`,
      }}
    />
  );
}
