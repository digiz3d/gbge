import { useAtom, useAtomValue } from "jotai";
import { mapsAtom, currentMapIndexAtom } from "../../state";

export function MapsTabs() {
  const maps = useAtomValue(mapsAtom);
  const [currentMapIndex, setCurrentMapIndex] = useAtom(currentMapIndexAtom);

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
