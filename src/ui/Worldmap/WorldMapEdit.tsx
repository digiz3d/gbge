import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { currentEditedMapIndexAtom } from "../../state/ui";

import { Stage, Layer } from "react-konva";
import { MapPreview } from "./MapPreview";
import { WorldMapOrigin } from "./WorldMapOrigin";
import { hoveredMetaTileIndexAtom, metaTilesAtom } from "../../state/metatile";
import { mapsAtom } from "../../state/map";
import { tileSetsAtom } from "../../state/tileset";
import { MIDDLE_CLICK } from "../../state/utils";
import { MapsTabs } from "../MapsTabs/MapsTabs";
import { MapPreviewEditCanvas } from "./MapPreviewEditCanvas";
import { tileSizePx } from "./utils";

export function WorldmapEdit() {
  const currentMapIndex = useAtomValue(currentEditedMapIndexAtom)!;
  const maps = useAtomValue(mapsAtom);
  const currentMap = maps[currentMapIndex];
  const centerOfMap = {
    x:
      currentMap.worldCoords.x * tileSizePx +
      (currentMap.size.width / 2) * tileSizePx,
    y:
      currentMap.worldCoords.y * tileSizePx +
      (currentMap.size.height / 2) * tileSizePx,
  };
  const [currentPanning, setCurrentPanning] = useState(centerOfMap);

  const metaTiles = useAtomValue(metaTilesAtom);
  const hoveredMetaTileIndex = useAtomValue(hoveredMetaTileIndexAtom);
  const metaTileSpottedInMap =
    hoveredMetaTileIndex !== null
      ? metaTiles[hoveredMetaTileIndex].spottedAt
      : null;

  const [tileSet] = useAtomValue(tileSetsAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panning, setPanning] = useState(false);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseUp = () => {
      setPanning(false);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [maps]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });

      const remainingWidth = width - currentMap.size.width;
      const remainingHeight = height - currentMap.size.height;

      const halfMapWidth =
        currentMap.worldCoords.x * tileSizePx +
        (currentMap.size.width / 2) * tileSizePx;
      const halfMapHeight =
        currentMap.worldCoords.y * tileSizePx +
        (currentMap.size.height / 2) * tileSizePx;

      const centerOfMap = {
        x: remainingWidth / 2 - halfMapWidth,
        y: remainingHeight / 2 - halfMapHeight,
      };
      setCurrentPanning(centerOfMap);
    };

    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef.current]);

  return (
    <div className="flex flex-col flex-1">
      <MapsTabs />
      <div
        className="flex-1 overflow-hidden relative border-1"
        ref={containerRef}
      >
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute top-0 left-0"
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
          }}
        >
          <Layer imageSmoothingEnabled={false}>
            <WorldMapOrigin panning={currentPanning} canvasSize={canvasSize} />
            {maps.map((map, index) => {
              const highlightCount =
                metaTileSpottedInMap?.get(index)?.length ?? null;

              const isOutsideViewport =
                currentPanning.x + tileSizePx * map.worldCoords.x >
                  canvasSize.width ||
                currentPanning.y + tileSizePx * map.worldCoords.y >
                  canvasSize.height ||
                currentPanning.x +
                  tileSizePx * (map.worldCoords.x + map.size.width) <
                  0 ||
                currentPanning.y +
                  tileSizePx * (map.worldCoords.y + map.size.height) <
                  0;

              if (isOutsideViewport) {
                return null;
              }

              return (
                <MapPreview
                  key={map.id}
                  mapIndex={index}
                  map={map}
                  tileSet={tileSet}
                  highlightCount={highlightCount}
                  height={tileSizePx * map.size.height}
                  width={tileSizePx * map.size.width}
                  x={currentPanning.x + tileSizePx * map.worldCoords.x}
                  y={currentPanning.y + tileSizePx * map.worldCoords.y}
                />
              );
            })}
          </Layer>
          <MapPreviewEditCanvas
            key={currentMapIndex}
            width={canvasSize.width}
            height={canvasSize.height}
            mapIndex={currentMapIndex}
            x={currentPanning.x + tileSizePx * currentMap.worldCoords.x}
            y={currentPanning.y + tileSizePx * currentMap.worldCoords.y}
          />
        </Stage>
      </div>
    </div>
  );
}
