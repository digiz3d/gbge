import { PropsWithChildren } from "react";

export function Belt({ children }: PropsWithChildren) {
  return <div className="flex flex-row gap-[2px]">{children}</div>;
}
