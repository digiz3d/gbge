import { useState } from "react";
import { Modal } from "./Modal";

export function ResizeMapModal({
  close,
  isOpen,
}: {
  close: () => void;
  isOpen: boolean;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  console.log("isOpen", isOpen);
  if (!isOpen) return null;

  return (
    <Modal>
      <div className="flex flex-col gap-2 max-w-64 bg-white p-4">
        <h1>Map size</h1>
        <div className="grid grid-cols-2 gap-2">
          <span className="pr-2">Width</span>
          <input
            type="number"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
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
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
        <button
          className="bg-indigo-600 text-white p-2 cursor-pointer active:bg-indigo-700"
          onClick={() => {
            // TODO: resize the map and close
            close();
          }}
        >
          Resize
        </button>
      </div>
    </Modal>
  );
}
