import { MapEntity, TileSet } from "../../state";
import { createMapImage } from "../../utils/tileImage";

export function MapPreview(
  props: React.JSX.IntrinsicElements["div"] & {
    tileSize: number;
    map: MapEntity;
    tileSet: TileSet;
    maxWidth: number;
    maxHeight: number;
  }
) {
  const { tileSize, map, tileSet, onMouseDown, maxWidth, maxHeight } = props;

  <div
    onMouseDown={onMouseDown}
    className="absolute bg-amber-50"
    style={{
      width: tileSize * map.size.width,
      height: tileSize * map.size.height,
      left: tileSize * maxWidth + tileSize * map.worldCoords.x,
      top: tileSize * maxHeight + tileSize * map.worldCoords.y,
    }}
  >
    <img src={createMapImage(tileSize, map, tileSet)} />
  </div>;
}
