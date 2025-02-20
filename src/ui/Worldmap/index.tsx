import { useAtomValue, useSetAtom } from "jotai";
import {
  MapEntity,
  mapsAtom,
  moveMapInWorldAtom,
  tileSetsAtom,
} from "../../state";
import { useEffect, useRef, useState } from "react";
import { createMapImage } from "../../utils/tileImage";
import { focusToEditMapAtom } from "../../state/ui";
import { WorldMapInfo } from "./WorldMapInfo";

const LEFT_CLICK = 0;
const MIDDLE_CLICK = 1;
const RIGHT_CLICK = 2;

const TILE_SIZE = 8;

function getMapsMinTop(maps: MapEntity[]) {
  return Math.min(...maps.map((map) => map.worldCoords.y));
}
function getMapsMaxBottom(maps: MapEntity[]) {
  return Math.max(...maps.map((map) => map.worldCoords.y + map.size.height));
}

function getMapsMinLeft(maps: MapEntity[]) {
  return Math.min(...maps.map((map) => map.worldCoords.x));
}
function getMapsMaxRight(maps: MapEntity[]) {
  return Math.max(...maps.map((map) => map.worldCoords.x + map.size.width));
}

export function Worldmap() {
  const [scale, setScale] = useState(100);
  const [tileSet] = useAtomValue(tileSetsAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panning, setPanning] = useState(false);
  const [grabbing, setGrabbing] = useState<{
    mapIndex: number;
    initialX: number;
    initialY: number;
    x: number;
    y: number;
  } | null>(null);
  const focusToEditMap = useSetAtom(focusToEditMapAtom);
  const moveMapInWorld = useSetAtom(moveMapInWorldAtom);

  const maps = useAtomValue(mapsAtom);

  const [maxTop, setMaxTop] = useState(getMapsMinTop(maps));
  const [maxBottom, setMaxBottom] = useState(getMapsMaxBottom(maps));
  const [maxLeft, setMaxLeft] = useState(getMapsMinLeft(maps));
  const [maxRight, setMaxRight] = useState(getMapsMaxRight(maps));

  useEffect(() => {
    const handleMouseUp = () => {
      setPanning(false);
      setGrabbing(null);
      setMaxTop(getMapsMinTop(maps));
      setMaxBottom(getMapsMaxBottom(maps));
      setMaxLeft(getMapsMinLeft(maps));
      setMaxRight(getMapsMaxRight(maps));
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [maps, panning]);

  return (
    <div className="flex flex-col flex-1">
      <WorldMapInfo />
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative border-1"
        onWheel={(e) => {
          e.stopPropagation();
          if (!containerRef.current) {
            return;
          }

          setScale((currentSize) => {
            return Math.max(
              10,
              Math.min(160, currentSize + (e.deltaY > 0 ? -10 : 10))
            );
          });
        }}
      >
        <div
          className="absolute top-0 left-0 transition-all duration-75"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#fff"/><rect x="10" y="0" width="10" height="10" fill="#eee"/><rect x="0" y="10" width="10" height="10" fill="#eee"/><rect x="10" y="10" width="10" height="10" fill="#fff"/></svg>'
            )}")`,
            backgroundSize: "20px 20px",
            height: TILE_SIZE * (maxTop + maxBottom),
            width: TILE_SIZE * (maxLeft + maxRight),
            scale: scale / 100,
            cursor: panning ? "move" : "grab",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button == MIDDLE_CLICK) {
              setPanning(true);
            }
          }}
          onMouseMove={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!containerRef.current) {
              return;
            }
            if (panning) {
              containerRef.current.scrollBy({
                left: -e.movementX,
                top: -e.movementY,
              });
              return;
            }
            if (grabbing !== null) {
              moveMapInWorld(
                grabbing.mapIndex,
                grabbing.initialX +
                  (e.clientX - grabbing.x) / ((TILE_SIZE * scale) / 100),
                grabbing.initialY +
                  (e.clientY - grabbing.y) / ((TILE_SIZE * scale) / 100)
              );
            }
          }}
        >
          {maps.map((map, index) => (
            <div
              onMouseDown={(e) => {
                e.preventDefault();

                if (e.button == LEFT_CLICK) {
                  setGrabbing({
                    mapIndex: index,
                    initialX: maps[index].worldCoords.x,
                    initialY: maps[index].worldCoords.y,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
                if (e.button == RIGHT_CLICK) {
                  focusToEditMap(index);
                }
              }}
              key={map.id}
              className="absolute bg-amber-50 outline-1 outline-offset-[-1px] outline-solid "
              style={{
                cursor: grabbing ? "grabbing" : panning ? "move" : "grab",
                height: TILE_SIZE * map.size.height,
                left: TILE_SIZE * map.worldCoords.x,
                top: TILE_SIZE * map.worldCoords.y,
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
