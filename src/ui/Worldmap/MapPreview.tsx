import Konva from "konva";
import { useMemo } from "react";
import { Image, Rect, Text } from "react-konva";
import useImage from "use-image";
import { createMapImage } from "../../utils/tileImage";
import { useAtomValue } from "jotai";
import { MapEntity } from "../../state/map";
import { areMapIdsVisibleAtom } from "../../state/ui";
import { TileSet } from "../../state/tiles";

export function MapPreview(props: {
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
}) {
  const areMapIdsVisible = useAtomValue(areMapIdsVisibleAtom);
  const {
    map,
    tileSet,
    highlightCount: isHighlighted,
    x,
    y,
    width,
    height,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
  } = props;
  const url = useMemo(() => createMapImage(map, tileSet), [map, tileSet]);

  const [img] = useImage(url);

  const textX = x + 2;
  const textY = y + 2;

  return (
    <>
      <Image
        x={x}
        y={y}
        width={width}
        height={height}
        image={img}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      {isHighlighted !== null && (
        <>
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="#4f39f6"
            opacity={0.25}
          />
          <Text
            text={isHighlighted.toString()}
            x={x}
            y={y}
            fill="black"
            scaleX={2}
            scaleY={2}
            width={width / 2}
            height={height / 2}
            strokeWidth={2}
            align="center"
            verticalAlign="middle"
            stroke="black"
            listening={false}
          />
          <Text
            text={isHighlighted.toString()}
            x={x}
            y={y}
            fill="white"
            scaleX={2}
            scaleY={2}
            width={width / 2}
            height={height / 2}
            strokeWidth={1}
            align="center"
            verticalAlign="middle"
            stroke="white"
            listening={false}
          />
        </>
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
    </>
  );
}
