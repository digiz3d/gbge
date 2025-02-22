import React from "react";
import { createPortal } from "react-dom";

export function Modal({
  children,
  onClick,
}: React.JSX.IntrinsicElements["div"]) {
  const modal = (
    <div
      onClick={onClick}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center"
    >
      {children}
    </div>
  );

  return createPortal(modal, document.body);
}
