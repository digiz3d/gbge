import { useEffect } from "react";
import { Belt } from "./Belt/index";
import { BeltColorButton } from "./Belt/BeltColorButton";
import { useSetAtom } from "jotai";
import { selectedPaintIndexAtom } from "../../state/ui";

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
    <div className="self-center">
      <Belt>
        <BeltColorButton buttonPaintIndex={0} />
        <BeltColorButton buttonPaintIndex={1} />
        <BeltColorButton buttonPaintIndex={2} />
        <BeltColorButton buttonPaintIndex={3} />
      </Belt>
    </div>
  );
}
