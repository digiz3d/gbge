import { useAtom } from "jotai";
import { Color, rgbColorPalette, selectedPaintIndexAtom } from "../../state";

export function BeltButton({ buttonPaintIndex }: { buttonPaintIndex: Color }) {
  const [paintIndex, setPaintIndex] = useAtom(selectedPaintIndexAtom);
  return (
    <div
      className={`bg-gray-300 w-8 h-8 cursor-pointer ${
        paintIndex === buttonPaintIndex ? "border-2 border-white" : ""
      }`}
      style={{
        backgroundColor: rgbColorPalette[buttonPaintIndex],
      }}
      onClick={() => setPaintIndex(buttonPaintIndex)}
    />
  );
}
