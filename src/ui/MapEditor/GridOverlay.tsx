import { useAtomValue } from "jotai";
import { currentSelectionAtom, isVisibleMapGridAtom } from "../../state";

const TILE_SIZE = 16;

export function GridOverlay() {
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);

  const gridSize = currentSelection.mode === "tile" ? TILE_SIZE : TILE_SIZE * 2;

  if (!isGridVisible) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0"
      style={{
        backgroundImage: `linear-gradient(#00000044 1px, transparent 1px),
        linear-gradient(90deg, #00000044 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        pointerEvents: "none",
      }}
    />
  );
}
