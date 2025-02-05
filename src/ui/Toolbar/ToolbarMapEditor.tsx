import { Belt } from "./Belt/index.tsx";
import {
  isVisibleMapGridAtom,
  isVisibleMapOverlayAtom,
} from "../../state/index.ts";
import { useAtom } from "jotai";
import { BeltToggleButton } from "./Belt/BeltToggleButton.tsx";

export function ToolbarMapEditor() {
  const [isGridVisible, setIsGridVisible] = useAtom(isVisibleMapGridAtom);
  const [isOverlayVisible, setIsOverlayVisible] = useAtom(
    isVisibleMapOverlayAtom
  );

  return (
    <div className="self-center px-2">
      <Belt>
        <BeltToggleButton
          enabled={isGridVisible}
          onClick={() => setIsGridVisible((x) => !x)}
        />
        <BeltToggleButton
          enabled={isOverlayVisible}
          onClick={() => setIsOverlayVisible((x) => !x)}
        />
      </Belt>
    </div>
  );
}
