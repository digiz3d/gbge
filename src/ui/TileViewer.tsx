import { useAtomValue, useSetAtom } from "jotai";
import {
  Color,
  selectedTabIndex,
  selectTileIndex,
  setPixelColor,
  tileSets,
} from "../state";

const colorPalette: { r: number; g: number; b: number }[] = [
  { r: 155, g: 188, b: 15 },
  { r: 129, g: 162, b: 15 }, // original { r: 139, g: 172, b: 15 }
  { r: 48, g: 98, b: 48 },
  { r: 15, g: 36, b: 15 }, // original { r: 15, g: 56, b: 15 }
];

export function TileViewer({ small = false }: { small: boolean }) {
  const sets = useAtomValue(tileSets);
  const selectedTab = useAtomValue(selectedTabIndex);
  const x = sets[selectedTab];
  const selectedTile = useAtomValue(selectTileIndex);
  const tile = x.tiles[selectedTile];

  const setPixel = useSetAtom(setPixelColor);

  if (small) {
    return (
      <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
        {tile.map((pixel, i) => (
          <div
            className="h-[8px] w-[8px]"
            key={i}
            onClick={() =>
              setPixel(selectedTab, selectedTile, i, ((pixel + 1) % 4) as Color)
            }
            style={{
              backgroundColor: `rgba(${colorPalette[pixel].r}, ${colorPalette[pixel].g},${colorPalette[pixel].b})`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {tile.map((pixel, i) => (
        <div
          className="h-[32px] w-[32px] ring"
          key={i}
          onClick={() =>
            setPixel(selectedTab, selectedTile, i, ((pixel + 1) % 4) as Color)
          }
          style={{
            backgroundColor: `rgba(${colorPalette[pixel].r}, ${colorPalette[pixel].g},${colorPalette[pixel].b})`,
          }}
        />
      ))}
    </div>
  );
}
