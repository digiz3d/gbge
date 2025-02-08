import { useAtomValue } from "jotai";
import { metaTilesAtom } from "../../state";

export function MetaTileCompute() {
  const metaTilesTileIndexes = useAtomValue(metaTilesAtom);

  return (
    <div className="flex flex-row items-baseline justify-evenly">
      <div>Meta tiles: {metaTilesTileIndexes.length}</div>
    </div>
  );
}
