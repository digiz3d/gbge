import React, { useRef, useEffect, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  mapEditorCanvasAtom,
  pixelToRgb,
  selectTileIndexAtom,
  mapTileIndexesAtom,
  isVisibleMapGridAtom,
} from "../../state";

const PIXEL_SIZE = 2;
const TILE_SIZE = 8 * PIXEL_SIZE;
const MAP_TILES = 32;
const CANVAS_SIZE = TILE_SIZE * MAP_TILES;

let isDrawing = false;

export function MapEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelData = useAtomValue(mapEditorCanvasAtom);
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE + 10, CANVAS_SIZE + 10);

    for (let tileY = 0; tileY < MAP_TILES; tileY++) {
      for (let tileX = 0; tileX < MAP_TILES; tileX++) {
        const pixels = pixelData[tileY * MAP_TILES + tileX];
        pixels.forEach((color, pixelIndex) => {
          const pixelX = pixelIndex % 8;
          const pixelY = Math.floor(pixelIndex / 8);

          ctx.fillStyle = pixelToRgb[color];
          ctx.fillRect(
            tileX * TILE_SIZE + pixelX * 2,
            tileY * TILE_SIZE + pixelY * 2,
            2,
            2
          );
        });
      }
    }

    if (isGridVisible) {
      ctx.strokeStyle = "#00000044";
      ctx.lineWidth = 1;

      for (let x = 0; x <= MAP_TILES; x++) {
        ctx.beginPath();
        ctx.moveTo(x * TILE_SIZE, 0);
        ctx.lineTo(x * TILE_SIZE, CANVAS_SIZE);
        ctx.stroke();
      }

      for (let y = 0; y <= MAP_TILES; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * TILE_SIZE);
        ctx.lineTo(CANVAS_SIZE, y * TILE_SIZE);
        ctx.stroke();
      }
    }
  }, [pixelData, isGridVisible]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const selectedTileIndex = useAtomValue(selectTileIndexAtom);
  const setMapTileIndexes = useSetAtom(mapTileIndexesAtom);

  useEffect(() => {
    const globalMouseUp = () => {
      isDrawing = false;
    };
    window.addEventListener("mouseup", globalMouseUp);
    return () => {
      window.removeEventListener("mouseup", globalMouseUp);
    };
  }, []);

  const updateTile = useCallback(
    (x: number, y: number) => {
      const tileX = Math.floor(x / TILE_SIZE);
      const tileY = Math.floor(y / TILE_SIZE);

      if (tileX < 0 || tileX >= MAP_TILES || tileY < 0 || tileY >= MAP_TILES) {
        return;
      }

      const mapIndex = tileY * MAP_TILES + tileX;

      setMapTileIndexes((prev) => {
        const newIndexes = [...prev];
        newIndexes[mapIndex] = selectedTileIndex;
        return newIndexes;
      });
    },
    [selectedTileIndex, setMapTileIndexes]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(event.clientX - rect.left);
      const y = Math.floor(event.clientY - rect.top);

      updateTile(x, y);
    },
    [updateTile]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      isDrawing = true;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(event.clientX - rect.left);
      const y = Math.floor(event.clientY - rect.top);

      updateTile(x, y);
    },
    [updateTile]
  );

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    />
  );
}
