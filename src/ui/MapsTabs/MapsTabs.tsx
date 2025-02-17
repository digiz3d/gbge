import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { mapsAtom, currentMapIndexAtom } from "../../state";
import { unfocusMapToEditAtom } from "../../state/ui";

export function MapsTabs() {
  const maps = useAtomValue(mapsAtom);
  const [currentMapIndex, setCurrentMapIndex] = useAtom(currentMapIndexAtom);

  const unfocusMapToEdit = useSetAtom(unfocusMapToEditAtom);

  return (
    <div className="flex flex-row  gap-2 bg-gray-300 p-2 cursor-pointer">
      <button onClick={() => unfocusMapToEdit()}>Worldmap</button>
    </div>
  );

  return (
    <div className="flex flex-row  gap-2">
      {maps.map((map, index) => (
        <div
          className={`transition-all duration-150 p-2 cursor-pointer ${
            currentMapIndex === index ? "bg-gray-300" : "bg-gray-100"
          }`}
          key={index}
          onClick={() => {
            setCurrentMapIndex(index);
          }}
        >
          {map.name}
        </div>
      ))}
    </div>
  );
}
