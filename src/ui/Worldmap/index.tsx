import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  deleteMapByIndexAtom,
  hoveredMetaTileIndexAtom,
  mapsAtom,
  metaTilesAtom,
  moveMapInWorldAtom,
  tileSetsAtom,
} from "../../state";
import { useEffect, useRef, useState } from "react";
import { focusToEditMapAtom } from "../../state/ui";
import { WorldMapInfo } from "./WorldMapInfo";

import { Stage, Layer, Rect } from "react-konva";
import { MapPreview } from "./MapPreview";
import { WorldMapOrigin } from "./WorldMapOrigin";

const LEFT_CLICK = 0;
const MIDDLE_CLICK = 1;
const RIGHT_CLICK = 2;

const currentPanningAtom = atom({ x: 0, y: 0 });
const currentZoomAtom = atom(8);

export function Worldmap() {
  const [currentPanning, setCurrentPanning] = useAtom(currentPanningAtom);
  const [zoom, setZoom] = useAtom(currentZoomAtom);

  const metaTiles = useAtomValue(metaTilesAtom);
  const hoveredMetaTileIndex = useAtomValue(hoveredMetaTileIndexAtom);
  const metaTileSpottedInMap =
    hoveredMetaTileIndex !== null
      ? metaTiles[hoveredMetaTileIndex].spottedAt
      : null;

  const deleteMap = useSetAtom(deleteMapByIndexAtom);
  const [hoverMapIndex, setHoverMapIndex] = useState<number | null>(null);
  const [tileSet] = useAtomValue(tileSetsAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panning, setPanning] = useState(false);
  const [grabbing, setGrabbing] = useState<{
    mapIndex: number;
    mapX: number;
    mapY: number;
    mouseX: number;
    mouseY: number;
    width: number;
    height: number;
  } | null>(null);
  const focusToEditMap = useSetAtom(focusToEditMapAtom);
  const moveMapInWorld = useSetAtom(moveMapInWorldAtom);

  const maps = useAtomValue(mapsAtom);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseUp = () => {
      setPanning(false);
      if (grabbing) {
        moveMapInWorld(
          grabbing.mapIndex,
          (grabbing.mapX - currentPanning.x) / zoom,
          (grabbing.mapY - currentPanning.y) / zoom
        );
      }
      setGrabbing(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [grabbing, maps]);

  useEffect(() => {
    if (hoverMapIndex === null) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteMap(hoverMapIndex);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [hoverMapIndex]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });
    };

    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef.current]);

  return (
    <div className="flex flex-col flex-1">
      <WorldMapInfo />
      <div
        className="flex-1 overflow-hidden relative border-1"
        ref={containerRef}
      >
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute top-0 left-0"
          onWheel={(e) => {
            e.evt.preventDefault();
            e.evt.stopPropagation();
            if (grabbing) return;

            setZoom((prevZoom) => {
              const isNegative = e.evt.deltaY < 0;
              const newZoom = isNegative
                ? Math.min(prevZoom + 1, 16)
                : Math.max(prevZoom - 1, 1);

              const centerOfView = {
                x:
                  canvasSize.width / 2 / prevZoom - currentPanning.x / prevZoom,
                y:
                  canvasSize.height / 2 / prevZoom -
                  currentPanning.y / prevZoom,
              };

              setCurrentPanning({
                x: -centerOfView.x * newZoom + canvasSize.width / 2,
                y: -centerOfView.y * newZoom + canvasSize.height / 2,
              });

              return newZoom;
            });
          }}
          onMouseDown={(e) => {
            if (e.evt.button == MIDDLE_CLICK) {
              e.evt.preventDefault();
              e.evt.stopPropagation();
              setPanning(true);
            }
          }}
          onMouseMove={(e) => {
            e.evt.preventDefault();
            e.evt.stopPropagation();

            if (!containerRef.current) {
              return;
            }
            if (panning) {
              setCurrentPanning((curr) => ({
                x: curr.x + e.evt.movementX,
                y: curr.y + e.evt.movementY,
              }));
              return;
            }
            if (grabbing !== null) {
              setGrabbing({
                ...grabbing,
                mapX:
                  e.evt.clientX -
                  grabbing.mouseX +
                  maps[grabbing.mapIndex].worldCoords.x * zoom +
                  currentPanning.x * 2,
                mapY:
                  e.evt.clientY -
                  grabbing.mouseY +
                  maps[grabbing.mapIndex].worldCoords.y * zoom +
                  currentPanning.y * 2,
              });
            }
          }}
        >
          <Layer
            imageSmoothingEnabled={
              zoom <= 8 ? true : false // allows seeing shapes that would disappear when zoomed out, due to pixelation
            }
          >
            <WorldMapOrigin panning={currentPanning} canvasSize={canvasSize} />
            {maps.map((map, index) => {
              const isHighlighted = metaTileSpottedInMap?.has(index) ?? false;

              if (index === 0) {
                console.log(
                  "spottedAt?.get(index)",
                  index,
                  metaTileSpottedInMap
                );
              }

              return (
                <MapPreview
                  key={map.id}
                  map={map}
                  tileSet={tileSet}
                  isHighlighted={isHighlighted}
                  height={zoom * map.size.height}
                  width={zoom * map.size.width}
                  x={currentPanning.x + zoom * map.worldCoords.x}
                  y={currentPanning.y + zoom * map.worldCoords.y}
                  onMouseDown={(e) => {
                    e.evt.preventDefault();

                    const mouseX = e.evt.clientX + currentPanning.x;
                    const mouseY = e.evt.clientY + currentPanning.y;

                    if (e.evt.button == LEFT_CLICK) {
                      setGrabbing({
                        mapIndex: index,
                        mapX:
                          currentPanning.x + maps[index].worldCoords.x * zoom,
                        mapY:
                          currentPanning.y + maps[index].worldCoords.y * zoom,
                        mouseX,
                        mouseY,
                        width: zoom * maps[index].size.width,
                        height: zoom * maps[index].size.height,
                      });
                    }

                    if (e.evt.button == RIGHT_CLICK) {
                      focusToEditMap(index);
                    }
                  }}
                  onMouseEnter={() => {
                    if (grabbing) return;
                    setHoverMapIndex(index);
                  }}
                  onMouseLeave={() => {
                    if (grabbing) return;
                    setHoverMapIndex(null);
                  }}
                />
              );
            })}
            {grabbing && (
              <Rect
                x={grabbing.mapX}
                y={grabbing.mapY}
                width={grabbing.width}
                height={grabbing.height}
                fill="rgba(0,0,255,0.2)"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
