import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRef, useEffect } from "react";
import { mapsAtom, updateMapTilesIndexesAtom } from "../../state/map";
import { currentTileSetTilesAtom } from "../../state/tileset";
import {
  currentSelectionAtom,
  isVisibleMapGridAtom,
  isVisibleZoneAtom,
} from "../../state/ui";
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
import { currentZoomAtom } from "./WorldMap";

export function MapPreviewEditCanvas(props: {
  width: number;
  height: number;
  mapIndex: number;
  x: number;
  y: number;
}) {
  const zoom = useAtomValue(currentZoomAtom);
  const metaTiles = useAtomValue(metaTilesAtom);
  const { mapIndex, x, y } = props;
  const maps = useAtomValue(mapsAtom);
  const map = maps[mapIndex];
  const tileSetTiles = useAtomValue(currentTileSetTilesAtom);
  const updateMapTilesIndexes = useSetAtom(updateMapTilesIndexesAtom);
  const [currentSelection, setCurrentSelection] = useAtom(currentSelectionAtom);
  const canvasRef = useRef<Konva.Layer>(null);
  const tilesDraft = useRef(map.tilesIndexes.slice());
  const isDrawingRef = useRef(false);
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);
  const isZoneVisible = useAtomValue(isVisibleZoneAtom);
  const droppickMetaTile = useSetAtom(droppickMetaTileAtom);
  const droppickTile = useSetAtom(droppickTileAtom);
  const highlightedMetaTilesIndexes = useAtomValue(
    highlightMetaTilesIndexesAtom
  );
  const selectionZoneRef = useRef<{
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null>(null);

  function drawMap(ctx: CanvasRenderingContext2D) {
    if (!canvasRef.current) {
      console.log("no canvas");
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let i = 0;
    for (let yy = 0; yy < map.size.height; yy++) {
      for (let xx = 0; xx < map.size.width; xx++) {
        const tileIndexInTileSet = tilesDraft.current[yy * map.size.width + xx];
        const canvas = createTileCanvas(tileSetTiles[tileIndexInTileSet]);
        ctx.drawImage(canvas, x + xx * zoom, y + yy * zoom, zoom, zoom);
        if (
          currentSelection.mode === "mapTiles" &&
          currentSelection.indexes.includes(i)
        ) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(200,200,255,0.5)";
          ctx.rect(x + xx * zoom, y + yy * zoom, zoom, zoom);
          ctx.fill();
        }
        i++;
      }
    }

    if (isGridVisible) {
      drawGrid(
        ctx,
        x,
        y,
        map.size.width,
        map.size.height,
        currentSelection.mode,
        zoom
      );
    }

    drawHighlightedMetaTiles(
      ctx,
      x,
      y,
      map.size.width,
      highlightedMetaTilesIndexes,
      zoom
    );

    if (isZoneVisible) {
      drawZone(ctx, x, y, zoom);
    }

    if (selectionZoneRef.current) {
      drawSelection(
        ctx,
        x + selectionZoneRef.current.from.x,
        y + selectionZoneRef.current.from.y,
        selectionZoneRef.current.to.x - selectionZoneRef.current.from.x,
        selectionZoneRef.current.to.y - selectionZoneRef.current.from.y
      );
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("no canvas");
      return;
    }

    const mapActualCanvas = canvas.getCanvas()._canvas;

    const ctx = mapActualCanvas.getContext("2d");
    if (!ctx) {
      console.log("no ctx");
      return;
    }

    if (!ctx.canvas.width || !ctx.canvas.height) {
      console.log("no width or height");
      return;
    }

    drawMap(ctx);

    const handleDraw = (e: MouseEvent) => {
      const rect = mapActualCanvas.getBoundingClientRect();
      if (currentSelection.mode === "tile") {
        const xx = Math.floor((e.clientX - rect.left - x) / zoom);
        const yy = Math.floor((e.clientY - rect.top - y) / zoom);

        if (
          !(xx >= 0 && xx < map.size.width && yy >= 0 && yy < map.size.height)
        ) {
          return;
        }

        const index = yy * map.size.width + xx;
        if (tilesDraft.current[index] !== currentSelection.index) {
          tilesDraft.current[index] = currentSelection.index;
        }
      } else if (currentSelection.mode === "metaTile") {
        const metaTileX =
          Math.floor((e.clientX - rect.left - x) / (zoom * 2)) * 2;
        const metaTileY =
          Math.floor((e.clientY - rect.top - y) / (zoom * 2)) * 2;

        if (
          !(
            metaTileX >= 0 &&
            metaTileX < map.size.width &&
            metaTileY >= 0 &&
            metaTileY < map.size.height
          )
        ) {
          return;
        }

        const tileIndex = metaTileY * map.size.width + metaTileX;

        const metaTile = metaTiles[currentSelection.index];
        const [i1, i2, i3, i4] = metaTile.tileIndexes;
        tilesDraft.current[tileIndex] = i1;
        tilesDraft.current[tileIndex + 1] = i2;
        tilesDraft.current[tileIndex + map.size.width] = i3;
        tilesDraft.current[tileIndex + map.size.width + 1] = i4;
      }
      drawMap(ctx);
    };

    const handleSelectionInit = (e: MouseEvent) => {
      const rect = mapActualCanvas.getBoundingClientRect();
      const xx = Math.floor(e.clientX - rect.left - x);
      const yy = Math.floor(e.clientY - rect.top - y);
      selectionZoneRef.current = {
        from: { x: xx, y: yy },
        to: { x: xx, y: yy },
      };
      drawMap(ctx);
    };

    const handleSelectionMove = (e: MouseEvent) => {
      const rect = mapActualCanvas.getBoundingClientRect();
      const xx = Math.floor(e.clientX - rect.left - x);
      const yy = Math.floor(e.clientY - rect.top - y);
      selectionZoneRef.current!.to = { x: xx, y: yy };
      drawMap(ctx);
    };

    const handleSelectionEnd = (_: MouseEvent) => {
      const tileIndexes: number[] = [];
      if (!selectionZoneRef.current) {
        return;
      }

      const minX = Math.min(
        selectionZoneRef.current.from.x,
        selectionZoneRef.current.to.x
      );
      const maxX = Math.max(
        selectionZoneRef.current.from.x,
        selectionZoneRef.current.to.x
      );
      const minY = Math.min(
        selectionZoneRef.current.from.y,
        selectionZoneRef.current.to.y
      );
      const maxY = Math.max(
        selectionZoneRef.current.from.y,
        selectionZoneRef.current.to.y
      );

      // allows counting from start of first tile
      const minXFromStart = minX - (minX % zoom);
      const minYFromStart = minY - (minY % zoom);

      // for loop that adds tile indexes
      for (let yy = minYFromStart; yy <= maxY; yy += zoom) {
        for (let xx = minXFromStart; xx <= maxX; xx += zoom) {
          const tileX = Math.floor(xx / zoom);
          const tileY = Math.floor(yy / zoom);
          if (
            tileX >= 0 &&
            tileX < map.size.width &&
            tileY >= 0 &&
            tileY < map.size.height
          ) {
            tileIndexes.push(tileY * map.size.width + tileX);
          }
        }
      }

      selectionZoneRef.current = null;

      setCurrentSelection({
        indexes: tileIndexes,
        mode: "mapTiles",
        tool: "selection",
        trigger: "manual",
        width: Math.ceil(maxX / zoom) - Math.floor(minX / zoom),
      });
    };

    const handleDroppick = (e: MouseEvent) => {
      const rect = mapActualCanvas.getBoundingClientRect();
      if (currentSelection.mode === "tile") {
        const xx = Math.floor((e.clientX - rect.left - x) / zoom);
        const yy = Math.floor((e.clientY - rect.top - y) / zoom);

        if (
          !(xx >= 0 && xx < map.size.width && yy >= 0 && yy < map.size.height)
        ) {
          return;
        }

        const index = yy * map.size.width + xx;
        const tile = tileSetTiles[tilesDraft.current[index]];
        droppickTile(tile);
      } else if (currentSelection.mode === "metaTile") {
        const metaTileX =
          Math.floor((e.clientX - rect.left - x) / (zoom * 2)) * 2;
        const metaTileY =
          Math.floor((e.clientY - rect.top - y) / (zoom * 2)) * 2;

        if (
          !(
            metaTileX >= 0 &&
            metaTileX < map.size.width &&
            metaTileY >= 0 &&
            metaTileY < map.size.height
          )
        ) {
          return;
        }

        const tileIndex = metaTileY * map.size.width + metaTileX;

        droppickMetaTile({
          tileIndexes: [
            tilesDraft.current[tileIndex],
            tilesDraft.current[tileIndex + 1],
            tilesDraft.current[tileIndex + map.size.width],
            tilesDraft.current[tileIndex + map.size.width + 1],
          ],
        });
      }
    };

    const handleMouseDown = (e: Event) => {
      if (!(e instanceof MouseEvent)) return;
      if (e.button === LEFT_CLICK) {
        if (currentSelection.tool === "brush") {
          if (
            e.offsetX < x ||
            e.offsetX > x + map.size.width * zoom ||
            e.offsetY < y ||
            e.offsetY > y + map.size.height * zoom
          ) {
            return;
          }
          isDrawingRef.current = true;
          handleDraw(e);
        } else if (currentSelection.tool === "selection") {
          handleSelectionInit(e);
        }
      } else if (e.button === RIGHT_CLICK) {
        handleDroppick(e);
      }
    };

    const handleMouseMove = (e: Event) => {
      if (!(e instanceof MouseEvent)) return;

      if (currentSelection.tool === "brush") {
        if (!isDrawingRef.current) return;
        handleDraw(e);
      } else if (currentSelection.tool === "selection") {
        if (!selectionZoneRef.current) return;
        handleSelectionMove(e);
      }
    };

    const handleMouseUp = (e: Event) => {
      if (!(e instanceof MouseEvent)) return;

      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        updateMapTilesIndexes(tilesDraft.current);
      } else if (selectionZoneRef.current) {
        handleSelectionEnd(e);
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (currentSelection.mode === "mapTiles") {
          const tileIndexes = currentSelection.indexes;
          tileIndexes.forEach((index) => {
            tilesDraft.current[index] = 0;
          });
          updateMapTilesIndexes(tilesDraft.current);
          drawMap(ctx);
        }
      }
    };

    mapActualCanvas.addEventListener("mousedown", handleMouseDown);
    mapActualCanvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      mapActualCanvas.removeEventListener("mousedown", handleMouseDown);
      mapActualCanvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    x,
    y,
    currentSelection,
    isGridVisible,
    isZoneVisible,
    tileSetTiles,
    highlightedMetaTilesIndexes,
    metaTiles,
    map,
  ]);

  return (
    <Layer
      className="absolute top-0 left-0 touch-none"
      clearBeforeDraw={false} // prevent empty canvas on mount
      height={map.size.height}
      imageSmoothingEnabled={false}
      listening={false}
      ref={canvasRef}
      width={map.size.width}
    />
  );
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mapTilesCountWidth: number,
  mapTilesCountHeight: number,
  mode: "tile" | "metaTile" | "mapTiles",
  zoom: number
) {
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;

  const isTile = mode === "tile" || mode === "mapTiles";

  const linesCountX = isTile ? mapTilesCountWidth : mapTilesCountWidth / 2;
  const linesCountY = isTile ? mapTilesCountHeight : mapTilesCountHeight / 2;

  const spacingFactor = isTile ? 1 : 4;
  const spacingX = (zoom / mapTilesCountWidth) * spacingFactor;
  // vertical lines
  for (let i = 1; i < linesCountX; i++) {
    const xx = x + spacingX * i * linesCountX;
    ctx.beginPath();
    ctx.moveTo(xx, y);
    ctx.lineTo(xx, y + mapTilesCountHeight * zoom);
    ctx.stroke();
  }

  const spacingY = (zoom / mapTilesCountHeight) * spacingFactor;
  // horizontal lines
  for (let i = 1; i < linesCountY; i++) {
    const yy = y + spacingY * i * linesCountY;
    ctx.beginPath();
    ctx.moveTo(x, yy);
    ctx.lineTo(x + mapTilesCountWidth * zoom, yy);
    ctx.stroke();
  }
}

function drawHighlightedMetaTiles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mapTilesCountWidth: number,
  highlightedMetaTilesIndexes: number[],
  zoom: number
) {
  // draw blue square on each highlighted meta tile
  for (let i = 0; i < highlightedMetaTilesIndexes.length; i++) {
    const index = highlightedMetaTilesIndexes[i];
    const xx = x + (index % mapTilesCountWidth) * zoom;
    const yy = y + Math.floor(index / mapTilesCountWidth) * zoom;

    ctx.beginPath();
    ctx.fillStyle = "oklch(0.511 0.262 276.966 / 0.25)";
    ctx.rect(xx, yy, zoom * 2, zoom * 2);
    ctx.fill();
  }
}

function drawZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number
) {
  ctx.beginPath();
  ctx.rect(x, y, 20 * zoom, 18 * zoom);
  ctx.strokeStyle = "#FF000077";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawSelection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.rect(x, y, width, height);
  ctx.fill();
}
