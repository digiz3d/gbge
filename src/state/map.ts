export function resizeColumns(
  arr: number[],
  currentColumns: number,
  wantedColumns: number
): number[] {
  if (currentColumns === wantedColumns) return arr;

  const rows = arr.length / currentColumns;
  const result: number[] = [];

  for (let row = 0; row < rows; row++) {
    const start = row * currentColumns;
    const rowElements = arr.slice(start, start + currentColumns);

    if (wantedColumns > currentColumns) {
      result.push(
        ...rowElements,
        ...new Array(wantedColumns - currentColumns).fill(0)
      );
    } else {
      result.push(...rowElements.slice(0, wantedColumns));
    }
  }

  return result;
}

export function resizeRows(
  arr: number[],
  currentColumns: number,
  wantedRows: number
): number[] {
  const currentRows = arr.length / currentColumns;

  if (wantedRows === currentRows) return arr;

  if (wantedRows > currentRows) {
    const additionalElements = (wantedRows - currentRows) * currentColumns;
    return [...arr, ...new Array(additionalElements).fill(0)];
  } else {
    return arr.slice(0, wantedRows * currentColumns);
  }
}
