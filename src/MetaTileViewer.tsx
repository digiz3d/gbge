export function MetaTileViewer() {
  return (
    <div className="grid grid-cols-2 grid-rows-16 w-fit h-fit">
      {new Array(32).fill(null).map((i) => (
        <div className="h-[128px] w-[128px] bg-green-500 border" key={i} />
      ))}
    </div>
  );
}
