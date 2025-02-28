import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useEffect, useState } from "react";
import { mapsAtom, updateMapTilesIndexesAtom } from "../../state/map";
import { currentTileSetTilesAtom } from "../../state/tileset";
import {
  currentSelectionAtom,
  isVisibleMapGridAtom,
  isVisibleZoneAtom,
} from "../../state/ui";
import { tileSizePx } from "./utils";
import { Layer } from "react-konva";
import Konva from "konva";
import { LEFT_CLICK, RIGHT_CLICK } from "../../state/utils";
import { createTileCanvas } from "../../utils/tileImage";
import {
  droppickMetaTileAtom,
  highlightMetaTilesIndexesAtom,
  metaTilesAtom,
} from "../../state/metatile";
import { droppickTileAtom } from "../../state/tiles";

export function MapPreviewEditCanvas(props: {
  width: number;
  height: number;
  mapIndex: number;
  x: number;
  y: number;
}) {
  const metaTiles = useAtomValue(metaTilesAtom);
  const render = useRef(0);
  const { mapIndex, x, y } = props;
  const maps = useAtomValue(mapsAtom);
  const map = maps[mapIndex];
  const { height, width } = map.size;
  const tileSetTiles = useAtomValue(currentTileSetTilesAtom);
  const updateMapTilesIndexes = useSetAtom(updateMapTilesIndexesAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);
  const canvasRef = useRef<Konva.Layer>(null);
  const tilesDraft = useRef(map.tilesIndexes.slice());
  const isDrawingRef = useRef(false);
  const [, forceUpdate] = useState({});
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);
  const isZoneVisible = useAtomValue(isVisibleZoneAtom);
  const droppickMetaTile = useSetAtom(droppickMetaTileAtom);
  const droppickTile = useSetAtom(droppickTileAtom);
  const highlightedMetaTilesIndexes = useAtomValue(
    highlightMetaTilesIndexesAtom
  );

  render.current++;

  function drawMap(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let yy = 0; yy < height; yy++) {
      for (let xx = 0; xx < width; xx++) {
        const tileIndex = tilesDraft.current[yy * width + xx];
        const canvas = createTileCanvas(tileSetTiles[tileIndex]);
        ctx.drawImage(
          canvas,
          x + xx * tileSizePx,
          y + yy * tileSizePx,
          tileSizePx,
          tileSizePx
        );
      }
    }

    if (isGridVisible) {
      drawGrid(ctx, x, y, width, height, currentSelection.mode);
    }

    drawHighlightedMetaTiles(ctx, x, y, width, highlightedMetaTilesIndexes);

    if (isZoneVisible) {
      drawZone(ctx, x, y);
    }
  }

  useEffect(() => {
    if (render.current === 1) {
      setTimeout(() => forceUpdate({}), 0);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const mapActualCanvas = canvas.getCanvas()._canvas;

    const ctx = mapActualCanvas.getContext("2d");
    if (!ctx) {
      return;
    }

    drawMap(ctx);

    const handleDraw = (e: MouseEvent) => {
      const rect = mapActualCanvas.getBoundingClientRect();
      if (currentSelection.mode === "tile") {
        const xx = Math.floor((e.clientX - rect.left - x) / tileSizePx);
        const yy = Math.floor((e.clientY - rect.top - y) / tileSizePx);

        if (!(xx >= 0 && xx < width && yy >= 0 && yy < height)) {
          return;
        }

        const index = yy * width + xx;
        if (tilesDraft.current[index] !== currentSelection.index) {
          tilesDraft.current[index] = currentSelection.index;
          drawMap(ctx);
        }
      } else if (currentSelection.mode === "metaTile") {
        const metaTileX =
          Math.floor((e.clientX - rect.left - x) / (tileSizePx * 2)) * 2;
        const metaTileY =
          Math.floor((e.clientY - rect.top - y) / (tileSizePx * 2)) * 2;

        if (
          !(
            metaTileX >= 0 &&
            metaTileX < width &&
            metaTileY >= 0 &&
            metaTileY < height
          )
        ) {
          return;
        }

        const tileIndex = metaTileY * width + metaTileX;

        const metaTile = metaTiles[currentSelection.index];
        const [i1, i2, i3, i4] = metaTile.tileIndexes;
        tilesDraft.current[tileIndex] = i1;
        tilesDraft.current[tileIndex + 1] = i2;
        tilesDraft.current[tileIndex + width] = i3;
        tilesDraft.current[tileIndex + width + 1] = i4;
        drawMap(ctx);
      }
    };

    const handleDroppick = (e: MouseEvent) => {
      const rect = mapActualCanvas.getBoundingClientRect();
      if (currentSelection.mode === "tile") {
        const xx = Math.floor((e.clientX - rect.left - x) / tileSizePx);
        const yy = Math.floor((e.clientY - rect.top - y) / tileSizePx);

        if (!(xx >= 0 && xx < width && yy >= 0 && yy < height)) {
          return;
        }

        const index = yy * width + xx;
        const tile = tileSetTiles[tilesDraft.current[index]];
        droppickTile(tile);
      } else if (currentSelection.mode === "metaTile") {
        const metaTileX =
          Math.floor((e.clientX - rect.left - x) / (tileSizePx * 2)) * 2;
        const metaTileY =
          Math.floor((e.clientY - rect.top - y) / (tileSizePx * 2)) * 2;

        if (
          !(
            metaTileX >= 0 &&
            metaTileX < width &&
            metaTileY >= 0 &&
            metaTileY < height
          )
        ) {
          return;
        }

        const tileIndex = metaTileY * width + metaTileX;

        droppickMetaTile({
          tileIndexes: [
            tilesDraft.current[tileIndex],
            tilesDraft.current[tileIndex + 1],
            tilesDraft.current[tileIndex + width],
            tilesDraft.current[tileIndex + width + 1],
          ],
        });
      }
    };

    const handleMouseDown = (e: Event) => {
      if (!(e instanceof MouseEvent)) return;
      if (e.button === LEFT_CLICK) {
        if (
          e.offsetX < x ||
          e.offsetX > x + width * tileSizePx ||
          e.offsetY < y ||
          e.offsetY > y + height * tileSizePx
        ) {
          return;
        }
        isDrawingRef.current = true;
        handleDraw(e);
      } else if (e.button === RIGHT_CLICK) {
        handleDroppick(e);
      }
    };

    const handleMouseMove = (e: Event) => {
      if (!(e instanceof MouseEvent)) return;
      if (!isDrawingRef.current) return;
      handleDraw(e);
    };

    const handleMouseUp = (_: Event) => {
      isDrawingRef.current = false;
      updateMapTilesIndexes(tilesDraft.current);
    };

    mapActualCanvas.addEventListener("mousedown", handleMouseDown);
    mapActualCanvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      mapActualCanvas.removeEventListener("mousedown", handleMouseDown);
      mapActualCanvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [x, y, width, height, render.current]);

  return (
    <Layer
      imageSmoothingEnabled={false}
      listening={false}
      className="absolute top-0 left-0 touch-none"
      height={props.height}
      ref={canvasRef}
      width={props.width}
    />
  );
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mapTilesCountWidth: number,
  mapTilesCountHeight: number,
  mode: "tile" | "metaTile"
) {
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;

  const linesCountX =
    mode === "tile" ? mapTilesCountWidth : mapTilesCountWidth / 2;
  const linesCountY =
    mode === "tile" ? mapTilesCountHeight : mapTilesCountHeight / 2;

  const spacingFactor = mode === "tile" ? 1 : 4;
  const spacingX = (tileSizePx / mapTilesCountWidth) * spacingFactor;
  // vertical lines
  for (let i = 1; i < linesCountX; i++) {
    const xx = x + spacingX * i * linesCountX;
    ctx.beginPath();
    ctx.moveTo(xx, y + 0);
    ctx.lineTo(xx, y + mapTilesCountWidth * tileSizePx);
    ctx.stroke();
  }

  const spacingY = (tileSizePx / mapTilesCountHeight) * spacingFactor;
  // horizontal lines
  for (let i = 1; i < linesCountY; i++) {
    const yy = y + spacingY * i * linesCountY;
    ctx.beginPath();
    ctx.moveTo(x + 0, yy);
    ctx.lineTo(x + mapTilesCountHeight * tileSizePx, yy);
    ctx.stroke();
  }
}

function drawHighlightedMetaTiles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mapTilesCountWidth: number,
  highlightedMetaTilesIndexes: number[]
) {
  // draw blue square on each highlighted meta tile
  for (let i = 0; i < highlightedMetaTilesIndexes.length; i++) {
    const index = highlightedMetaTilesIndexes[i];
    const xx = x + (index % mapTilesCountWidth) * tileSizePx;
    const yy = y + Math.floor(index / mapTilesCountWidth) * tileSizePx;

    ctx.beginPath();
    ctx.fillStyle = "oklch(0.511 0.262 276.966 / 0.25)";
    ctx.rect(xx, yy, tileSizePx * 2, tileSizePx * 2);
    ctx.fill();
  }
}

function drawZone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.rect(x, y, 20 * tileSizePx, 18 * tileSizePx);
  ctx.strokeStyle = "#FF000077";
  ctx.lineWidth = 2;
  ctx.stroke();
}
