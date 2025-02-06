import { Tile } from "../../../state";
import { TileViewerButSmallLikeAButton } from "../../TileViewerButSmall";

export function BeltTileButton({
  tile,
  onClick,
}: {
  tile: Tile;
  onClick: () => void;
}) {
  return <TileViewerButSmallLikeAButton onClick={onClick} tile={tile} />;
}
