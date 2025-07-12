import { useAtomValue, useSetAtom } from "jotai";
import {
  currentEditedMapIndexAtom,
  currentSelectionAtom,
  unfocusMapToEditAtom,
} from "../../state/ui";
import { mapsAtom } from "../../state/map";

const HARDWARE_OFFSETS = {
  x: 8,
  y: 16,
} as const;

export function MapsTabs() {
  const maps = useAtomValue(mapsAtom);
  const currentMapIndex = useAtomValue(currentEditedMapIndexAtom);
  const unfocusMapToEdit = useSetAtom(unfocusMapToEditAtom);
  const currentSelection = useAtomValue(currentSelectionAtom);

  if (currentMapIndex === null) return null;

  const currentMap = maps[currentMapIndex];

  return (
    <div className="flex flex-row gap-2 items-baseline w-full">
      <button
        className="bg-gray-300 p-2 cursor-pointer"
        onClick={() => unfocusMapToEdit()}
      >
        Back
      </button>
      <div>Editing map "{currentMap.id}"</div>
      {currentSelection.mode === "mapTiles" &&
        currentSelection.indexes.length > 0 && (
          <div>
            Coordinates: X:
            {(currentSelection.indexes[0] % currentMap.size.width) * 8 +
              HARDWARE_OFFSETS.x}{" "}
            Y:
            {Math.floor(
              (currentSelection.indexes[0] / currentMap.size.width) * 8
            ) + HARDWARE_OFFSETS.y}
          </div>
        )}
    </div>
  );
}
