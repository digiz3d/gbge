import Konva from "konva";
import { memo, useMemo } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import { createMapImage } from "../../utils/tileImage";
import { MapEntity, TileSet } from "../../state";

export const MapPreview = memo(function MapPreview(props: {
  map: MapEntity;
  tileSet: TileSet;
  x: number;
  y: number;
  width: number;
  height: number;
  onMouseDown?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseEnter?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseLeave?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
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
    />
  );
});
