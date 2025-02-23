import { atom, useAtom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import { useEffect, useMemo, useState } from "react";
import { tileSetsAtom } from "../state/tileset";
import {
  currentSelectionAtom,
  selectedPaintIndexAtom,
  selectedTabIndexAtom,
} from "../state/ui";
import { Color, pixelToRgb } from "../state/tiles";
import { LEFT_CLICK, MIDDLE_CLICK, RIGHT_CLICK } from "../state/utils";

export function TileEditor() {
  const tab = useAtomValue(selectedTabIndexAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const [paintIndex, setPaintIndex] = useAtom(selectedPaintIndexAtom);
  const [isDrawing, setIsDrawing] = useState(false);

  const [tile, setTile] = useAtom(
    useMemo(() => {
      if (currentSelection.mode !== "tile") return atom<Color[]>([]);

      return focusAtom(tileSetsAtom, (optic) =>
        optic.index(tab).prop("tiles").index(currentSelection.index)
      );
    }, [tab, currentSelection])
  );

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
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit overflow-hidden">
      {draft.map((pixel, i) => (
        <div
          className="h-[32px] w-[32px] ring hover:contrast-125"
          key={i}
          onClick={(e) => {
            e.preventDefault();
            if (e.button === MIDDLE_CLICK) {
              setPaintIndex((x) => ((x + 1) % 4) as Color);
            }
          }}
          onMouseDown={(e) => {
            if (e.button === LEFT_CLICK) {
              setIsDrawing(true);
              const clonedTile = [...draft];
              clonedTile[i] = paintIndex;
              setDraft(clonedTile);
            }
            if (e.button === RIGHT_CLICK) {
              setPaintIndex(draft[i]);
            }
          }}
          onMouseOver={(e) => {
            if (e.button !== 0) return;
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
