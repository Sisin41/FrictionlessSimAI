/**
 * iso.ts
 * Isometric projection math for Millfield.
 *
 * Grid coordinate system:
 *   (col, row) → screen (x, y)
 *   x = (col - row) * TILE_W / 2  + origin.x
 *   y = (col + row) * TILE_H / 2  + origin.y
 *
 * All measurements in pixels. Origin is top-center of the map.
 */

export const TILE_W   = 64    // width of one tile face (pixels)
export const TILE_H   = 32    // height of one tile face (isometric, half-width)
export const GRID_COLS = 26
export const GRID_ROWS = 20

/** World origin in screen coords (top-center of isometric diamond). */
export const ORIGIN_X = GRID_COLS * TILE_W / 2   // 832
export const ORIGIN_Y = 80

/**
 * Convert isometric grid (col, row) to screen (x, y).
 * Returns the CENTER-TOP of the tile face.
 */
export function isoToScreen(col: number, row: number): { x: number; y: number } {
  return {
    x: ORIGIN_X + (col - row) * (TILE_W / 2),
    y: ORIGIN_Y + (col + row) * (TILE_H / 2),
  }
}

/**
 * Convert screen (x, y) back to isometric grid (col, row).
 * Used for picking (click → tile).
 */
export function screenToIso(sx: number, sy: number): { col: number; row: number } {
  const dx = (sx - ORIGIN_X) / (TILE_W / 2)
  const dy = (sy - ORIGIN_Y) / (TILE_H / 2)
  return {
    col: Math.round((dx + dy) / 2),
    row: Math.round((dy - dx) / 2),
  }
}

/**
 * Tile "depth" for z-ordering — tiles further from origin are drawn first.
 */
export function tileDepth(col: number, row: number): number {
  return col + row
}

/**
 * Linear interpolation between two tile positions.
 * Used for smooth agent movement between ticks.
 */
export function lerpTile(
  from: [number, number],
  to:   [number, number],
  t:    number
): { x: number; y: number } {
  const a = isoToScreen(from[0], from[1])
  const b = isoToScreen(to[0],   to[1])
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }
}

/**
 * Size constants for building sprites based on "size" field.
 */
export const BUILDING_SPRITE_SIZE = {
  small:  { w: TILE_W * 0.5,  h: TILE_H * 2   },
  medium: { w: TILE_W * 0.7,  h: TILE_H * 2.5 },
  large:  { w: TILE_W * 1,    h: TILE_H * 3   },
}

/** Agent sprite size. */
export const AGENT_W = 20
export const AGENT_H = 28
