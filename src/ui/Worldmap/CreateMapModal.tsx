import { useState } from "react";
import { useSetAtom } from "jotai";
import { createMapAtom, DEFAULT_MAP_SIZE } from "../../state";
import { Modal } from "../Modals/Modal";

export function CreateMapModal({
  close,
  isOpen,
}: {
  close: () => void;
  isOpen: boolean;
}) {
  const createMap = useSetAtom(createMapAtom);

  const [id, setId] = useState("some-id");
  const [name, setName] = useState("New map");
  const [width, setWidth] = useState(DEFAULT_MAP_SIZE.width);
  const [height, setHeight] = useState(DEFAULT_MAP_SIZE.height);

  if (!isOpen) return null;

  return (
    <Modal>
      <div className="flex flex-col gap-2 max-w-64 bg-white p-4">
        <h1>Map properties</h1>
        <div className="grid grid-cols-2 gap-2">
          <span className="pr-2">ID</span>
          <input
            type="text"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            min={2}
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <span className="pr-2">name</span>
          <input
            type="text"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            min={2}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="pr-2">Width</span>
          <input
            type="number"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            min={2}
            placeholder="Width"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          <span className="pr-2">Height</span>
          <input
            className="shrink"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            type="number"
            min={2}
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
        <button
          className="bg-indigo-600 text-white p-2 cursor-pointer active:bg-indigo-700 disabled:bg-white disabled:text-gray-400 transition-all"
          onClick={() => {
            createMap(id, name, width, height);
            close();
          }}
          disabled={
            width % 2 === 1 || height % 2 === 1 || width < 1 || height < 1
          }
        >
          Create
        </button>
      </div>
    </Modal>
  );
}
