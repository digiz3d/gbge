import {
  selectedPaintIndexAtom,
  selectedTabIndexAtom,
  selectTileIndexAtom,
  tileSetsAtom,
} from "../state";
import { focusAtom } from "jotai-optics";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

const colorPalette: { r: number; g: number; b: number }[] = [
  { r: 155, g: 188, b: 15 },
  { r: 129, g: 162, b: 15 }, // original { r: 139, g: 172, b: 15 }
  { r: 48, g: 98, b: 48 },
  { r: 15, g: 36, b: 15 }, // original { r: 15, g: 56, b: 15 }
];

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
            backgroundColor: `rgba(${colorPalette[pixel].r}, ${colorPalette[pixel].g},${colorPalette[pixel].b})`,
          }}
        />
      ))}
    </div>
  );
}
