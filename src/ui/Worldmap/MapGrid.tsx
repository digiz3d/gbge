import { useAtomValue } from "jotai";
import { currentSelectionAtom } from "../../state/ui";
import { Line } from "react-konva";
import { MapEntity } from "../../state/map";

export function MapGrid({
  x,
  y,
  width,
  height,
  map,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  map: MapEntity;
}) {
  const currentSelection = useAtomValue(currentSelectionAtom);

  const linesCountX =
    map.size.width / (currentSelection.mode === "tile" ? 1 : 2);
  const linesCountY =
    map.size.height / (currentSelection.mode === "tile" ? 1 : 2);

  const intervalX = width / linesCountX;
  const intervalY = height / linesCountY;

  return (
    <>
      {new Array(linesCountY - 1).fill(null).map((_, i) => {
        return (
          <Line
            listening={false}
            key={`horizontal-${i}`}
            points={[
              x,
              y + i * intervalY + intervalY,
              x + width,
              y + i * intervalY + intervalY,
            ]}
            stroke="silver"
            strokeWidth={1}
          />
        );
      })}
      {new Array(linesCountX - 1).fill(null).map((_, i) => {
        return (
          <Line
            listening={false}
            key={`vertical-${i}`}
            points={[
              x + i * intervalX + intervalX,
              y,
              x + i * intervalX + intervalX,
              y + height,
            ]}
            stroke="silver"
            strokeWidth={1}
          />
        );
      })}
    </>
  );
}
