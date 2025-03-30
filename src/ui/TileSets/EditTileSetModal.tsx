import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Modal } from "../Modals/Modal";
import {
  deleteTileSetAtom,
  tileSetsAtom,
  updateTileSetAtom,
} from "../../state/tileset";

export function EditTileSetModal({
  isOpenFor,
  close,
}: {
  close: () => void;
  isOpenFor: number;
}) {
  const updateTileSet = useSetAtom(updateTileSetAtom);
  const deleteTileSet = useSetAtom(deleteTileSetAtom);
  const tileSets = useAtomValue(tileSetsAtom);
  const [id, setId] = useState(tileSets[isOpenFor].name);
  const [hasClickedDelete, setHasClickedDelete] = useState(false);

  return (
    <Modal onClick={close}>
      <div
        className="flex flex-col gap-2 max-w-64 bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Tileset properties</h1>
        <div className="grid grid-cols-2 gap-2">
          <span className="pr-2">ID</span>
          <input
            type="text"
            min={2}
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <button
          className="bg-indigo-600 text-white p-2 cursor-pointer active:bg-indigo-700 disabled:bg-white disabled:text-gray-400 transition-all"
          onClick={async () => {
            const created = await updateTileSet(isOpenFor, id);
            if (!created) return;
            close();
          }}
          disabled={!id || !id.match(/^([_a-zA-Z0-9]*[a-zA-Z0-9]+)$/i)}
        >
          Update
        </button>
        <button
          className="bg-red-600 text-white p-2 cursor-pointer active:bg-red-700 disabled:bg-white disabled:text-gray-400 transition-all"
          onClick={async () => {
            if (!hasClickedDelete) {
              setHasClickedDelete(true);
              return;
            }
            close();
            await deleteTileSet(isOpenFor);
          }}
        >
          {hasClickedDelete ? "Confirm delete" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
