import Konva from "konva";
import { Rect, Text } from "react-konva";
import { useAtomValue } from "jotai";
import { MapEntity } from "../../state/map";
import {
  areMapIdsVisibleAtom,
  currentEditedMapIndexAtom,
  isVisibleMapGridAtom,
} from "../../state/ui";
import { TileSet } from "../../state/tiles";
import { MapGrid } from "./MapGrid";
import { MapPreviewStatic } from "./MapPreviewStatic";

export function MapPreview(props: {
  mapIndex: number;
  map: MapEntity;
  tileSet: TileSet;
  highlightCount: number | null;
  x: number;
  y: number;
  width: number;
  height: number;
  onMouseDown?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseEnter?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseLeave?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
}) {
  const isGridVisible = useAtomValue(isVisibleMapGridAtom);
  const areMapIdsVisible = useAtomValue(areMapIdsVisibleAtom);
  const currentEditedMapIndex = useAtomValue(currentEditedMapIndexAtom);
  const {
    mapIndex,
    map,
    tileSet,
    highlightCount,
    x,
    y,
    width,
    height,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  } = props;
  const isEditingMap = mapIndex === currentEditedMapIndex;

  const textX = x + 2;
  const textY = y + 2;

  const scale = width < 64 ? 1 : 2;

  return (
    <>
      {isEditingMap ? null : (
        <MapPreviewStatic
          map={map}
          tileSet={tileSet}
          x={x}
          y={y}
          width={width}
          height={height}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        />
      )}
      {isEditingMap && isGridVisible && (
        <MapGrid x={x} y={y} width={width} height={height} map={map} />
      )}
      {areMapIdsVisible && (
        <>
          <Text
            text={map.id}
            x={textX}
            y={textY}
            strokeWidth={2}
            stroke="black"
            fill="black"
            listening={false}
          />
          <Text
            text={map.id}
            x={textX}
            y={textY}
            strokeWidth={1}
            stroke="white"
            fill="white"
            listening={false}
          />
        </>
      )}
      {highlightCount !== null && (
        <>
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="#4f39f6"
            opacity={0.25}
            listening={false}
          />
          <Text
            text={highlightCount.toString()}
            x={x}
            y={y}
            fill="black"
            scaleX={scale}
            scaleY={scale}
            width={width / scale}
            height={height / scale}
            strokeWidth={2}
            align="center"
            verticalAlign="middle"
            stroke="black"
            listening={false}
          />
          <Text
            text={highlightCount.toString()}
            x={x}
            y={y}
            fill="white"
            scaleX={scale}
            scaleY={scale}
            width={width / scale}
            height={height / scale}
            strokeWidth={1}
            align="center"
            verticalAlign="middle"
            stroke="white"
            listening={false}
          />
        </>
      )}
    </>
  );
}
