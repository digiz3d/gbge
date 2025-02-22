import { Line } from "react-konva";

function minmax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function WorldMapOrigin({
  panning,
  canvasSize,
}: {
  panning: { x: number; y: number };
  canvasSize: { width: number; height: number };
}) {
  const cappedX = minmax(panning.x, 0, canvasSize.width - 2);
  const cappedY = minmax(panning.y, 0, canvasSize.height - 2);
  return (
    <>
      <Line
        points={[cappedX + 5, cappedY - 5, cappedX - 5, cappedY + 5]}
        stroke="black"
        strokeWidth={1}
      />
      <Line
        points={[cappedX - 5, cappedY - 5, cappedX + 5, cappedY + 5]}
        stroke="black"
        strokeWidth={1}
      />
    </>
  );
}
