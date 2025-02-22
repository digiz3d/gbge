import { useAtomValue, useSetAtom } from "jotai";
import { mapsAtom, currentMapIndexAtom } from "../../state";
import { unfocusMapToEditAtom } from "../../state/ui";

export function MapsTabs() {
  const maps = useAtomValue(mapsAtom);
  const currentMapIndex = useAtomValue(currentMapIndexAtom);

  const currentMap = maps[currentMapIndex];

  const unfocusMapToEdit = useSetAtom(unfocusMapToEditAtom);

  return (
    <div className="flex flex-row  gap-2 bg-gray-300 p-2 cursor-pointer">
      <div>Currently visiting {currentMap.id}</div>
      <button onClick={() => unfocusMapToEdit()}>Worldmap</button>
    </div>
  );
}
