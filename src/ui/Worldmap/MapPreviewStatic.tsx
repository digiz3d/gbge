import { Image } from "react-konva";
import { createMapImage } from "../../utils/tileImage";
import { useMemo } from "react";
import useImage from "use-image";
import { TileSet } from "../../state/tiles";
import Konva from "konva";
import { MapEntity } from "../../state/map";

export function MapPreviewStatic(props: {
  map: MapEntity;
  tileSet: TileSet;
  x: number;
  y: number;
  width: number;
  height: number;
  onMouseDown?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseEnter?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseLeave?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
}) {
  const {
    map,
    tileSet,
    x,
    y,
    width,
    height,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  } = props;

  const url = useMemo(() => createMapImage(map, tileSet), [map, tileSet]);

  const [img] = useImage(url);

  return (
    <Image
      x={x}
      y={y}
      width={width}
      height={height}
      image={img}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    />
  );
}
