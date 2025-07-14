import { useState } from "react";
import { ResizeMapModal } from "../Modals/ResizeMapModal";
import { BeltTileButton } from "./Belt/BeltTileButton";
import type { Tile } from "../../state/tiles";
import { ImportExportModal } from "../Modals/ImportExportModal";

export function ToolbarGlobalSettings() {
  const [isResizeMapModalOpen, setIsResizeMapModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

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
        tile={importExportIcon}
        onClick={() => setIsImportExportModalOpen(true)}
      />
      <ImportExportModal
        isOpen={isImportExportModalOpen}
        close={() => setIsImportExportModalOpen(false)}
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

/* prettier-ignore */
const importExportIcon: Tile = [
  0, 0, 2, 0, 0, 0, 0, 0, 
  0, 2, 2, 2, 0, 3, 0, 0, 
  2, 2, 2, 2, 2, 3, 0, 0, 
  0, 0, 3, 0, 0, 3, 0, 0, 
  0, 0, 3, 0, 0, 3, 0, 0, 
  0, 0, 3, 2, 2, 2, 2, 2, 
  0, 0, 3, 0, 2, 2, 2, 0, 
  0, 0, 0, 0, 0, 2, 0, 0,
 ];
