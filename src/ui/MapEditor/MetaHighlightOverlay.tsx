import { useAtomValue } from "jotai";
import { highlightMetaTilesAtom, mapSizeAtom } from "../../state";

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
              top: `${Math.floor(tileIndex / width) * 16}px`,
              left: `${(tileIndex % width) * 16}px`,
            }}
            key={tileIndex}
          />
        ))}
      </div>
    </div>
  );
}
