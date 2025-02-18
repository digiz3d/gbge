import { useAtomValue, useSetAtom } from "jotai";
import { mapsAtom, tileSetsAtom } from "../../state";
import { useEffect, useRef, useState } from "react";
import { createMapImage } from "../../utils/tileImage";
import { focusToEditMapAtom } from "../../state/ui";
import { WorldMapInfo } from "./WorldMapInfo";

const TILE_SIZE = 8;

export function Worldmap() {
  const [tileSet] = useAtomValue(tileSetsAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panning, setPanning] = useState(false);
  const [tryingToPan, setTryingToPan] = useState(false);
  const focusToEditMap = useSetAtom(focusToEditMapAtom);

  const maps = useAtomValue(mapsAtom);

  const maxHeight = Math.max(...maps.map((map) => map.size.height));
  const maxBottom = Math.max(
    ...maps.map((map) => map.worldCoords.y + map.size.height)
  );

  const maxWidth = Math.max(...maps.map((map) => map.size.width));
  const maxRight = Math.max(
    ...maps.map((map) => map.worldCoords.x + map.size.width)
  );

  useEffect(() => {
    const handleMouseUp = () => {
      setPanning(false);
      setTryingToPan(false);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [panning]);

  return (
    <div className="flex flex-col flex-1">
      <WorldMapInfo />
      <div
        ref={containerRef}
        className="flex-1 overflow-scroll relative"
        style={{ cursor: panning ? "grabbing" : "grab" }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            height: TILE_SIZE * (maxHeight + maxBottom + maxHeight),
            width: TILE_SIZE * (maxWidth + maxRight + maxWidth),
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTryingToPan(true);
          }}
          onMouseMove={(e) => {
            e.preventDefault();
            if (!tryingToPan) return;
            if (!containerRef.current) return;
            setPanning(true);
            containerRef.current.scrollBy({
              left: -e.movementX,
              top: -e.movementY,
            });
          }}
        >
          {maps.map((map, index) => (
            <div
              onMouseUp={(e) => {
                if (panning) return;
                e.stopPropagation();
                if (e.button === 0) {
                  focusToEditMap(index);
                }
              }}
              key={map.id}
              className="absolute bg-amber-50 cursor-pointer"
              style={{
                width: TILE_SIZE * map.size.width,
                height: TILE_SIZE * map.size.height,
                left: TILE_SIZE * maxWidth + TILE_SIZE * map.worldCoords.x,
                top: TILE_SIZE * maxHeight + TILE_SIZE * map.worldCoords.y,
              }}
            >
              <img src={createMapImage(TILE_SIZE, map, tileSet)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
