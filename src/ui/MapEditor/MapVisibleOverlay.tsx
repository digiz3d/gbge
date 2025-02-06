import { useAtomValue } from "jotai";
import { isVisibleMapOverlayAtom } from "../../state";

export function MapVisibleOverlay() {
  const isVisible = useAtomValue(isVisibleMapOverlayAtom);

  if (!isVisible) return null;

  return (
    <div
      className={`w-[322px] h-[290px] absolute top-0 left-0 border-2 border-[#FF000077] pointer-events-none`}
    />
  );
}
