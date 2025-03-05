import { pixelToRgb, Tile } from "../state/tiles";

export function TileViewerButSmall({ tile }: { tile: Tile }) {
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {tile.map((pixel, i) => (
        <div
          className="h-[8px] w-[8px]"
          key={i}
          style={{
            backgroundColor: pixelToRgb[pixel],
          }}
        />
      ))}
    </div>
  );
}
