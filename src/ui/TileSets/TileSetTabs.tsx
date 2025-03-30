import { useAtom, useAtomValue } from "jotai";
import { selectedTileSetTabIndexAtom } from "../../state/ui";
import { tileSetsAtom } from "../../state/tileset";
import { useState } from "react";
import { CreateTileSetModal } from "./CreateTileSetModal";
import { LEFT_CLICK, RIGHT_CLICK } from "../../state/utils";
import { EditTileSetModal } from "./EditTileSetModal";

export function TileSetTabs() {
  const tileSets = useAtomValue(tileSetsAtom);
  const [tab, setTab] = useAtom(selectedTileSetTabIndexAtom);
  const [isCreateTileSetModalOpen, setIsCreateTileSetModalOpen] =
    useState(false);
  const [isEditTileSetModalOpen, setIsEditTileSetModalOpen] = useState<
    number | null
  >(null);

  return (
    <div className="flex flex-1 flex-wrap max-w-full">
      {tileSets.map((tileSet, index) => {
        return (
          <div
            key={index}
            className={`cursor-pointer p-1 ${
              index === tab ? "bg-red-200" : ""
            }`}
            onMouseDown={(e) => {
              if (e.button === LEFT_CLICK) {
                setTab(index);
              } else if (e.button === RIGHT_CLICK) {
                setIsEditTileSetModalOpen(index);
              }
            }}
          >
            {tileSet.name}
          </div>
        );
      })}
      <div
        className="cursor-pointer inline-block p-1"
        onClick={() => {
          setIsCreateTileSetModalOpen(true);
        }}
      >
        +
      </div>
      <CreateTileSetModal
        isOpen={isCreateTileSetModalOpen}
        close={() => setIsCreateTileSetModalOpen(false)}
      />
      {isEditTileSetModalOpen !== null && (
        <EditTileSetModal
          isOpenFor={isEditTileSetModalOpen}
          close={() => setIsEditTileSetModalOpen(null)}
        />
      )}
    </div>
  );
}
