import { useState } from "react";
import { ResizeMapModal } from "../Modals/ResizeMapModal";
import { BeltTileButton } from "./Belt/BeltTileButton";
import { Tile } from "../../state";

export function ToolbarGlobalSettings() {
  const [isResizeMapModalOpen, setIsResizeMapModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-1 justify-end">
      <BeltTileButton
        tile={resize}
        onClick={() => setIsResizeMapModalOpen(true)}
      />
      <ResizeMapModal
        isOpen={isResizeMapModalOpen}
        close={() => setIsResizeMapModalOpen(false)}
      />
      <BeltTileButton
        tile={[]}
        onClick={() => {
          // TODO: import map
        }}
      />
      <BeltTileButton
        tile={[]}
        onClick={() => {
          // TODO: import tile set
        }}
      />
    </div>
  );
}

/* prettier-ignore */
const resize: Tile = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 3, 2, 2, 2, 0,
  0, 3, 3, 1, 1, 1, 2, 0,
  0, 3, 1, 3, 1, 1, 2, 0,
  0, 2, 1, 1, 3, 1, 3, 0,
  0, 2, 1, 1, 1, 3, 3, 0,
  0, 2, 2, 2, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
];
