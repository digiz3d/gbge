export function BeltToggleButton({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`bg-gray-300 w-8 h-8 cursor-pointer ${
        enabled ? "border-2 border-white" : ""
      }`}
      onClick={onClick}
    />
  );
}
