# Changelog

## [0.7.0](https://github.com/digiz3d/gbge/compare/v0.6.1...v0.7.0) (2025-02-23)


### Features

* ability to pin metatiles ([#23](https://github.com/digiz3d/gbge/issues/23)) ([dd0b8a1](https://github.com/digiz3d/gbge/commit/dd0b8a1e16e38d664911a0dfcdedd26ccc80d4f7))
* highlight maps that contain the hovered metatile ([#18](https://github.com/digiz3d/gbge/issues/18)) ([700abd1](https://github.com/digiz3d/gbge/commit/700abd19de6be891470afbffbd8d1d48a10327dc))
* picking metatiles or tiles work on map editor ([#21](https://github.com/digiz3d/gbge/issues/21)) ([8c56ca2](https://github.com/digiz3d/gbge/commit/8c56ca2b16c137d70f693eabea13563f4a7c430f))


### Bug Fixes

* correctly load metatiles without a loaded tileset ([#22](https://github.com/digiz3d/gbge/issues/22)) ([c67058a](https://github.com/digiz3d/gbge/commit/c67058a3488ab7542f182bf732dcdf976ab24d86))

## [0.6.1](https://github.com/digiz3d/gbge/compare/v0.6.0...v0.6.1) (2025-02-22)


### Bug Fixes

* replace worldmap with canvas based solution ([#16](https://github.com/digiz3d/gbge/issues/16)) ([79a67f4](https://github.com/digiz3d/gbge/commit/79a67f414cf4fe497062de45769512f3183948c4))

## [0.6.0](https://github.com/digiz3d/gbge/compare/v0.5.1...v0.6.0) (2025-02-20)


### Features

* move maps around, zoom on worldmap ([#14](https://github.com/digiz3d/gbge/issues/14)) ([d833eea](https://github.com/digiz3d/gbge/commit/d833eea19c6ae4687ad9af013cc6bd619b6db211))

## [0.5.1](https://github.com/digiz3d/gbge/compare/v0.5.0...v0.5.1) (2025-02-19)


### Bug Fixes

* properly build ([c906311](https://github.com/digiz3d/gbge/commit/c90631193a49dccbe8d70f88d12efe686e1f59ef))

## [0.5.0](https://github.com/digiz3d/gbge/compare/v0.4.0...v0.5.0) (2025-02-19)


### Features

* export to C files ([#12](https://github.com/digiz3d/gbge/issues/12)) ([33b69bd](https://github.com/digiz3d/gbge/commit/33b69bd838983d0e69041c15e8bd3865359d7681))
* load and save ([#8](https://github.com/digiz3d/gbge/issues/8)) ([e691d3a](https://github.com/digiz3d/gbge/commit/e691d3a764869a135aa9f01a38198170de472dba))
* some QoL shortcuts ([#11](https://github.com/digiz3d/gbge/issues/11)) ([9b6f132](https://github.com/digiz3d/gbge/commit/9b6f132349cbe4bffa1266dcdadc932240e96185))
* worldmap view ([#10](https://github.com/digiz3d/gbge/issues/10)) ([7084f78](https://github.com/digiz3d/gbge/commit/7084f78568720023ac54825ad830310ec4cef5cc))

## [0.4.0](https://github.com/digiz3d/gbge/compare/v0.3.1...v0.4.0) (2025-02-15)


### Features

* copy/paste tiles ([3c06615](https://github.com/digiz3d/gbge/commit/3c06615201054d6248eeb874841dc23a4c4a618a))
* handle multiple maps in state ([a71046d](https://github.com/digiz3d/gbge/commit/a71046db39026794e5a8195fdb066ad5c6c9463d))


### Bug Fixes

* grid is properly displayed on larger maps ([2be2185](https://github.com/digiz3d/gbge/commit/2be21852f83e65b9acb85a20babacb43de2cfbbb))
* highlight overlay focus current map ([5eec71f](https://github.com/digiz3d/gbge/commit/5eec71ff5a76d6b7bd1c2f9227949e632e768eab))

## [0.3.1](https://github.com/digiz3d/gbge/compare/v0.3.0...v0.3.1) (2025-02-09)


### Bug Fixes

* use map size for metatile overlay and tile edition ([283c7de](https://github.com/digiz3d/gbge/commit/283c7de1f20a4ad2d0a5adee0718dd290181bad5))

## [0.3.0](https://github.com/digiz3d/gbge/compare/v0.2.0...v0.3.0) (2025-02-09)


### Features

* new app icon ([d5a7f67](https://github.com/digiz3d/gbge/commit/d5a7f67ff76014d37cf57ddfd23a3b041ed4e612))


### Bug Fixes

* **CI:** build univeral apple dmg ([cf30699](https://github.com/digiz3d/gbge/commit/cf30699c322e89f1f3c26cb9543ef6a2c981f947))

## 0.2.0 (2025-02-09)


### Features

* allow coloring pixel by pixel, tile by tile ([e02dfcf](https://github.com/digiz3d/gbge/commit/e02dfcfd3055c9222731b19667f16752076178c7))
* allow map editing ([2fd6191](https://github.com/digiz3d/gbge/commit/2fd6191dbb2ac5da24bb8ffab5357f851f6451ae))
* always compute meta tiles, rework design ([95b7857](https://github.com/digiz3d/gbge/commit/95b7857666b1ab24ed6b975a7eb6d8734e7e2272))
* change current color with keyboard ([f780fee](https://github.com/digiz3d/gbge/commit/f780fee736734a2a48ba2856fc95e2e85ab14c6a))
* compute meta tiles ([048ac6b](https://github.com/digiz3d/gbge/commit/048ac6bf74cee9e58b50b73fe29fa9fe294c5725))
* draw tile canvas ([03e4fa9](https://github.com/digiz3d/gbge/commit/03e4fa939f28dee065bc0caea2ff6d6c2151e705))
* draw with mouse and fix react errors ([8b9d0e6](https://github.com/digiz3d/gbge/commit/8b9d0e67ff71e2fabf821dfc846bd36779f61740))
* highlight hover cell ([554324d](https://github.com/digiz3d/gbge/commit/554324deb34dae2035a7ff785922e53d088f087f))
* highlight meta tiles ([94c65eb](https://github.com/digiz3d/gbge/commit/94c65eb10008e051d64b82ccaa6d061924b06f6a))
* initial commit ([534605f](https://github.com/digiz3d/gbge/commit/534605f3bf1aaa7672513289768b26afcc267079))
* map overlay and grid ([b080214](https://github.com/digiz3d/gbge/commit/b080214af8ed7d6bdd3f7833b81edbad216bb8b5))
* paint map with meta tiles ([e65353c](https://github.com/digiz3d/gbge/commit/e65353cb20792e9055b8b7c40175871546079ccb))
* resize the map ([f6d3f65](https://github.com/digiz3d/gbge/commit/f6d3f6533907fd55c516738214a0a7cd23fda164))
* rotate tile clockwise ([9bf0141](https://github.com/digiz3d/gbge/commit/9bf0141d9f60cc9439e6753a0623749141a686f1))
* shift current tile in all directions ([a3eab02](https://github.com/digiz3d/gbge/commit/a3eab020a8cf679237ce69d9c31dd1a760ebb3f5))
* use simpler tools, switch to Tauri ([e793cf1](https://github.com/digiz3d/gbge/commit/e793cf1a10d1ee3de512005a54d4c9c38d92a16d))


### Bug Fixes

* prevent some rerenders and simplify state ([34d8e50](https://github.com/digiz3d/gbge/commit/34d8e50308bc966376a94ce4bb8ebf8535167927))
* properly compute grid borders based on lines width ([bb5d87f](https://github.com/digiz3d/gbge/commit/bb5d87fe83595180bd2e8c33b96d4f2e3ae811a2))


### Performance Improvements

* generate pictures instead of drawing on a big canvas ([4f1516b](https://github.com/digiz3d/gbge/commit/4f1516b9d2565df97ff7ff0986b7e904ce6b7931))
* use 1 canvas rather than 65535 divs ([d94355d](https://github.com/digiz3d/gbge/commit/d94355d62d84c2a4b47633ffae1f21cc89779aef))


### Miscellaneous Chores

* release 0.2.0 ([a6e7675](https://github.com/digiz3d/gbge/commit/a6e76755f0cba608296a81774c4baf0b32fa8386))
