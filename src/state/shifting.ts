import type { Tile } from ".";

export function shiftLeft(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = (x + 1) % WIDTH;
      let newY = y;
      let newIndex = newY * HEIGHT + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

export function shiftRight(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = (x - 1 + WIDTH) % WIDTH;
      let newY = y;
      let newIndex = newY * HEIGHT + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

export function shiftUp(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = x;
      let newY = (y - 1 + HEIGHT) % HEIGHT;
      let newIndex = newY * WIDTH + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}

export function shiftDown(tile: Tile) {
  const WIDTH = 8;
  const HEIGHT = 8;
  let result = new Array(tile.length);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let oldIndex = y * WIDTH + x;
      let newX = x;
      let newY = (y + 1) % HEIGHT;
      let newIndex = newY * WIDTH + newX;

      result[newIndex] = tile[oldIndex];
    }
  }

  return result;
}
