import { atom } from "jotai";

export function atomWithToggle(initialValue: boolean) {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    if (typeof nextValue === "object") {
      // allows using as static reference in JSX event handlers
      // so we just ignore react events instances
      nextValue = undefined;
    }
    const update = nextValue ?? !get(anAtom);
    set(anAtom, update);
  });

  return anAtom;
}

export function makeFilledArray<T>(length: number, value: T | (() => T)): T[] {
  return Array(length)
    .fill(null)
    .map(() => (typeof value === "function" ? (value as () => T)() : value));
}
