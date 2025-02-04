import { colorPalette, Tile } from "../state";

export function TileViewerButSmall({ tile }: { tile: Tile }) {
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {tile.map((pixel, i) => (
        <div
          className="h-[8px] w-[8px]"
          key={i}
          style={{
            backgroundColor: `rgba(${colorPalette[pixel].r}, ${colorPalette[pixel].g},${colorPalette[pixel].b})`,
          }}
        />
      ))}
    </div>
  );
}
