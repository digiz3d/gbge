import { pixelToRgb, Tile } from "../../../state";

export function BeltTileButton({
  colors = pixelToRgb,
  onClick,
  tile,
}: {
  colors?: string[];
  onClick: () => void;
  tile: Tile;
}) {
  return (
    <div
      className="cursor-pointer grid grid-cols-8 grid-rows-8 w-[32px] h-[32px] border-2 border-black"
      onClick={onClick}
    >
      {tile.map((pixel, i) => (
        <div
          key={i}
          style={{
            backgroundColor: colors[pixel],
          }}
        />
      ))}
    </div>
  );
}
