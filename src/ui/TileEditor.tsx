import {
  Color,
  currentSelectionAtom,
  pixelToRgb,
  selectedPaintIndexAtom,
  selectedTabIndexAtom,
  tileSetsAtom,
} from "../state";
import { focusAtom } from "jotai-optics";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";

let isDrawing = false;

export function TileEditor() {
  const tab = useAtomValue(selectedTabIndexAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const paintIndex = useAtomValue(selectedPaintIndexAtom);

  const [tile, setTile] = useAtom(
    useMemo(() => {
      if (currentSelection.mode !== "tile") return atom<Color[]>([]);

      return focusAtom(tileSetsAtom, (optic) =>
        optic.index(tab).prop("tiles").index(currentSelection.index)
      );
    }, [tab, currentSelection.index])
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globalMouseUp = () => {
      isDrawing = false;
    };
    window.addEventListener("mouseup", globalMouseUp);
    return () => {
      window.removeEventListener("mouseup", globalMouseUp);
    };
  }, []);

  if (!tile?.length) {
    return (
      <div className="h-[256px] w-[256px]">Select a tile to start editing</div>
    );
  }

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        isDrawing = true;
      }}
      ref={ref}
      className="grid grid-cols-8 grid-rows-8 w-fit h-fit overflow-hidden"
    >
      {tile.map((pixel, i) => (
        <div
          className="h-[32px] w-[32px] ring hover:contrast-125"
          key={i}
          onClick={() => {
            const clonedTile = [...tile];
            clonedTile[i] = paintIndex;
            setTile(clonedTile);
          }}
          onMouseDown={() => {
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
            backgroundColor: pixelToRgb[pixel],
          }}
        />
      ))}
    </div>
  );
}
