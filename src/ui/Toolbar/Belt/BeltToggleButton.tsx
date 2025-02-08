export function BeltToggleButton({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`bg-gray-300 border-2 border-black w-[32px] h-[32px] cursor-pointer ${
        enabled ? "border-2 border-white" : ""
      }`}
      onClick={onClick}
    />
  );
}
