export function MapViewer() {
  return (
    <div className="grid grid-cols-32 grid-rows-32 w-fit h-fit">
      {new Array(32 * 32).fill(null).map((_, i) => (
        <div className="h-[16px] w-[16px] bg-orange-500 ring" key={i} />
      ))}
    </div>
  );
}
