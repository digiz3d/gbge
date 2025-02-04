export function TileViewer() {
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-fit h-fit">
      {new Array(8 * 8).fill(null).map((i) => (
        <div className="h-[32px] w-[32px] bg-blue-500 border" key={i} />
      ))}
    </div>
  );
}
