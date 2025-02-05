import { useAtomValue } from "jotai";
import { isVisibleMapOverlayAtom } from "../../state";

export function MapVisibleOverlay() {
  const isVisible = useAtomValue(isVisibleMapOverlayAtom);

  if (!isVisible) return null;

  return (
    <div className="w-[320px] h-[288px] absolute top-0 left-0 border-2 border-[#FF000077] pointer-events-none"></div>
  );
}
