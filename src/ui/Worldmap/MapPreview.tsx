import Konva from "konva";
import { useMemo } from "react";
import { Image, Rect, Text } from "react-konva";
import useImage from "use-image";
import { createMapImage } from "../../utils/tileImage";
import { areMapIdsVisibleAtom, MapEntity, TileSet } from "../../state";
import { useAtomValue } from "jotai";

export function MapPreview(props: {
  map: MapEntity;
  tileSet: TileSet;
  isHighlighted: boolean;
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
    isHighlighted,
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
      {isHighlighted && (
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#4f39f6"
          opacity={0.25}
        />
      )}
      {areMapIdsVisible && (
        <>
          <Text
            text={map.id}
            x={textX}
            y={textY}
            strokeWidth={2}
            stroke="black"
            listening={false}
          />
          <Text
            text={map.id}
            x={textX}
            y={textY}
            strokeWidth={1}
            stroke="white"
            listening={false}
          />
        </>
      )}
    </>
  );
}
