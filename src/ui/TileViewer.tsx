import {
  rgbColorPalette,
  selectedPaintIndexAtom,
  selectedTabIndexAtom,
  selectTileIndexAtom,
  tileSetsAtom,
} from "../state";
import { focusAtom } from "jotai-optics";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [isDrawing, setIsDrawing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globalMouseUp = () => {
      setIsDrawing(false);
    };
    window.addEventListener("mouseup", globalMouseUp);
    return () => {
      window.removeEventListener("mouseup", globalMouseUp);
    };
  }, []);

  if (!tile) return null;

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
      }}
      ref={ref}
      className="grid grid-cols-8 grid-rows-8 w-fit h-fit"
    >
      {tile.map((pixel, i) => (
        <div
          className="h-[32px] w-[32px] ring"
          key={i}
          onClick={() => {
            const clonedTile = [...tile];
            clonedTile[i] = paintIndex;
            setTile(clonedTile);
          }}
          onMouseOver={(e) => {
            if (isDrawing) {
              e.preventDefault();
              const clonedTile = [...tile];
              clonedTile[i] = paintIndex;
              setTile(clonedTile);
            }
          }}
          style={{
            backgroundColor: rgbColorPalette[pixel],
          }}
        />
      ))}
    </div>
  );
}
