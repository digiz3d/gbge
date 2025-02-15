import { useAtomValue } from "jotai";
import { pixelToRgb, Tile } from "../state";
import { Atom } from "jotai";

export function TileViewerButSmall({ tileAtom }: { tileAtom: Atom<Tile> }) {
  const tile = useAtomValue(tileAtom);
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

export function TileViewerButSmallLikeAButton({
  onClick,
  tile,
}: {
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
            backgroundColor: pixelToRgb[pixel],
          }}
        />
      ))}
    </div>
  );
}
