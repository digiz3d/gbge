import {
  rgbColorPalette,
  selectedPaintIndexAtom,
  selectedTabIndexAtom,
  selectTileIndexAtom,
  tileSetsAtom,
} from "../state";
import { focusAtom } from "jotai-optics";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

export function TileViewer() {
  const tab = useAtomValue(selectedTabIndexAtom);
  const index = useAtomValue(selectTileIndexAtom);
  const paintIndex = useAtomValue(selectedPaintIndexAtom);

  const [tile, setTile] = useAtom(
    useMemo(
      () =>
        focusAtom(tileSetsAtom, (optic) =>
          optic.index(tab).prop("tiles").index(index)
        ),
      [tab, index]
    )
  );

  if (!tile) return null;

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {tile.map((pixel, i) => (
        <div
          className="h-[32px] w-[32px] ring"
          key={i}
          onClick={() => {
            const clonedTile = [...tile];
            clonedTile[i] = paintIndex;
            setTile(clonedTile);
          }}
          style={{
            backgroundColor: rgbColorPalette[pixel],
          }}
        />
      ))}
    </div>
  );
}
