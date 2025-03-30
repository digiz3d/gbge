import { writeTextFile } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import { atom } from "jotai";
import {
  computeMetaTilesAtom,
  MetaTile,
  metaTilesAtom,
} from "../state/metatile";
import { MapEntity, mapsAtom } from "../state/map";
import { tileSetsAtom } from "../state/tileset";
import { selectedTileSetTabIndexAtom } from "../state/ui";
import { Tile } from "../state/tiles";

const filtersC = [{ name: "C file", extensions: ["c"] }];
const filtersH = [{ name: "H file", extensions: ["h"] }];

export const exportToCAtom = atom(null, async (get, set) => {
  const currentTileSetIndex = get(selectedTileSetTabIndexAtom);
  const tileSets = get(tileSetsAtom);
  const tileSet = tileSets[currentTileSetIndex];

  const savePath = await save({ filters: filtersC, defaultPath: "ts.c" });
  if (!savePath) return;
  await writeTextFile(savePath, tileSourceFile(tileSet.name, tileSet.tiles));

  const savePathHeader = await save({ filters: filtersH, defaultPath: "ts.h" });
  if (!savePathHeader) return;
  await writeTextFile(
    savePathHeader,
    tileHeaderFile(tileSet.name, tileSet.tiles.length)
  );

  const maps = get(mapsAtom);
  set(computeMetaTilesAtom);
  const metaTiles = get(metaTilesAtom);

  const savePathMap = await save({ filters: filtersC, defaultPath: "maps.c" });
  if (!savePathMap) return;
  await writeTextFile(savePathMap, mapsSourceFile(metaTiles, maps));

  const savePathMapHeader = await save({
    filters: filtersH,
    defaultPath: "maps.h",
  });
  if (!savePathMapHeader) return;
  await writeTextFile(
    savePathMapHeader,
    mapsHeaderFile(maps, metaTiles.length)
  );
});

function computeMapMetaTiles(map: MapEntity, metaTiles: MetaTile[]) {
  const MAP_WIDTH = map.size.width;
  const tiles = map.tilesIndexes;
  const metaTileIndexes = [];

  for (let i = 0; i < tiles.length; i += 2) {
    const isEndOfRow = i != 0 && i % MAP_WIDTH === 0;
    if (isEndOfRow) {
      i += MAP_WIDTH; // skip the next row
      const isEndOfMap = i >= tiles.length;
      if (isEndOfMap) {
        break;
      }
    }

    const index1 = tiles[i];
    const index2 = tiles[i + 1];
    const index3 = tiles[i + MAP_WIDTH];
    const index4 = tiles[i + 1 + MAP_WIDTH];

    const key = `${index1}-${index2}-${index3}-${index4}`;

    const metaTileIndex = metaTiles.findIndex((metaTile) => {
      const [un, deux, trois, quatre] = metaTile.tileIndexes;
      return `${un}-${deux}-${trois}-${quatre}` === key;
    });

    if (metaTileIndex === -1) {
      throw new Error(`Meta tile not found: ${key}`);
    }

    metaTileIndexes.push(metaTileIndex);
  }
  return metaTileIndexes;
}

function mapsHeaderFile(maps: MapEntity[], metaTilesLength: number) {
  return `/*
  Generated by GBGE
*/

#ifndef _generated_maps_h_INCLUDE
#define _generated_maps_h_INCLUDE

extern const unsigned char metaTiles[];
#define metaTilesLen ${metaTilesLength}

${maps.map((map) => `extern const unsigned char map${map.id}[];`).join("\n")}

#endif
`;
}

function mapsSourceFile(metaTiles: MetaTile[], maps: MapEntity[]) {
  return `/*
  Generated by GBGE
*/

const unsigned char metaTiles[] =
{
  ${metaTiles
    .map((metaTile) => {
      const t = metaTile.tileIndexes;
      return `${[t[0], t[2], t[1], t[3]]
        .map((x) => `0x${x.toString(16).padStart(2, "0")}`)
        .join(",")}`;
    })
    .join(",\n  ")}
};

${maps
  .map(
    (map) => `const unsigned char map${map.id}[] =
{
  ${computeMapMetaTiles(map, metaTiles).reduce((acc, x, i) => {
    const hex = `0x${x.toString(16).padStart(2, "0")}`;
    if (i > 0 && i % (map.size.width / 2) === 0) {
      return acc + ",\n  " + hex;
    }
    return acc + (i === 0 ? hex : "," + hex);
  }, "")}
};

`
  )
  .join("\n")}
`;
}

function tileHeaderFile(name: string, tileCount: number) {
  return `/*
  Generated by GBGE
*/

#ifndef __${name}_h_INCLUDE
#define __${name}_h_INCLUDE

extern const unsigned char ${name}_ts[];
#define ${name}Len ${tileCount}

#endif
`;
}

function tileSourceFile(name: string, tiles: Tile[]) {
  return `/*
  Generated by GBGE
*/

const unsigned char ${name}[] =
{
${encodeTiles(tiles)}
};
`;
}

function encodeTiles(tiles: Tile[]): string {
  const lines: string[] = [];

  for (const tile of tiles) {
    const tileBytes: string[] = [];

    for (let row = 0; row < 8; row++) {
      let lowByte = 0;
      let highByte = 0;

      for (let col = 0; col < 8; col++) {
        const pixel = tile[row * 8 + col];
        const lowBit = pixel & 0b1;
        const highBit = (pixel & 0b10) >> 1;

        // Set bits in appropriate position (leftmost pixel is highest bit)
        lowByte |= lowBit << (7 - col);
        highByte |= highBit << (7 - col);
      }

      tileBytes.push(
        `0x${lowByte.toString(16).padStart(2, "0")}, 0x${highByte
          .toString(16)
          .padStart(2, "0")}`
      );
    }

    // Join 4 rows per line
    const line1 = tileBytes.slice(0, 4).join(", ");
    const line2 = tileBytes.slice(4, 8).join(", ");
    lines.push(`  ${line1},\n  ${line2},`);
  }

  return lines.join("\n");
}
