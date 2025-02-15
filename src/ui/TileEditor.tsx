import {
  Color,
  currentSelectionAtom,
  pixelToRgb,
  selectedPaintIndexAtom,
  selectedTabIndexAtom,
  tileSetsAtom,
} from "../state";
import { atom, useAtom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import { useEffect, useMemo, useRef, useState } from "react";

export function TileEditor() {
  const tab = useAtomValue(selectedTabIndexAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const paintIndex = useAtomValue(selectedPaintIndexAtom);
  const [isDrawing, setIsDrawing] = useState(false);

  const [tile, setTile] = useAtom(
    useMemo(() => {
      if (currentSelection.mode !== "tile") return atom<Color[]>([]);

      return focusAtom(tileSetsAtom, (optic) =>
        optic.index(tab).prop("tiles").index(currentSelection.index)
      );
    }, [tab, currentSelection])
  );

  const ref = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useAtom(
    useMemo(() => {
      return atom(tile);
    }, [tile])
  );

  useEffect(() => {
    const globalMouseUp = () => {
      setIsDrawing(false);
      if (draft) setTile(draft);
    };
    window.addEventListener("mouseup", globalMouseUp);
    return () => {
      window.removeEventListener("mouseup", globalMouseUp);
    };
  }, [draft]);

  if (!tile?.length || !draft?.length) {
    return (
      <div className="h-[256px] w-[256px]">Select a tile to start editing</div>
    );
  }

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
      }}
      ref={ref}
      className="grid grid-cols-8 grid-rows-8 w-fit h-fit overflow-hidden"
    >
      {draft.map((pixel, i) => (
        <div
          className="h-[32px] w-[32px] ring hover:contrast-125"
          key={i}
          onClick={() => {
            const clonedTile = [...draft];
            clonedTile[i] = paintIndex;
            setDraft(clonedTile);
          }}
          onMouseDown={() => {
            const clonedTile = [...draft];
            clonedTile[i] = paintIndex;
            setDraft(clonedTile);
          }}
          onMouseOver={(e) => {
            if (isDrawing) {
              e.preventDefault();
              const clonedTile = [...draft];
              clonedTile[i] = paintIndex;
              setDraft(clonedTile);
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
