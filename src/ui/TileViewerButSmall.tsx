import useImage from "use-image";
import { Tile } from "../state/tiles";
import { useMemo } from "react";
import { createTileImage } from "../utils/tileImage";
import { Image, Layer, Stage } from "react-konva";

export function TileViewerButSmall({ tile }: { tile: Tile }) {
  const url = useMemo(() => createTileImage(tile), [tile]);

  const [img] = useImage(url);

  if (!img) {
    return null;
  }

  return (
    <Stage
      className="grid grid-cols-1 grid-rows-1 w-[64px] h-[64px]"
      height={64}
      width={64}
    >
      <Layer imageSmoothingEnabled={false}>
        <Image image={img} height={64} width={64} />
      </Layer>
    </Stage>
  );
}
