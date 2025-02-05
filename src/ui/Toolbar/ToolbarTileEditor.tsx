import { useEffect } from "react";
import { Belt } from "./Belt/index.tsx";
import { BeltColorButton } from "./Belt/BeltColorButton.tsx";
import { selectedPaintIndexAtom } from "../../state/index.ts";
import { useSetAtom } from "jotai";

export function ToolbarTileEditor() {
  const setPaintIndex = useSetAtom(selectedPaintIndexAtom);
  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Digit1":
          setPaintIndex(0);
          break;
        case "Digit2":
          setPaintIndex(1);
          break;
        case "Digit3":
          setPaintIndex(2);
          break;
        case "Digit4":
          setPaintIndex(3);
          break;
      }
    };

    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, []);

  return (
    <div className="self-center px-2">
      <Belt>
        <BeltColorButton buttonPaintIndex={0} />
        <BeltColorButton buttonPaintIndex={1} />
        <BeltColorButton buttonPaintIndex={2} />
        <BeltColorButton buttonPaintIndex={3} />
      </Belt>
    </div>
  );
}
