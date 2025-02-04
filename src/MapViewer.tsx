export function MapViewer() {
  return (
    <div className="grid grid-cols-32 grid-rows-32 w-fit h-fit">
      {new Array(32 * 32).fill(null).map((i) => (
        <div className="h-[16px] w-[16px] bg-blue-500 border" key={i} />
      ))}
    </div>
  );
}
