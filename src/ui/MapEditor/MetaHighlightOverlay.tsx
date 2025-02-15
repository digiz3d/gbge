import { useAtomValue } from "jotai";
import { highlightMetaTilesAtom, mapSizeAtom } from "../../state";

const TILE_SIZE = 16;

export function MetaHighlightOverlay() {
  const highlightedMetaTiles = useAtomValue(highlightMetaTilesAtom);
  const { width } = useAtomValue(mapSizeAtom);

  if (!highlightedMetaTiles.length) return null;

  return (
    <div className="absolute top-0 left-0 pointer-events-none">
      <div className="relative">
        {highlightedMetaTiles.map((tileIndex) => (
          <div
            className="w-[32px] h-[32px] absolute pointer-events-none bg-indigo-600 opacity-25"
            style={{
              top: `${Math.floor(tileIndex / width) * TILE_SIZE}px`,
              left: `${(tileIndex % width) * TILE_SIZE}px`,
            }}
            key={tileIndex}
          />
        ))}
      </div>
    </div>
  );
}
