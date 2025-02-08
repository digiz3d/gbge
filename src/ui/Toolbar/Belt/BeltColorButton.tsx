import { useAtom } from "jotai";
import { Color, pixelToRgb, selectedPaintIndexAtom } from "../../../state";

export function BeltColorButton({
  buttonPaintIndex,
}: {
  buttonPaintIndex: Color;
}) {
  const [paintIndex, setPaintIndex] = useAtom(selectedPaintIndexAtom);
  return (
    <div
      className={`bg-gray-300 border-2 border-black w-[32px] h-[32px] cursor-pointer ${
        paintIndex === buttonPaintIndex ? "border-2 border-white" : ""
      }`}
      style={{
        backgroundColor: pixelToRgb[buttonPaintIndex],
      }}
      onClick={() => setPaintIndex(buttonPaintIndex)}
    />
  );
}
