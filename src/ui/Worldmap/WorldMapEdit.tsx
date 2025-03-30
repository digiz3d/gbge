import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
  currentEditedMapIndexAtom,
  selectedTileSetTabIndexAtom,
} from "../../state/ui";

import { Stage, Layer } from "react-konva";
import { MapPreview } from "./MapPreview";
import { WorldMapOrigin } from "./WorldMapOrigin";
import { hoveredMetaTileIndexAtom, metaTilesAtom } from "../../state/metatile";
import { mapsAtom } from "../../state/map";
import { tileSetsAtom } from "../../state/tileset";
import { MIDDLE_CLICK } from "../../state/utils";
import { MapsTabs } from "../MapsTabs/MapsTabs";
import { MapPreviewEditCanvas } from "./MapPreviewEditCanvas";
import { currentPanningAtom, currentZoomAtom } from "./WorldMap";

export function WorldmapEdit() {
  const currentMapIndex = useAtomValue(currentEditedMapIndexAtom)!;
  const maps = useAtomValue(mapsAtom);
  const currentMap = maps[currentMapIndex];
  const [currentPanning, setCurrentPanning] = useAtom(currentPanningAtom);
  const [zoom, setZoom] = useAtom(currentZoomAtom);

  const metaTiles = useAtomValue(metaTilesAtom);
  const hoveredMetaTileIndex = useAtomValue(hoveredMetaTileIndexAtom);
  const metaTileSpottedInMap =
    hoveredMetaTileIndex !== null
      ? metaTiles[hoveredMetaTileIndex].spottedAt
      : null;

  const tileSets = useAtomValue(tileSetsAtom);
  const selectedTileSetTabIndex = useAtomValue(selectedTileSetTabIndexAtom);
  const tileSet = tileSets[selectedTileSetTabIndex];
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
        currentMap.worldCoords.x * zoom + (currentMap.size.width / 2) * zoom;
      const halfMapHeight =
        currentMap.worldCoords.y * zoom + (currentMap.size.height / 2) * zoom;

      const centerOfMap = {
        x: Math.floor(remainingWidth / 2 - halfMapWidth),
        y: Math.floor(remainingHeight / 2 - halfMapHeight),
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
          onWheel={(e) => {
            e.evt.preventDefault();
            e.evt.stopPropagation();
            if (panning) return;

            setZoom((prevZoom) => {
              const isNegative = e.evt.deltaY < 0;
              const newZoom = isNegative
                ? Math.min(prevZoom + 1, 64)
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
          }}
        >
          <Layer
            imageSmoothingEnabled={
              zoom <= 8 ? true : false // allows seeing shapes that would disappear when zoomed out, due to pixelation
            }
          >
            <WorldMapOrigin panning={currentPanning} canvasSize={canvasSize} />
            {maps.map((map, index) => {
              if (index === currentMapIndex) {
                return null;
              }
              const highlightCount =
                metaTileSpottedInMap?.get(index)?.length ?? null;

              const isOutsideViewport =
                currentPanning.x + zoom * map.worldCoords.x >
                  canvasSize.width ||
                currentPanning.y + zoom * map.worldCoords.y >
                  canvasSize.height ||
                currentPanning.x + zoom * (map.worldCoords.x + map.size.width) <
                  0 ||
                currentPanning.y +
                  zoom * (map.worldCoords.y + map.size.height) <
                  0;

              if (isOutsideViewport) {
                return null;
              }

              return (
                <MapPreview
                  fogOfWar
                  key={map.id}
                  map={map}
                  tileSet={tileSet}
                  highlightCount={highlightCount}
                  height={zoom * map.size.height}
                  width={zoom * map.size.width}
                  x={currentPanning.x + zoom * map.worldCoords.x}
                  y={currentPanning.y + zoom * map.worldCoords.y}
                />
              );
            })}
          </Layer>
          <MapPreviewEditCanvas
            key={currentMapIndex + currentMap.tilesIndexes.join()}
            width={canvasSize.width}
            height={canvasSize.height}
            mapIndex={currentMapIndex}
            x={currentPanning.x + zoom * currentMap.worldCoords.x}
            y={currentPanning.y + zoom * currentMap.worldCoords.y}
          />
        </Stage>
      </div>
    </div>
  );
}
