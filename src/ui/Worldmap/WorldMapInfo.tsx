import { useAtomValue } from "jotai";
import { mapsAtom } from "../../state";
import { useState } from "react";
import { CreateMapModal } from "./CreateMapModal";

export function WorldMapInfo() {
  const maps = useAtomValue(mapsAtom);
  const [isCreateMapModalOpen, setIsCreateMapModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-2">
      <div>{maps.length} maps.</div>
      <button
        className="cursor-pointer bg-white rounded-2xl px-2 py-1 active:bg-gray-100 mb-2"
        onClick={() => {
          setIsCreateMapModalOpen(true);
        }}
      >
        New map
      </button>
      <CreateMapModal
        isOpen={isCreateMapModalOpen}
        close={() => setIsCreateMapModalOpen(false)}
      />
    </div>
  );
}
