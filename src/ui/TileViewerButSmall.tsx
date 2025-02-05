import { useAtomValue } from "jotai";
import { pixelToRgb, selectedTabIndexAtom, Tile, tileSetsAtom } from "../state";
import { Atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { useMemo } from "react";

export function TileViewerButSmall({ tileAtom }: { tileAtom: Atom<Tile> }) {
  const tile = useAtomValue(tileAtom);
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {tile.map((pixel, i) => (
        <div
          className="h-[8px] w-[8px]"
          key={i}
          style={{
            backgroundColor: pixelToRgb[pixel],
          }}
        />
      ))}
    </div>
  );
}
