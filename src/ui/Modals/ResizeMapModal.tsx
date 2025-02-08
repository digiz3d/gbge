import { useState } from "react";
import { Modal } from "./Modal";
import { useAtomValue, useSetAtom } from "jotai";
import { mapSizeAtom, resizeMapAtom } from "../../state";

export function ResizeMapModal({
  close,
  isOpen,
}: {
  close: () => void;
  isOpen: boolean;
}) {
  const { width: mapWidth, height: mapHeight } = useAtomValue(mapSizeAtom);
  const resizeMap = useSetAtom(resizeMapAtom);
  const [width, setWidth] = useState(mapWidth);
  const [height, setHeight] = useState(mapHeight);

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
            resizeMap(width, height);
            close();
          }}
          disabled={
            width % 2 === 1 || height % 2 === 1 || width < 1 || height < 1
          }
        >
          Resize
        </button>
      </div>
    </Modal>
  );
}
