import { useAtomValue, useSetAtom } from "jotai";
import {
  currentEditedMapIndexAtom,
  unfocusMapToEditAtom,
} from "../../state/ui";
import { mapsAtom } from "../../state/map";

export function MapsTabs() {
  const maps = useAtomValue(mapsAtom);
  const currentMapIndex = useAtomValue(currentEditedMapIndexAtom);
  const unfocusMapToEdit = useSetAtom(unfocusMapToEditAtom);

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
    </div>
  );
}
