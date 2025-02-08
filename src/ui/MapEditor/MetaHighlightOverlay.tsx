import { useAtomValue } from "jotai";
import { highlightMetaTilesAtom } from "../../state";

export function MetaHighlightOverlay() {
  const highlightedMetaTiles = useAtomValue(highlightMetaTilesAtom);

  if (!highlightedMetaTiles.length) return null;

  return (
    <div className="absolute top-0 left-0 pointer-events-none">
      <div className="relative">
        {highlightedMetaTiles.map((tileIndex) => (
          <div
            className="w-[32px] h-[32px] absolute pointer-events-none bg-indigo-600 opacity-25"
            style={{
              top: `${Math.floor(tileIndex / 32) * 16}px`,
              left: `${(tileIndex % 32) * 16}px`,
            }}
            key={tileIndex}
          />
        ))}
      </div>
    </div>
  );
}
