import { useState } from "react";
import { useSetAtom } from "jotai";
import { Modal } from "../Modals/Modal";
import { createNewTileSetAtom } from "../../state/tileset";

export function CreateTileSetModal({
  close,
  isOpen,
}: {
  close: () => void;
  isOpen: boolean;
}) {
  const createNewTileSet = useSetAtom(createNewTileSetAtom);

  const [id, setId] = useState("");

  if (!isOpen) return null;

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
            const created = await createNewTileSet(id);
            if (!created) return;
            close();
          }}
          disabled={!id || !id.match(/^([_a-zA-Z0-9]*[a-zA-Z0-9]+)$/i)}
        >
          Create
        </button>
      </div>
    </Modal>
  );
}
