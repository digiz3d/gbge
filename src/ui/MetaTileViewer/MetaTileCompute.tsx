import { useAtomValue, useSetAtom } from "jotai";
import { computeMetaTilesAtom, metaTilesAtom } from "../../state/metatile";

export function MetaTileCompute() {
  const metaTiles = useAtomValue(metaTilesAtom);
  const computeMetaTiles = useSetAtom(computeMetaTilesAtom);

  return (
    <div className="flex flex-row items-baseline justify-evenly">
      <div>Meta tiles: {metaTiles.length}</div>
      <button
        className="cursor-pointer bg-white rounded-2xl px-2 py-1 active:bg-gray-100 mb-2"
        onClick={computeMetaTiles}
      >
        Compute
      </button>
    </div>
  );
}
