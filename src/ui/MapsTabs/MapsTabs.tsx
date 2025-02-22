import { useAtomValue, useSetAtom } from "jotai";
import { mapsAtom, currentMapIndexAtom } from "../../state";
import { unfocusMapToEditAtom } from "../../state/ui";

export function MapsTabs() {
  const maps = useAtomValue(mapsAtom);
  const currentMapIndex = useAtomValue(currentMapIndexAtom);
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
      <div>Currently visiting map "{currentMap.id}"</div>
    </div>
  );
}
