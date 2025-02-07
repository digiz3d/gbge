import { useSetAtom } from "jotai";
import { computeMetaTilesAtom } from "../../state";

export function MetaTileCompute() {
  const computeMetaTiles = useSetAtom(computeMetaTilesAtom);
  

  return (
    <div>
      <button
        className="cursor-pointer bg-white rounded-2xl px-2 py-1 active:bg-gray-100 mb-2"
        onClick={computeMetaTiles}
      >
        Compute
      </button>
    </div>
  );
}
