/**
 * pixelSprites.ts
 * Pixel-art sprite definitions for agents and buildings.
 * All sprites are defined as string maps referencing a palette.
 * Rendered to offscreen canvases at creation time, then blitted via PixiJS textures.
 */

// ─── PALETTE ──────────────────────────────────────────────────────────
// Inspired by Endesga 32 + warm cozy palette for a small-town sim feel
export const PALETTE: Record<string, string | null> = {
  '.': null,             // transparent
  'X': '#1a1c2c',       // outline / dark
  'S': '#333c57',       // shadow
  'H': '#5d275d',       // hair dark
  'h': '#8b4049',       // hair mid
  'F': '#c28569',       // skin light
  'f': '#94785c',       // skin shadow
  'E': '#f4f4f4',       // eye white
  'P': '#1a1c2c',       // pupil
  'B': '#29366f',       // body dark (tier 1 navy)
  'b': '#3b5dc9',       // body mid (tier 1 blue)
  'L': '#41a6f6',       // body light / highlight
  'W': '#ef7d57',       // warm accent (belt/detail)
  'R': '#b13e53',       // red accent
  'G': '#38b764',       // green
  'g': '#257179',       // teal
  'Y': '#ffcd75',       // yellow / gold
  'y': '#ffa500',       // orange
  'w': '#f4f4f4',       // white
  'D': '#4a3728',       // brown dark
  'd': '#735039',       // brown mid
  'T': '#4a5568',       // grey body (tier 3-4)
  't': '#718096',       // grey lighter
  'C': '#94b0c2',       // cool grey
  'c': '#566c86',       // cool grey dark
  'K': '#2a4365',       // business blue (tier 2)
  'k': '#2c5282',       // business blue lighter
  'p': '#9f7aea',       // purple
  'n': '#e2e8f0',       // near-white
  'o': '#ed8936',       // orange
  'r': '#e53e3e',       // red
}

// ─── AGENT SPRITES (12×16 pixel art) ─────────────────────────────────

// === TIER 1: Navy suit executive ===
export const AGENT_IDLE_T1 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XBBBBX...',
  '..XBBWBBbX..',
  '..XBBBBBbX..',
  '..XBbBbBbX..',
  '..XBbXXbBX..',
  '...XBX.XBX..',
  '...XBX.XBX..',
  '..XXSX.XSXX.',
  '..XSX...XSX.',
]

export const AGENT_WALK_T1_0 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XBBBBX...',
  '..XBBWBBbX..',
  '..XBBBBBbX..',
  '..XBbBbBbX..',
  '..XBbXXbBX..',
  '..XBX..XBX..',
  '.XSX....XBX.',
  '.XSX...XXSX.',
  '..XX....XSX.',
]

export const AGENT_WALK_T1_1 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XBBBBX...',
  '..XBBWBBbX..',
  '..XBBBBBbX..',
  '..XBbBbBbX..',
  '..XBbXXbBX..',
  '..XBX..XBX..',
  '..XBX..XSX..',
  '.XXSX..XSX..',
  '.XSX...XX...',
]

// === TIER 2: Business blue ===
export const AGENT_IDLE_T2 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XKKKKX...',
  '..XKKWKKkX..',
  '..XKKKKKkX..',
  '..XKkKkKkX..',
  '..XKkXXkKX..',
  '...XKX.XKX..',
  '...XKX.XKX..',
  '..XXSX.XSXX.',
  '..XSX...XSX.',
]

// === TIER 3: Casual grey-blue ===
export const AGENT_IDLE_T3 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XTTTTX...',
  '..XTTWTTtX..',
  '..XTTTTTtX..',
  '..XTtTtTtX..',
  '..XTtXXtTX..',
  '...XTX.XTX..',
  '...XTX.XTX..',
  '..XXSX.XSXX.',
  '..XSX...XSX.',
]

// === TIER 4: Worn grey ===
export const AGENT_IDLE_T4 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XttttX...',
  '..XttWtttX..',
  '..XtttttCX..',
  '..XtCtCtCX..',
  '..XtCXXCtX..',
  '...XtX.XtX..',
  '...XtX.XtX..',
  '..XXSX.XSXX.',
  '..XSX...XSX.',
]

// === SITTING POSE (depression / low agency) ===
export const AGENT_SIT = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '..XTTTTTTX..',
  '..XTTWTTX...',
  '..XTTTTTX...',
  '..XXXXXXXX..',
  '..XSX..XSX..',
  '..XSX..XSX..',
]

// === SLUMP POSE (high stress) ===
export const AGENT_SLUMP = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFFfX..',
  '...XffFfX...',
  '....XXXX....',
  '...XTTX.....',
  '..XTTTX.....',
  '..XTTX......',
  '.XTTX.......',
  '.XTX........',
  '.XSX........',
  '.XSX........',
  'XXXX........',
  '............',
]

// === HUSTLE POSE (energetic hustler) ===
export const AGENT_HUSTLE_0 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFffX..',
  '...XffFfX...',
  '....XXXX....',
  '..XYoYoYoX..',
  '..XoYWYoYX..',
  '..XYoYoYoX..',
  '..XoYoYoYX..',
  '..XoXX.XYX..',
  '..XSX...XSX.',
  '.XSX....XSX.',
  '.XX......XX.',
  '............',
]

export const AGENT_HUSTLE_1 = [
  '....XXXX....',
  '...XhhhhX...',
  '..XhFFFhX...',
  '..XFEPPEfX..',
  '..XfFFFffX..',
  '...XffFfX...',
  '....XXXX....',
  '..XYoYoYoX..',
  '..XoYWYoYX..',
  '..XYoYoYoX..',
  '..XoYoYoYX..',
  '..XYXXoXYX..',
  '.XSX...XSX..',
  '.XSX..XSX...',
  '..XX...XX...',
  '............',
]

// ─── BUILDING SPRITES ─────────────────────────────────────────────────

// Small building front face (16×24 for isometric rendering)
// These are painted onto the wall faces procedurally

// Window patterns (4×3) for building walls
export const WINDOW_LIT = [
  'XXXX',
  'XYYX',
  'XYYX',
]

export const WINDOW_DARK = [
  'XXXX',
  'XSSX',
  'XSSX',
]

export const WINDOW_BOARDED = [
  'DDDD',
  'DdDd',
  'DdDd',
]

// Door (4×6)
export const DOOR_OPEN = [
  '.XX.',
  'XDDX',
  'XD.X',
  'XD.X',
  'XD.X',
  'XXXX',
]

export const DOOR_CLOSED = [
  '.XX.',
  'XddX',
  'XddX',
  'XddX',
  'XdWX',
  'XXXX',
]

// Roof decoration patterns
export const CHIMNEY = [
  'XX',
  'DD',
  'DD',
  'DD',
]

// ─── TREE / DECORATION SPRITES ────────────────────────────────────────

export const TREE_SMALL = [
  '...XX...',
  '..XGGX..',
  '.XGGGGX.',
  '.XGGGGGX',
  '..XGGGX.',
  '..XGGX..',
  '...XX...',
  '...DX...',
  '...DX...',
  '..XDXX..',
]

export const BUSH = [
  '..XXXX..',
  '.XGGGGX.',
  'XGGGGGX.',
  'XGGGGX..',
  '.XXXXX..',
]

export const FLOWER_RED = [
  '.R.',
  'RrR',
  '.R.',
  '.G.',
  'GG.',
]

export const FLOWER_YELLOW = [
  '.Y.',
  'YyY',
  '.Y.',
  '.G.',
  'GG.',
]

export const LAMP_POST = [
  '..YY..',
  '.XYYX.',
  '..XX..',
  '..SS..',
  '..SS..',
  '..SS..',
  '..SS..',
  '.XSSX.',
]

// ─── RENDER UTILITIES ─────────────────────────────────────────────────

/**
 * Render a pixel-art sprite string array to a canvas.
 * Returns an HTMLCanvasElement for use as PixiJS texture source.
 */
export function renderSpriteToCanvas(
  spriteData: string[],
  palette: Record<string, string | null>,
  scale: number = 1,
): HTMLCanvasElement {
  const h = spriteData.length
  const w = spriteData[0].length
  const canvas = document.createElement('canvas')
  canvas.width = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = spriteData[y][x]
      const color = palette[ch]
      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(x * scale, y * scale, scale, scale)
      }
    }
  }
  return canvas
}

/**
 * Get the appropriate idle sprite for a tier.
 */
export function getIdleSpriteForTier(tier: number): string[] {
  switch (tier) {
    case 1: return AGENT_IDLE_T1
    case 2: return AGENT_IDLE_T2
    case 3: return AGENT_IDLE_T3
    case 4: return AGENT_IDLE_T4
    default: return AGENT_IDLE_T3
  }
}

/**
 * Get walk frame sprites for a tier.
 * We recolor the tier 1 walk frames for other tiers.
 */
export function getWalkSpritesForTier(tier: number): string[][] {
  const charMap: Record<number, [string, string]> = {
    1: ['B', 'b'],
    2: ['K', 'k'],
    3: ['T', 't'],
    4: ['t', 'C'],
  }
  const [dc, mc] = charMap[tier] ?? charMap[3]
  return [
    AGENT_WALK_T1_0.map(r => r.replace(/B/g, dc).replace(/b/g, mc)),
    AGENT_WALK_T1_1.map(r => r.replace(/B/g, dc).replace(/b/g, mc)),
  ]
}

/**
 * Get sit sprite for a tier (recolor T/t body chars to tier colors).
 */
export function getSitSpriteForTier(tier: number): string[] {
  const charMap: Record<number, [string, string]> = {
    1: ['B', 'b'],
    2: ['K', 'k'],
    3: ['T', 't'],
    4: ['t', 'C'],
  }
  const [dc, mc] = charMap[tier] ?? charMap[3]
  return AGENT_SIT.map(r => r.replace(/T/g, dc).replace(/t/g, mc))
}

/**
 * Get slump sprite for a tier.
 */
export function getSlumpSpriteForTier(tier: number): string[] {
  const charMap: Record<number, [string, string]> = {
    1: ['B', 'b'],
    2: ['K', 'k'],
    3: ['T', 't'],
    4: ['t', 'C'],
  }
  const [dc, mc] = charMap[tier] ?? charMap[3]
  return AGENT_SLUMP.map(r => r.replace(/T/g, dc).replace(/t/g, mc))
}

/**
 * Get hustle frames.
 */
export function getHustleSprites(): string[][] {
  return [AGENT_HUSTLE_0, AGENT_HUSTLE_1]
}
