export function TileSetViewer() {
  return (
    <div className="grid grid-cols-4 w-fit h-fit">
      {new Array(128).fill(null).map((i) => (
        <div className="h-[64px] w-[64px] border  bg-red-500" key={i} />
      ))}
    </div>
  );
}
