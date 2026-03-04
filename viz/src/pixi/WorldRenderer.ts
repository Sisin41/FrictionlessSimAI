/**
 * WorldRenderer.ts
 * Core PixiJS isometric renderer for Millfield — Phase 2 + Pixel Art upgrade.
 * Adds: movement interpolation, animation states, building transitions,
 * robotaxi sprites, scenario event animations, phenomena visuals.
 * Now with pixel-art sprites, environment decoration, and particle effects.
 */

import { Application, Container, Graphics, Text, Sprite, Texture } from 'pixi.js'
import { isoToScreen, lerpTile, tileDepth, TILE_W, TILE_H, GRID_COLS, GRID_ROWS, BUILDING_SPRITE_SIZE } from './iso'
import { getBuildingVisual, applyBuildingOverrides, type BuildingVisual } from './buildingSprite'
import { getAnimationState, getAgentLocation, TIER_TINT, GRIEF_TINT, getRunwayRingColor, type AnimationState } from './agentSprite'
import type { Agent, Building, BuildingTickState, SocialEdge, Transaction, LayerId } from '../store/simStore'
import { locationToTile } from './worldData'
import { BuildingTransitionManager, lerpColor } from './BuildingTransitionManager'
import { LayerRenderer } from './LayerRenderer'
import {
  PALETTE,
  getIdleSpriteForTier, getWalkSpritesForTier, getHustleSprites,
  getSitSpriteForTier, getSlumpSpriteForTier,
  TREE_SMALL, BUSH, FLOWER_RED, FLOWER_YELLOW, LAMP_POST,
  renderSpriteToCanvas,
} from './pixelSprites'

// ─── Zone definitions ────────────────────────────────────────────────
const ZONES = [
  { id: 'auto_row',       cols: [6, 17],  rows: [0, 4],  color: 0x2a4a7f },
  { id: 'services_row',   cols: [2, 17],  rows: [5, 9],  color: 0x1a5c3a },
  { id: 'civic_district', cols: [0, 5],   rows: [0, 9],  color: 0x5a3a7f },
  { id: 'education',      cols: [18, 25], rows: [0, 4],  color: 0x7f5a1a },
  { id: 'park',           cols: [18, 25], rows: [5, 9],  color: 0x2a5a2a },
  { id: 'residential_t1', cols: [0, 5],   rows: [10, 13], color: 0x2a4a7f },
  { id: 'residential_t2', cols: [6, 11],  rows: [10, 13], color: 0x2a6a6a },
  { id: 'residential_t4', cols: [0, 25],  rows: [14, 19], color: 0x4a4a4a },
]

// ─── Robotaxi road path ──────────────────────────────────────────────
const ROBOTAXI_ROAD: Array<[number, number]> = [
  [11,2],[12,3],[13,4],[14,5],[15,6],[16,7],[17,8],[18,9],[19,10],[20,11],
  [19,12],[18,13],[17,14],[16,15],[15,16],[14,17],[13,18],[12,17],[11,16],
  [10,15],[9,14],[8,13],[7,12],[6,11],[5,10],[4,9],[3,8],[2,7],[1,6],[2,5],
  [3,4],[4,3],[5,2],[6,3],[7,4],[8,5],[9,4],[10,3],[11,2],
]

// Protest crowd tiles near City Hall
const PROTEST_TILES: Array<[number, number]> = [
  [1,5],[2,5],[1,6],[2,6],[0,5],[0,6],[1,4],[2,4],
]

// Depression cluster agents (tick 9)
const DEPRESSION_CLUSTER_AGENTS = ['dealership_gm','loan_officer','driving_instructor','salesperson_jake']

// ─── Types ───────────────────────────────────────────────────────────
interface Renderable {
  depth: number
  container: Container
}

interface RobotaxiState {
  progress: number
  container: Container
}

interface OverlayAnimation {
  type: string
  startTime: number
  duration: number
  container: Container
}

// ─── Sprite Texture Cache ────────────────────────────────────────────
// Pre-render pixel art sprites to textures once, reuse everywhere.
const SPRITE_SCALE = 2 // each pixel = 2 screen pixels
const spriteTextureCache: Map<string, Texture> = new Map()

function getOrCreateTexture(key: string, spriteData: string[]): Texture {
  let tex = spriteTextureCache.get(key)
  if (tex) return tex
  const canvas = renderSpriteToCanvas(spriteData, PALETTE, SPRITE_SCALE)
  tex = Texture.from(canvas)
  spriteTextureCache.set(key, tex)
  return tex
}

// Pre-build decoration textures
function getDecoTexture(key: string, data: string[]): Texture {
  return getOrCreateTexture('deco_' + key, data)
}

// ─── Pixel Particle System ──────────────────────────────────────────
interface PixelParticle {
  x: number; y: number
  vx: number; vy: number
  color: number
  life: number; maxLife: number
  size: number
  gravity: number
}

// Seeded pseudo-random for deterministic decoration placement
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Main Renderer Class ─────────────────────────────────────────────
export class WorldRenderer {
  private app: Application | null = null
  private worldContainer: Container = new Container()
  private layerContainer: Container = new Container()
  private overlayContainer: Container = new Container()
  private layerRenderer = new LayerRenderer()
  private highlightedAgentId: string | null = null
  private btm = new BuildingTransitionManager()
  private prevBuildingVisuals: Map<string, BuildingVisual> = new Map()

  // Animated elements
  private robotaxis: RobotaxiState[] = []
  private robotaxiContainer: Container = new Container()
  private hustleContainers: Map<string, { container: Container; baseY: number }> = new Map()
  private decliningGraphics: Array<{ g: Graphics; baseAlpha: number }> = []
  private overlayAnimations: OverlayAnimation[] = []
  private newsTickerText: Text | null = null
  private newsTickerBg: Graphics | null = null
  private protestContainer: Container | null = null
  private depthRingContainers: Map<string, Container> = new Map()
  private forLeaseAnimations: Map<string, { text: Text; targetY: number; startY: number; startTime: number }> = new Map()
  private informalMarketStalls: Container | null = null
  private lastAgents: Record<string, Agent> | null = null

  // Pixel particle system
  private particles: PixelParticle[] = []
  private particleGraphics: Graphics = new Graphics()
  private decorationContainer: Container = new Container()
  private decorationsPlaced = false
  private tileGridCached = false
  private tileGridContainer: Container = new Container()
  private ambientTimer = 0
  // Active chimney screen positions (updated each render)
  private activeChimneyPositions: Array<{ x: number; y: number }> = []

  // Follow Agent mode
  private followedAgentId: string | null = null

  // Track tick for transition detection
  private lastRenderedTick = -1
  private currentRobotaxiCount = 0
  // Walk animation frame counter
  private walkFrame = 0
  private walkTimer = 0

  // Agent screen positions (updated every render)
  private agentScreenPositions: Map<string, { x: number; y: number }> = new Map()

  // Callbacks
  onAgentClick: ((id: string) => void) | null = null
  onBuildingClick: ((id: string) => void) | null = null
  onAgentHover: ((id: string | null) => void) | null = null

  /** Get screen position for an agent (for React overlay positioning). */
  getAgentScreenPos(agentId: string): { x: number; y: number } | null {
    return this.agentScreenPositions.get(agentId) ?? null
  }

  /** Get the underlying canvas element for screenshot capture. */
  getCanvas(): HTMLCanvasElement | null {
    return this.app?.canvas ?? null
  }

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application()
    await this.app.init({
      width: container.clientWidth || 1200,
      height: container.clientHeight || 700,
      background: 0x1a202c,
      antialias: true,
      resizeTo: container,
      preference: 'webgl',
    })
    container.appendChild(this.app.canvas)
    this.app.stage.addChild(this.worldContainer)
    // Decoration layer sits above tiles but below buildings
    this.app.stage.addChild(this.decorationContainer)
    this.app.stage.addChild(this.layerContainer)
    this.layerContainer.addChild(this.layerRenderer.getContainer())
    this.app.stage.addChild(this.robotaxiContainer)
    // Particles sit above everything except overlays
    this.app.stage.addChild(this.particleGraphics)
    this.app.stage.addChild(this.overlayContainer)

    // Ticker for continuous animations
    this.app.ticker.add(() => {
      const dt = this.app!.ticker.deltaMS / 1000
      this.tickAnimations(dt)
      this.updateParticles(dt)
    })
  }

  /** Phase 2+4: smooth render with interpolation and info layers. */
  renderSmooth(
    tick: number,
    interpolation: number,
    agents: Record<string, Agent>,
    buildingStates: Record<string, BuildingTickState> | undefined,
    buildingStatesNext: Record<string, BuildingTickState> | undefined,
    buildings: Building[],
    robotaxiRate: number,
    activeLayers?: Set<LayerId>,
    socialEdges?: SocialEdge[] | null,
    transactions?: Transaction[] | null,
    txByTick?: Record<string, string[]> | null,
  ): void {
    if (!this.app) return

    this.lastAgents = agents
    this.worldContainer.removeChildren()
    this.hustleContainers.clear()
    this.decliningGraphics = []
    // Note: forLeaseAnimations is NOT cleared here — it persists across frames
    // so the slide-in animation can complete. Stale entries are harmless
    // because they just hold a startTime for completed animations.
    this.activeChimneyPositions = []

    // Build building tile map
    const buildingTiles: Record<string, [number, number]> = {}
    for (const b of buildings) buildingTiles[b.id] = b.tile

    // Detect tick change — fire building transitions
    if (tick !== this.lastRenderedTick) {
      this.onTickChange(tick, buildings, buildingStates)
      this.lastRenderedTick = tick
    }

    // Update building transitions
    const transitionOverrides = this.btm.update(1 / 60)

    // Collect renderables
    const renderables: Renderable[] = []

    // 1. Tile grid
    this.renderTileGrid(renderables)

    // 2. Buildings
    this.renderBuildings(renderables, buildings, buildingStates, transitionOverrides, tick)

    // 3. Agents with interpolation
    this.renderAgentsSmooth(renderables, agents, buildingTiles, tick, interpolation)

    // Sort and add to stage
    renderables.sort((a, b) => a.depth - b.depth)
    for (const r of renderables) this.worldContainer.addChild(r.container)

    // 4. Information layers (Phase 4)
    if (activeLayers && activeLayers.size > 0) {
      this.layerRenderer.render(
        activeLayers,
        tick,
        agents,
        buildings,
        buildingStates,
        socialEdges ?? null,
        transactions ?? null,
        txByTick ?? null,
        this.agentScreenPositions,
      )
    } else {
      this.layerRenderer.clear()
    }

    // Follow Agent: pan camera to center followed agent
    if (this.followedAgentId && this.app) {
      const pos = this.agentScreenPositions.get(this.followedAgentId)
      if (pos) {
        const cx = this.app.screen.width / 2
        const cy = this.app.screen.height / 2
        const targetX = cx - pos.x
        const targetY = cy - pos.y
        // Smooth lerp toward target
        this.worldContainer.x += (targetX - this.worldContainer.x) * 0.15
        this.worldContainer.y += (targetY - this.worldContainer.y) * 0.15
        this.robotaxiContainer.x = this.worldContainer.x
        this.robotaxiContainer.y = this.worldContainer.y
        this.layerContainer.x = this.worldContainer.x
        this.layerContainer.y = this.worldContainer.y
        this.decorationContainer.x = this.worldContainer.x
        this.decorationContainer.y = this.worldContainer.y
      }
    } else {
      // Reset camera position when not following
      this.worldContainer.x += (0 - this.worldContainer.x) * 0.15
      this.worldContainer.y += (0 - this.worldContainer.y) * 0.15
      this.robotaxiContainer.x = this.worldContainer.x
      this.robotaxiContainer.y = this.worldContainer.y
      this.layerContainer.x = this.worldContainer.x
      this.layerContainer.y = this.worldContainer.y
      this.decorationContainer.x = this.worldContainer.x
      this.decorationContainer.y = this.worldContainer.y
    }

    // Update robotaxis
    this.updateRobotaxis(tick, robotaxiRate)
  }

  /** Phase 1 fallback: static render without interpolation. */
  render(
    tick: number,
    agents: Record<string, Agent>,
    buildingStates: Record<string, BuildingTickState> | undefined,
    buildings: Building[],
  ): void {
    this.renderSmooth(tick, 0, agents, buildingStates, undefined, buildings, 0)
  }

  highlightAgent(id: string | null): void {
    this.highlightedAgentId = id
  }

  setFollowAgent(id: string | null): void {
    this.followedAgentId = id
  }

  /** Called by WorldCanvas when tick advances during playback. */
  onTickAdvance(fromTick: number, toTick: number): void {
    // Scenario event animations
    if (fromTick < 1 && toTick >= 1) this.fireRoboRideAnnounce()
    if (fromTick < 5 && toTick >= 5) this.fireMassLayoff()
    if (fromTick < 7 && toTick >= 7) this.fireInformalMarket()
    if (fromTick < 8 && toTick >= 8) this.fireProtestWave()
    if (fromTick < 9 && toTick >= 9) this.fireDepressionCluster()
    if (fromTick < 14 && toTick >= 14) this.fireRunwayCrisis()

    // Seed info flow particles for new tick
    if (this.lastAgents) {
      this.layerRenderer.seedInfoFlowParticles(toTick, this.lastAgents, this.agentScreenPositions)
    }
  }

  destroy(): void {
    if (this.app) {
      try {
        this.app.destroy(true, { children: true })
      } catch {
        // PixiJS 8 ResizePlugin may throw if destroy() is called
        // before init() completes (React StrictMode double-mount)
        try { this.app.canvas?.remove() } catch { /* noop */ }
      }
      this.app = null
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // TILE GRID
  // ═══════════════════════════════════════════════════════════════════

  private getZoneColor(col: number, row: number): number {
    for (let i = ZONES.length - 1; i >= 0; i--) {
      const z = ZONES[i]
      if (col >= z.cols[0] && col <= z.cols[1] && row >= z.rows[0] && row <= z.rows[1]) {
        return this.blendColor(z.color, 0x1a202c, 0.15)
      }
    }
    return 0x1a202c
  }

  private blendColor(c1: number, c2: number, t: number): number {
    const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff
    const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff
    const r = Math.round(r1 * t + r2 * (1 - t))
    const g = Math.round(g1 * t + g2 * (1 - t))
    const b = Math.round(b1 * t + b2 * (1 - t))
    return (r << 16) | (g << 8) | b
  }

  private renderTileGrid(renderables: Renderable[]): void {
    // Cache the tile grid — it never changes, so we only build it once
    if (!this.tileGridCached) {
      const g = new Graphics()
      const rng = seededRandom(42)

      for (let col = 0; col < GRID_COLS; col++) {
        for (let row = 0; row < GRID_ROWS; row++) {
          const { x, y } = isoToScreen(col, row)
          const baseColor = this.getZoneColor(col, row)

          // Subtle per-tile brightness variation for texture
          const brightness = 0.92 + rng() * 0.16
          const color = this.blendColor(baseColor, 0x1a202c, 1 - brightness)

          // Main tile fill
          g.poly([x, y, x + TILE_W / 2, y + TILE_H / 2, x, y + TILE_H, x - TILE_W / 2, y + TILE_H / 2])
          g.fill({ color, alpha: 0.65 })

          // Darker inner edge for pixel-art outline effect
          g.poly([x, y, x + TILE_W / 2, y + TILE_H / 2, x, y + TILE_H, x - TILE_W / 2, y + TILE_H / 2])
          g.stroke({ color: 0x1a1c2c, width: 1, alpha: 0.4 })

          // Tiny pixel dots for grass/texture on park/residential zones
          const zone = this.getZoneId(col, row)
          if (zone === 'park' || zone === 'residential_t4') {
            const dotCount = 2 + Math.floor(rng() * 3)
            for (let d = 0; d < dotCount; d++) {
              const dx = (rng() - 0.5) * TILE_W * 0.4
              const dy = (rng() - 0.5) * TILE_H * 0.4
              const dotColor = zone === 'park' ? 0x38b764 : 0x4a5568
              g.circle(x + dx, y + TILE_H / 2 + dy, 1)
              g.fill({ color: dotColor, alpha: 0.4 + rng() * 0.3 })
            }
          }

          // Road markings on auto_row
          if (zone === 'auto_row' && row === 2) {
            g.rect(x - 2, y + TILE_H / 2 - 0.5, 4, 1)
            g.fill({ color: 0xffcd75, alpha: 0.3 })
          }
        }
      }

      this.tileGridContainer.addChild(g)
      this.tileGridCached = true

      // Place decorations once
      if (!this.decorationsPlaced) {
        this.placeDecorations()
        this.decorationsPlaced = true
      }
    }

    renderables.push({ depth: -1, container: this.tileGridContainer })
  }

  private getZoneId(col: number, row: number): string | null {
    for (let i = ZONES.length - 1; i >= 0; i--) {
      const z = ZONES[i]
      if (col >= z.cols[0] && col <= z.cols[1] && row >= z.rows[0] && row <= z.rows[1]) {
        return z.id
      }
    }
    return null
  }

  /** Place pixel-art decorations (trees, bushes, flowers, lamps) on appropriate tiles */
  private placeDecorations(): void {
    this.decorationContainer.removeChildren()
    const rng = seededRandom(1337)

    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        const zone = this.getZoneId(col, row)
        const { x, y } = isoToScreen(col, row)

        // Park zone: trees and flowers
        if (zone === 'park') {
          const r = rng()
          if (r < 0.15) {
            this.addDecoSprite('tree', TREE_SMALL, x - 8, y - 8, 1)
          } else if (r < 0.25) {
            this.addDecoSprite('bush', BUSH, x - 6, y + 4, 1)
          } else if (r < 0.32) {
            this.addDecoSprite('flower_r', FLOWER_RED, x + rng() * 8 - 4, y + rng() * 6, 1)
          } else if (r < 0.38) {
            this.addDecoSprite('flower_y', FLOWER_YELLOW, x + rng() * 8 - 4, y + rng() * 6, 1)
          }
        }

        // Residential: occasional bushes and flowers
        if (zone?.startsWith('residential')) {
          const r = rng()
          if (r < 0.06) {
            this.addDecoSprite('bush', BUSH, x - 6, y + 4, 1)
          } else if (r < 0.10) {
            this.addDecoSprite('flower_r', FLOWER_RED, x + rng() * 8 - 4, y + rng() * 4, 1)
          }
        }

        // Services/auto row: lamp posts at edges
        if ((zone === 'services_row' || zone === 'auto_row') && col % 4 === 0 && row % 3 === 0) {
          if (rng() < 0.3) {
            this.addDecoSprite('lamp', LAMP_POST, x - 5, y - 10, 1)
          }
        }
      }
    }
  }

  private addDecoSprite(key: string, data: string[], x: number, y: number, scale: number): void {
    const tex = getDecoTexture(key, data)
    const sprite = new Sprite(tex)
    sprite.x = Math.round(x)
    sprite.y = Math.round(y)
    sprite.scale.set(scale)
    sprite.alpha = 0.7
    this.decorationContainer.addChild(sprite)
  }

  // ═══════════════════════════════════════════════════════════════════
  // BUILDINGS
  // ═══════════════════════════════════════════════════════════════════

  private onTickChange(
    newTick: number,
    buildings: Building[],
    buildingStates: Record<string, BuildingTickState> | undefined,
  ): void {
    if (!buildingStates) return

    for (const building of buildings) {
      if (building.appears_tick > newTick) continue
      const state = buildingStates[building.id]
      if (!state) continue

      let newVisual = getBuildingVisual(state)
      newVisual = applyBuildingOverrides(building.id, newVisual, state.health)

      const prevVisual = this.prevBuildingVisuals.get(building.id)
      if (prevVisual && prevVisual.tint !== newVisual.tint) {
        // Determine transition duration based on dramatic events
        let duration = 0.6
        if (building.id === 'bank' && newTick >= 5) duration = 1.5
        if (building.id === 'diner' && state.visual_state === 'declining') duration = 1.0
        if (building.id === 'driving_school' && newTick >= 1) duration = 0.8
        if (building.id === 'community_center') duration = 0.6

        this.btm.startTransition(building.id, prevVisual, newVisual, duration)
      }
      this.prevBuildingVisuals.set(building.id, newVisual)
    }
  }

  private renderBuildings(
    renderables: Renderable[],
    buildings: Building[],
    buildingStates: Record<string, BuildingTickState> | undefined,
    transitionOverrides: Map<string, BuildingVisual>,
    tick: number,
  ): void {
    for (const building of buildings) {
      if (building.appears_tick > tick) continue

      const state = buildingStates?.[building.id]
      if (!state) continue
      if (!state.visible) continue

      let visual: BuildingVisual
      if (transitionOverrides.has(building.id)) {
        visual = transitionOverrides.get(building.id)!
      } else {
        visual = getBuildingVisual(state)
        visual = applyBuildingOverrides(building.id, visual, state.health)
      }

      const [col, row] = building.tile
      const { x, y } = isoToScreen(col, row)
      const depth = tileDepth(col, row)

      const sizeSpec = BUILDING_SPRITE_SIZE[building.size]
      const bw = sizeSpec.w
      const bh = sizeSpec.h

      const container = new Container()
      container.eventMode = 'static'
      container.cursor = 'pointer'
      container.on('pointerdown', () => this.onBuildingClick?.(building.id))

      const g = new Graphics()

      const floorHalfW = bw / 2
      const floorHalfH = bw / 4
      const wallH = bh * 0.6

      // ── Shadow on ground ──
      g.poly([
        x + 4, y + TILE_H / 2 + 4,
        x + floorHalfW + 4, y + TILE_H / 2 + floorHalfH + 4,
        x + 4, y + TILE_H / 2 + floorHalfH * 2 + 4,
        x - floorHalfW + 4, y + TILE_H / 2 + floorHalfH + 4,
      ])
      g.fill({ color: 0x0a0a0f, alpha: 0.25 })

      // ── Floor diamond ──
      g.poly([
        x, y + TILE_H / 2,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH,
        x, y + TILE_H / 2 + floorHalfH * 2,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.3), alpha: 0.5 })

      // ── Left wall (shadow side) ──
      const leftWallColor = this.blendColor(visual.tint, 0x000000, 0.55)
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x, y + TILE_H / 2,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: leftWallColor, alpha: visual.saturation * 0.8 + 0.2 })

      // Horizontal mortar lines on left wall (isometric-aligned)
      const mortarAlpha = visual.saturation * 0.15
      const mortarCount = Math.floor(wallH / 8)
      for (let ml = 1; ml < mortarCount; ml++) {
        const t = ml / mortarCount
        // Interpolate along the left wall edges
        const lx0 = x + (0 - x) * (1 - t)  // top edge to center
        const ly0 = (y + TILE_H / 2 - wallH) + wallH * t
        const lx1 = (x - floorHalfW) + ((x - floorHalfW) - (x - floorHalfW)) * (1 - t)
        const ly1 = (y + TILE_H / 2 + floorHalfH - wallH) + wallH * t
        g.moveTo(lx0, ly0).lineTo(x - floorHalfW, ly1)
        g.stroke({ color: 0x1a1c2c, width: 0.5, alpha: mortarAlpha })
      }

      // ── Right wall (lit side) ──
      const rightWallColor = this.blendColor(visual.tint, 0x000000, 0.35)
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x, y + TILE_H / 2,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: rightWallColor, alpha: visual.saturation * 0.8 + 0.2 })

      // ── Windows on right wall ──
      const windowRows = building.size === 'large' ? 2 : building.size === 'medium' ? 2 : 1
      const windowCols = building.size === 'large' ? 3 : 2
      const winW = building.size === 'small' ? 4 : 5
      const winH = building.size === 'small' ? 5 : 6
      const winSpacingX = floorHalfW / (windowCols + 1)
      const winSpacingY = wallH / (windowRows + 1.5)

      for (let wr = 0; wr < windowRows; wr++) {
        for (let wc = 0; wc < windowCols; wc++) {
          const wx = x + winSpacingX * (wc + 0.8)
          const wy = y + TILE_H / 2 - wallH + winSpacingY * (wr + 0.8)
          const isoOffY = (wc + 1) * (floorHalfH / (windowCols + 1))

          if (visual.boardedUp) {
            // Boarded window
            g.rect(wx, wy + isoOffY, winW, winH)
            g.fill({ color: 0x4a3728, alpha: 0.9 })
            // X cross boards
            g.moveTo(wx, wy + isoOffY).lineTo(wx + winW, wy + isoOffY + winH)
            g.stroke({ color: 0x735039, width: 1.5 })
            g.moveTo(wx + winW, wy + isoOffY).lineTo(wx, wy + isoOffY + winH)
            g.stroke({ color: 0x735039, width: 1.5 })
          } else if (visual.lightAlpha > 0) {
            // Lit window with warm glow
            g.rect(wx, wy + isoOffY, winW, winH)
            g.fill({ color: 0xfff3c4, alpha: visual.lightAlpha * 0.6 })
            // Window frame (dark outline)
            g.rect(wx, wy + isoOffY, winW, winH)
            g.stroke({ color: 0x1a1c2c, width: 1 })
            // Cross pane
            g.moveTo(wx + winW / 2, wy + isoOffY).lineTo(wx + winW / 2, wy + isoOffY + winH)
            g.stroke({ color: 0x1a1c2c, width: 0.5 })
            g.moveTo(wx, wy + isoOffY + winH / 2).lineTo(wx + winW, wy + isoOffY + winH / 2)
            g.stroke({ color: 0x1a1c2c, width: 0.5 })
          } else {
            // Dark window
            g.rect(wx, wy + isoOffY, winW, winH)
            g.fill({ color: 0x1a1c2c, alpha: 0.7 })
            g.rect(wx, wy + isoOffY, winW, winH)
            g.stroke({ color: 0x333c57, width: 0.5 })
          }
        }
      }

      // ── Door on right wall ──
      if (building.size !== 'large') {
        const doorW = building.size === 'small' ? 4 : 5
        const doorH = building.size === 'small' ? 7 : 9
        const doorX = x + floorHalfW * 0.5 - doorW / 2
        const doorY = y + TILE_H / 2 - doorH + floorHalfH * 0.5
        if (visual.doorOpen) {
          g.rect(doorX, doorY, doorW, doorH)
          g.fill({ color: 0x1a1c2c, alpha: 0.8 })
          // Door frame
          g.rect(doorX, doorY, doorW, doorH)
          g.stroke({ color: 0x4a3728, width: 1 })
        } else {
          g.rect(doorX, doorY, doorW, doorH)
          g.fill({ color: 0x735039, alpha: 0.8 })
          g.rect(doorX, doorY, doorW, doorH)
          g.stroke({ color: 0x4a3728, width: 1 })
          // Door knob
          g.circle(doorX + doorW - 1.5, doorY + doorH / 2, 0.8)
          g.fill({ color: 0xffcd75 })
        }
      }

      // ── Roof ──
      const roofColor = visual.tint
      const roofDark = this.blendColor(roofColor, 0x000000, 0.25)
      // Main roof diamond
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
        x, y + TILE_H / 2 + floorHalfH * 2 - wallH,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: roofColor, alpha: visual.saturation * 0.7 + 0.25 })
      // Roof edge highlight (top-left)
      g.moveTo(x, y + TILE_H / 2 - wallH)
        .lineTo(x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH)
      g.stroke({ color: 0xf4f4f4, width: 0.8, alpha: 0.3 })
      // Roof edge shadow (bottom-right)
      g.moveTo(x, y + TILE_H / 2 + floorHalfH * 2 - wallH)
        .lineTo(x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH)
      g.stroke({ color: 0x1a1c2c, width: 0.8, alpha: 0.4 })

      // ── Roof peak / gable ──
      if (building.size !== 'small') {
        const peakH = 8
        g.poly([
          x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
          x, y + TILE_H / 2 - wallH - peakH,
          x, y + TILE_H / 2 - wallH,
        ])
        g.fill({ color: roofDark, alpha: 0.5 })
        g.poly([
          x, y + TILE_H / 2 - wallH - peakH,
          x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
          x, y + TILE_H / 2 - wallH,
        ])
        g.fill({ color: roofColor, alpha: 0.5 })
      }

      // ── Chimney for active buildings ──
      if (visual.smokeActive) {
        const cx = x - floorHalfW * 0.3
        const cy = y + TILE_H / 2 - wallH - 6
        g.rect(cx, cy, 4, 8)
        g.fill({ color: 0x4a3728, alpha: 0.9 })
        g.rect(cx, cy, 4, 8)
        g.stroke({ color: 0x1a1c2c, width: 0.5 })
        // Chimney cap
        g.rect(cx - 1, cy - 1, 6, 2)
        g.fill({ color: 0x333c57 })
        // Track for smoke particle spawning
        this.activeChimneyPositions.push({ x: cx + 2, y: cy - 2 })
      }

      // ── 1px dark outline around entire building silhouette ──
      // Left wall outline
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH,
        x, y + TILE_H / 2,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.stroke({ color: 0x1a1c2c, width: 1.5, alpha: 0.7 })

      container.addChild(g)

      // Track declining buildings for flicker effect
      if (state.visual_state === 'declining' || state.visual_state === 'closing') {
        this.decliningGraphics.push({ g, baseAlpha: visual.saturation * 0.8 + 0.2 })
      }

      // ── FOR LEASE sign ──
      if (visual.forLeaseSign) {
        const signG = new Graphics()
        const signW = Math.min(32, floorHalfW * 1.2)
        const signH = 10
        const signX = x - signW / 2
        const signY_target = y + TILE_H / 2 - wallH * 0.35
        // Sign background
        signG.rect(signX, signY_target, signW, signH)
        signG.fill({ color: 0x1a1c2c, alpha: 0.85 })
        signG.rect(signX, signY_target, signW, signH)
        signG.stroke({ color: 0xe53e3e, width: 1 })
        container.addChild(signG)

        const sign = new Text({
          text: 'FOR LEASE',
          style: { fill: 0xe53e3e, fontSize: 6, fontWeight: 'bold', fontFamily: 'monospace' },
        })
        sign.x = signX + 2
        const targetY = signY_target + 2
        if (!this.forLeaseAnimations.has(building.id)) {
          sign.y = targetY - 20
          sign.alpha = 0
          this.forLeaseAnimations.set(building.id, {
            text: sign,
            targetY,
            startY: targetY - 20,
            startTime: Date.now(),
          })
        } else {
          sign.y = targetY
        }
        container.addChild(sign)
      }

      // ── Building label with pixel-art bg ──
      const labelText = building.label.length > 16 ? building.label.slice(0, 14) + '..' : building.label
      const label = new Text({
        text: labelText,
        style: { fill: 0xe2e8f0, fontSize: 7, fontFamily: 'monospace' },
      })
      const labelBg = new Graphics()
      const lbw = label.width + 4
      const lbx = x - lbw / 2
      const lby = y + TILE_H / 2 - wallH - 14
      labelBg.rect(lbx, lby, lbw, 10)
      labelBg.fill({ color: 0x1a1c2c, alpha: 0.7 })
      container.addChild(labelBg)
      label.x = lbx + 2
      label.y = lby + 1
      container.addChild(label)

      // ── Health indicator ──
      const healthColor = state.health >= 70 ? 0x48bb78 : state.health >= 40 ? 0xf97316 : 0xe53e3e
      const healthBarW = 20
      const healthBarX = x - healthBarW / 2
      const healthBarY = lby - 6
      // Bar background
      labelBg.rect(healthBarX, healthBarY, healthBarW, 3)
      labelBg.fill({ color: 0x1a1c2c, alpha: 0.6 })
      // Health fill
      const fillW = healthBarW * (state.health / 100)
      labelBg.rect(healthBarX, healthBarY, fillW, 3)
      labelBg.fill({ color: healthColor, alpha: 0.8 })
      // Bar outline
      labelBg.rect(healthBarX, healthBarY, healthBarW, 3)
      labelBg.stroke({ color: 0x333c57, width: 0.5 })

      renderables.push({ depth, container })
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // AGENTS WITH INTERPOLATION + ANIMATION STATES
  // ═══════════════════════════════════════════════════════════════════

  private renderAgentsSmooth(
    renderables: Renderable[],
    agents: Record<string, Agent>,
    buildingTiles: Record<string, [number, number]>,
    tick: number,
    interpolation: number,
  ): void {
    const tileOccupancy: Map<string, number> = new Map()

    for (const [agentId, agent] of Object.entries(agents)) {
      // Current tick snapshot
      const snap0 = this.getSnapForTick(agent, tick)
      const empStatus0 = snap0.employment_status ?? 'unemployed'

      // Next tick snapshot for interpolation
      const nextTick = Math.min(tick + 1, 14)
      const snap1 = this.getSnapForTick(agent, nextTick)
      const empStatus1 = snap1.employment_status ?? 'unemployed'

      // Locations for current and next tick
      const loc0 = getAgentLocation({
        employment_status: empStatus0,
        grief_stage: agent.grief_stage,
        agency: agent.agency,
        runway_months: agent.runway_months,
        archetype: agent.archetype,
        has_active_tx: false,
        transformations: agent.transformations ?? [],
      })
      const tile0 = locationToTile(loc0, agentId, buildingTiles)

      const loc1 = getAgentLocation({
        employment_status: empStatus1,
        grief_stage: agent.grief_stage,
        agency: agent.agency,
        runway_months: agent.runway_months,
        archetype: agent.archetype,
        has_active_tx: false,
        transformations: agent.transformations ?? [],
      })
      const tile1 = locationToTile(loc1, agentId, buildingTiles)

      // Jitter
      const tileKey = `${tile0[0]},${tile0[1]}`
      const agentIndex = tileOccupancy.get(tileKey) ?? 0
      tileOccupancy.set(tileKey, agentIndex + 1)
      const jitterX = (agentIndex % 5 - 2) * 8
      const jitterY = Math.floor(agentIndex / 5) * 6

      // Smooth interpolation between positions
      let ax: number, ay: number
      const isMoving = tile0[0] !== tile1[0] || tile0[1] !== tile1[1]
      if (isMoving && interpolation > 0) {
        const lerped = lerpTile(tile0, tile1, interpolation)
        ax = lerped.x + jitterX
        ay = lerped.y + TILE_H / 2 + jitterY
      } else {
        const pos = isoToScreen(tile0[0], tile0[1])
        ax = pos.x + jitterX
        ay = pos.y + TILE_H / 2 + jitterY
      }

      const depth = tileDepth(tile0[0], tile0[1]) + 0.5

      // Get animation state
      const animState = getAnimationState({
        employment_status: empStatus0,
        grief_stage: agent.grief_stage,
        agency: agent.agency,
        stress: snap0.stress ?? 0,
        runway_months: agent.runway_months,
        archetype: agent.archetype,
      })

      // Store screen position for React overlays
      this.agentScreenPositions.set(agentId, { x: ax, y: ay - 24 })

      const container = new Container()
      container.eventMode = 'static'
      container.cursor = 'pointer'
      container.on('pointerdown', () => this.onAgentClick?.(agentId))
      container.on('pointerover', () => this.onAgentHover?.(agentId))
      container.on('pointerout', () => this.onAgentHover?.(null))

      this.drawAgentShape(container, ax, ay, agent, animState, agentId, isMoving)

      // Follow Agent mode: enlarge followed, dim others
      if (this.followedAgentId) {
        if (agentId === this.followedAgentId) {
          container.scale.set(1.3)
        } else {
          container.alpha = 0.35
        }
      }

      renderables.push({ depth, container })
    }
  }

  private drawAgentShape(
    container: Container,
    ax: number,
    ay: number,
    agent: Agent,
    animState: AnimationState,
    agentId: string,
    isMoving: boolean,
  ): void {
    const g = new Graphics()
    const tier = agent.tier ?? 3
    const griefColor = GRIEF_TINT[agent.grief_stage]

    // Sprite dimensions (12 chars wide × 16 rows, at SPRITE_SCALE)
    const spriteW = 12 * SPRITE_SCALE
    const spriteH = 16 * SPRITE_SCALE

    // Choose sprite based on animation state
    let spriteKey = ''
    let spriteData: string[] | null = null
    let flipX = false

    switch (animState) {
      case 'sit':
        spriteKey = `sit_t${tier}`
        spriteData = getSitSpriteForTier(tier)
        break
      case 'slump':
        spriteKey = `slump_t${tier}`
        spriteData = getSlumpSpriteForTier(tier)
        break
      case 'hustle': {
        const hframes = getHustleSprites()
        const hf = this.walkFrame % 2
        spriteKey = `hustle_${hf}`
        spriteData = hframes[hf]
        this.hustleContainers.set(agentId, { container, baseY: container.y })
        break
      }
      case 'walk_ne': {
        const walkFrames = getWalkSpritesForTier(tier)
        const wf = this.walkFrame % 2
        spriteKey = `walk_t${tier}_${wf}`
        spriteData = walkFrames[wf]
        break
      }
      case 'walk_sw': {
        const walkFrames = getWalkSpritesForTier(tier)
        const wf = this.walkFrame % 2
        spriteKey = `walk_t${tier}_${wf}`
        spriteData = walkFrames[wf]
        flipX = true
        break
      }
      case 'work': {
        spriteKey = `idle_t${tier}`
        spriteData = getIdleSpriteForTier(tier)
        // Draw desk underneath
        g.rect(ax - 10, ay - 4, 20, 3)
        g.fill({ color: 0x735039, alpha: 0.8 })
        g.rect(ax - 10, ay - 4, 20, 3)
        g.stroke({ color: 0x4a3728, width: 0.5 })
        break
      }
      case 'talk': {
        spriteKey = `idle_t${tier}`
        spriteData = getIdleSpriteForTier(tier)
        // Speech bubble pips (pixel art style)
        g.circle(ax + 10, ay - spriteH + 4, 1.5)
        g.fill({ color: 0xf4f4f4, alpha: 0.8 })
        g.circle(ax + 14, ay - spriteH, 2.5)
        g.fill({ color: 0xf4f4f4, alpha: 0.6 })
        // Larger speech bubble
        g.roundRect(ax + 12, ay - spriteH - 6, 10, 7, 2)
        g.fill({ color: 0xf4f4f4, alpha: 0.5 })
        g.rect(ax + 14, ay - spriteH - 4, 2, 2)
        g.fill({ color: 0x1a1c2c, alpha: 0.6 })
        g.rect(ax + 17, ay - spriteH - 4, 2, 2)
        g.fill({ color: 0x1a1c2c, alpha: 0.6 })
        break
      }
      default: {
        // idle
        spriteKey = `idle_t${tier}`
        spriteData = getIdleSpriteForTier(tier)
        break
      }
    }

    // Render agent shadow on ground
    g.ellipse(ax, ay + 1, 7, 3)
    g.fill({ color: 0x0a0a0f, alpha: 0.3 })

    // Get or create the sprite texture
    if (spriteData) {
      const tex = getOrCreateTexture(spriteKey, spriteData)
      const sprite = new Sprite(tex)
      sprite.anchor.set(0.5, 1)
      sprite.x = Math.round(ax)
      sprite.y = Math.round(ay)
      if (flipX) sprite.scale.x = -1

      // Grief overlay tint
      if (griefColor != null) {
        sprite.tint = griefColor
        sprite.alpha = 0.85
      }

      container.addChild(sprite)
    }

    // Runway danger ring (pixel-art style: square corners)
    const ringColor = getRunwayRingColor(agent.runway_months)
    if (ringColor != null) {
      const ringSize = 13
      g.rect(ax - ringSize, ay - spriteH / 2 - ringSize / 2, ringSize * 2, ringSize * 2)
      g.stroke({ color: ringColor, width: 2, alpha: 0.7 })
      // Corner pixels for pixel-art feel
      const cs = 2
      g.rect(ax - ringSize, ay - spriteH / 2 - ringSize / 2, cs, cs)
      g.fill({ color: ringColor, alpha: 0.9 })
      g.rect(ax + ringSize - cs, ay - spriteH / 2 - ringSize / 2, cs, cs)
      g.fill({ color: ringColor, alpha: 0.9 })
      g.rect(ax - ringSize, ay - spriteH / 2 + ringSize / 2 - cs, cs, cs)
      g.fill({ color: ringColor, alpha: 0.9 })
      g.rect(ax + ringSize - cs, ay - spriteH / 2 + ringSize / 2 - cs, cs, cs)
      g.fill({ color: ringColor, alpha: 0.9 })
    }

    // Update pulse ring position
    const pulseRing = this.depthRingContainers.get(agentId)
    if (pulseRing) {
      pulseRing.x = ax
      pulseRing.y = ay - spriteH / 2
    }

    // Highlight selected agent (pixel-art selection box)
    if (this.highlightedAgentId === agentId) {
      const hSize = 16
      // Dashed selection rectangle
      g.rect(ax - hSize, ay - spriteH - 2, hSize * 2, spriteH + 6)
      g.stroke({ color: 0xffffff, width: 1.5, alpha: 0.9 })
      // Corner brackets for retro selection feel
      const cb = 4
      // Top-left
      g.moveTo(ax - hSize, ay - spriteH - 2 + cb).lineTo(ax - hSize, ay - spriteH - 2).lineTo(ax - hSize + cb, ay - spriteH - 2)
      g.stroke({ color: 0xffcd75, width: 2 })
      // Top-right
      g.moveTo(ax + hSize - cb, ay - spriteH - 2).lineTo(ax + hSize, ay - spriteH - 2).lineTo(ax + hSize, ay - spriteH - 2 + cb)
      g.stroke({ color: 0xffcd75, width: 2 })
      // Bottom-left
      g.moveTo(ax - hSize, ay + 4 - cb).lineTo(ax - hSize, ay + 4).lineTo(ax - hSize + cb, ay + 4)
      g.stroke({ color: 0xffcd75, width: 2 })
      // Bottom-right
      g.moveTo(ax + hSize - cb, ay + 4).lineTo(ax + hSize, ay + 4).lineTo(ax + hSize, ay + 4 - cb)
      g.stroke({ color: 0xffcd75, width: 2 })
    }

    container.addChild(g)

    // Name label with dark background for readability
    const nameLabel = new Text({
      text: agent.name.split(' ')[0],
      style: { fill: 0xc2c3c7, fontSize: 7, fontFamily: 'monospace' },
    })
    const nlBg = new Graphics()
    nlBg.rect(ax - nameLabel.width / 2 - 2, ay + 3, nameLabel.width + 4, 9)
    nlBg.fill({ color: 0x1a1c2c, alpha: 0.6 })
    container.addChild(nlBg)
    nameLabel.x = ax - nameLabel.width / 2
    nameLabel.y = ay + 3
    container.addChild(nameLabel)
  }

  // ═══════════════════════════════════════════════════════════════════
  // ROBOTAXIS
  // ═══════════════════════════════════════════════════════════════════

  private updateRobotaxis(tick: number, robotaxiRate: number): void {
    const targetCount = tick < 3 ? 0 : Math.max(1, Math.ceil(robotaxiRate * 30))

    // Spawn/remove as needed
    while (this.robotaxis.length < targetCount) {
      const c = new Container()
      const offset = this.robotaxis.length * (ROBOTAXI_ROAD.length / Math.max(targetCount, 1))
      this.robotaxis.push({ progress: offset, container: c })
      this.robotaxiContainer.addChild(c)
    }
    while (this.robotaxis.length > targetCount) {
      const rt = this.robotaxis.pop()!
      this.robotaxiContainer.removeChild(rt.container)
    }
    this.currentRobotaxiCount = targetCount
  }

  private drawRoboTaxi(g: Graphics, x: number, y: number): void {
    // Shadow
    g.ellipse(x + 2, y + 3, 10, 4)
    g.fill({ color: 0x0a0a0f, alpha: 0.25 })

    // Chassis: isometric box with pixel-art outline
    g.poly([x, y - 5, x + 12, y, x, y + 5, x - 12, y])
    g.fill({ color: 0x63b3ed })
    g.poly([x, y - 5, x + 12, y, x, y + 5, x - 12, y])
    g.stroke({ color: 0x1a1c2c, width: 1.5 })

    // Windshield (darker strip)
    g.poly([x - 3, y - 2, x + 5, y - 1, x + 3, y + 1, x - 5, y])
    g.fill({ color: 0x29366f, alpha: 0.7 })

    // Roof bubble with sensor
    g.ellipse(x, y - 7, 5, 3)
    g.fill({ color: 0x90cdf4, alpha: 0.85 })
    g.ellipse(x, y - 7, 5, 3)
    g.stroke({ color: 0x1a1c2c, width: 0.8 })

    // Sensor dot (blinking)
    const blink = Math.sin(Date.now() * 0.008) > 0
    g.circle(x, y - 9, 1.5)
    g.fill({ color: blink ? 0x48bb78 : 0x38b764, alpha: blink ? 1 : 0.5 })

    // Headlights
    g.circle(x + 10, y - 1, 1)
    g.fill({ color: 0xffcd75, alpha: 0.8 })
    g.circle(x - 10, y - 1, 1)
    g.fill({ color: 0xef7d57, alpha: 0.6 })

    // Wheel pixels
    g.rect(x + 7, y + 1, 3, 2)
    g.fill({ color: 0x1a1c2c })
    g.rect(x - 10, y + 1, 3, 2)
    g.fill({ color: 0x1a1c2c })
  }

  // ═══════════════════════════════════════════════════════════════════
  // SCENARIO EVENT ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════

  private fireRoboRideAnnounce(): void {
    if (!this.app) return

    // White flash overlay
    const flash = new Graphics()
    flash.rect(0, 0, this.app.screen.width, this.app.screen.height)
    flash.fill({ color: 0xffffff, alpha: 0 })
    this.overlayContainer.addChild(flash)
    this.overlayAnimations.push({
      type: 'flash',
      startTime: Date.now(),
      duration: 700,
      container: flash as unknown as Container,
    })

    // Celebration particles
    const cx = this.app.screen.width / 2 - this.worldContainer.x
    const cy = this.app.screen.height / 3 - this.worldContainer.y
    this.burstParticles(cx, cy, 30, [0xffd700, 0x41a6f6, 0xf4f4f4, 0x48bb78], 50)

    // News ticker with pixel-art background
    const tickerBg = new Graphics()
    tickerBg.rect(0, 2, this.app.screen.width, 18)
    tickerBg.fill({ color: 0x1a1c2c, alpha: 0.85 })
    tickerBg.rect(0, 2, this.app.screen.width, 1)
    tickerBg.fill({ color: 0xffd700, alpha: 0.6 })
    tickerBg.rect(0, 19, this.app.screen.width, 1)
    tickerBg.fill({ color: 0xffd700, alpha: 0.6 })
    this.overlayContainer.addChild(tickerBg)
    this.newsTickerBg = tickerBg

    const news = new Text({
      text: '>> BREAKING: RoboRide announces autonomous vehicle service for Millfield <<',
      style: { fontSize: 11, fill: 0xffd700, fontFamily: 'monospace', fontWeight: 'bold' },
    })
    news.x = this.app.screen.width
    news.y = 5
    this.overlayContainer.addChild(news)
    this.newsTickerText = news
  }

  private fireMassLayoff(): void {
    if (!this.app) return

    // Brief dim flash on all buildings
    const flash = new Graphics()
    flash.rect(0, 0, this.app.screen.width, this.app.screen.height)
    flash.fill({ color: 0x000000, alpha: 0 })
    this.overlayContainer.addChild(flash)
    this.overlayAnimations.push({
      type: 'dim_flash',
      startTime: Date.now(),
      duration: 1500,
      container: flash as unknown as Container,
    })
  }

  private fireInformalMarket(): void {
    if (!this.app) return

    const stallContainer = new Container()
    const stallColors = [0xed8936, 0xe53e3e, 0x48bb78, 0x4299e1]
    const basePos = isoToScreen(19, 15)

    for (let i = 0; i < 4; i++) {
      const stall = new Graphics()
      const sx = basePos.x + (i % 2 - 0.5) * 22
      const sy = basePos.y + Math.floor(i / 2) * 14 + TILE_H / 2

      // Shadow
      stall.ellipse(sx, sy + 3, 10, 4)
      stall.fill({ color: 0x0a0a0f, alpha: 0.2 })

      // Stall counter (wooden)
      stall.rect(sx - 8, sy - 2, 16, 5)
      stall.fill({ color: 0x735039 })
      stall.rect(sx - 8, sy - 2, 16, 5)
      stall.stroke({ color: 0x4a3728, width: 1 })
      // Counter legs
      stall.rect(sx - 7, sy + 3, 2, 4)
      stall.fill({ color: 0x4a3728 })
      stall.rect(sx + 5, sy + 3, 2, 4)
      stall.fill({ color: 0x4a3728 })

      // Awning (canvas cover)
      stall.poly([sx - 10, sy - 12, sx + 10, sy - 12, sx + 8, sy - 4, sx - 8, sy - 4])
      stall.fill({ color: stallColors[i], alpha: 0.85 })
      stall.poly([sx - 10, sy - 12, sx + 10, sy - 12, sx + 8, sy - 4, sx - 8, sy - 4])
      stall.stroke({ color: 0x1a1c2c, width: 1 })
      // Awning scallop
      for (let s = -7; s < 8; s += 4) {
        stall.rect(sx + s, sy - 5, 3, 2)
        stall.fill({ color: this.blendColor(stallColors[i], 0x000000, 0.3) })
      }

      // Goods on counter (tiny colored rects)
      const goodColors = [0xffcd75, 0x48bb78, 0xef7d57, 0xf4f4f4]
      for (let g = 0; g < 4; g++) {
        stall.rect(sx - 6 + g * 3, sy - 1, 2, 2)
        stall.fill({ color: goodColors[(i + g) % 4], alpha: 0.9 })
      }

      // Pole supports
      stall.rect(sx - 9, sy - 12, 1, 10)
      stall.fill({ color: 0x4a3728 })
      stall.rect(sx + 8, sy - 12, 1, 10)
      stall.fill({ color: 0x4a3728 })

      stall.alpha = 0
      stallContainer.addChild(stall)

      const delay = i * 300
      setTimeout(() => {
        stall.alpha = 1
        this.burstParticles(sx, sy - 6, 8, [stallColors[i], 0xffcd75, 0xf4f4f4], 25)
      }, delay)
    }

    this.overlayContainer.addChild(stallContainer)
    this.informalMarketStalls = stallContainer
  }

  private fireProtestWave(): void {
    if (!this.app) return

    const protestGroup = new Container()

    for (let i = 0; i < PROTEST_TILES.length; i++) {
      const [col, row] = PROTEST_TILES[i]
      const { x, y } = isoToScreen(col, row)
      const py = y + TILE_H / 2

      const person = new Graphics()

      // Shadow
      person.ellipse(x, py + 1, 4, 2)
      person.fill({ color: 0x0a0a0f, alpha: 0.3 })

      // Small pixel-art protest person (body)
      person.rect(x - 3, py - 10, 6, 10)
      person.fill({ color: 0xfbbf24 })
      person.rect(x - 3, py - 10, 6, 10)
      person.stroke({ color: 0x1a1c2c, width: 1 })
      // Head
      person.rect(x - 2, py - 14, 4, 4)
      person.fill({ color: 0xc28569 })
      person.rect(x - 2, py - 14, 4, 4)
      person.stroke({ color: 0x1a1c2c, width: 1 })
      // Legs
      person.rect(x - 2, py, 2, 3)
      person.fill({ color: 0x1a1c2c })
      person.rect(x + 1, py, 2, 3)
      person.fill({ color: 0x1a1c2c })

      // Sign (small rect on stick above some)
      if (i % 2 === 0) {
        // Sign post
        person.rect(x, py - 22, 1, 8)
        person.fill({ color: 0x735039 })
        // Sign board
        person.rect(x - 5, py - 26, 10, 5)
        person.fill({ color: 0xf4f4f4 })
        person.rect(x - 5, py - 26, 10, 5)
        person.stroke({ color: 0x1a1c2c, width: 1 })
        // Red text dots on sign
        person.rect(x - 3, py - 24, 2, 1)
        person.fill({ color: 0xe53e3e })
        person.rect(x + 1, py - 24, 2, 1)
        person.fill({ color: 0xe53e3e })
      }

      person.alpha = 0
      protestGroup.addChild(person)

      // Staggered appear with burst particles
      setTimeout(() => {
        person.alpha = 1
        this.burstParticles(x, py - 8, 5, [0xfbbf24, 0xffcd75, 0xf4f4f4], 20)
      }, i * 100)
    }

    this.overlayContainer.addChild(protestGroup)
    this.protestContainer = protestGroup
  }

  private fireDepressionCluster(): void {
    if (!this.app) return

    // Purple pulse rings on depression cluster agents
    for (const agentId of DEPRESSION_CLUSTER_AGENTS) {
      this.addPulseRing(agentId, 0x9f7aea, 3)
    }
  }

  private fireRunwayCrisis(): void {
    if (!this.app || !this.lastAgents) return

    // Find all agents with runway_months < 1 (runway=0 crisis)
    for (const [agentId, agent] of Object.entries(this.lastAgents)) {
      if (agent.runway_months < 1) {
        this.addPulseRing(agentId, 0xef4444, 3) // red, 3 pulse cycles
      }
    }
  }

  private addPulseRing(agentId: string, color: number, repeatCount: number): void {
    const container = new Container()

    // Draw a ring graphic in the container
    const g = new Graphics()
    g.circle(0, 0, 14)
    g.stroke({ color, width: 2.5, alpha: 0.9 })
    container.addChild(g)

    this.depthRingContainers.set(agentId, container)
    this.overlayContainer.addChild(container)

    // Clean up after animation
    setTimeout(() => {
      this.depthRingContainers.delete(agentId)
      if (container.parent) this.overlayContainer.removeChild(container)
    }, repeatCount * 1000)
  }

  // ═══════════════════════════════════════════════════════════════════
  // TICKER ANIMATIONS (called every frame)
  // ═══════════════════════════════════════════════════════════════════

  private tickAnimations(dt: number): void {
    const now = Date.now()

    // Walk animation frame counter (6 fps walk cycle)
    this.walkTimer += dt
    if (this.walkTimer > 0.167) {
      this.walkTimer -= 0.167
      this.walkFrame++
    }

    // Hustle bounce
    this.hustleContainers.forEach((data, id) => {
      const idx = parseInt(id.replace(/\D/g, ''), 10) || 0
      data.container.y = data.baseY - Math.abs(Math.sin(now * 0.005 + idx * 0.8)) * 4
    })

    // Declining building flicker
    for (const { g, baseAlpha } of this.decliningGraphics) {
      g.alpha = baseAlpha + Math.sin(now * 0.003) * 0.08
    }

    // Ambient particle spawning (dust motes, fireflies)
    this.ambientTimer += dt
    if (this.ambientTimer > 0.3) {
      this.ambientTimer -= 0.3
      this.spawnAmbientParticle()
    }

    // Smoke particles from chimneys
    if (now % 500 < 20) {
      this.spawnSmokeParticle()
    }

    // Robotaxi movement
    for (const rt of this.robotaxis) {
      rt.progress += dt * 0.3
      const pathIdx = Math.floor(rt.progress) % ROBOTAXI_ROAD.length
      const nextIdx = (pathIdx + 1) % ROBOTAXI_ROAD.length
      const frac = rt.progress % 1
      const pos = lerpTile(ROBOTAXI_ROAD[pathIdx], ROBOTAXI_ROAD[nextIdx], frac)

      rt.container.removeChildren()
      const g = new Graphics()
      this.drawRoboTaxi(g, pos.x, pos.y + TILE_H / 2)
      rt.container.addChild(g)
    }

    // News ticker scroll
    if (this.newsTickerText) {
      this.newsTickerText.x -= 2
      if (this.newsTickerText.x < -this.newsTickerText.width - 50) {
        this.overlayContainer.removeChild(this.newsTickerText)
        this.newsTickerText = null
        // Also clean up the ticker background
        if (this.newsTickerBg) {
          this.overlayContainer.removeChild(this.newsTickerBg)
          this.newsTickerBg = null
        }
      }
    }

    // Overlay animations (flash, dim, etc.)
    const toRemove: number[] = []
    for (let i = 0; i < this.overlayAnimations.length; i++) {
      const anim = this.overlayAnimations[i]
      const elapsed = now - anim.startTime
      const progress = Math.min(1, elapsed / anim.duration)

      if (anim.type === 'flash') {
        // Flash: 0→0.4 in first 30%, then 0.4→0 rest
        const g = anim.container as unknown as Graphics
        if (progress < 0.3) {
          g.alpha = (progress / 0.3) * 0.4
        } else {
          g.alpha = 0.4 * (1 - (progress - 0.3) / 0.7)
        }
      } else if (anim.type === 'dim_flash') {
        const g = anim.container as unknown as Graphics
        if (progress < 0.2) {
          g.alpha = (progress / 0.2) * 0.5
        } else {
          g.alpha = 0.5 * (1 - (progress - 0.2) / 0.8)
        }
      }

      if (progress >= 1) {
        this.overlayContainer.removeChild(anim.container)
        toRemove.push(i)
      }
    }
    for (let i = toRemove.length - 1; i >= 0; i--) {
      this.overlayAnimations.splice(toRemove[i], 1)
    }

    // FOR LEASE slide-in animations
    this.forLeaseAnimations.forEach((anim) => {
      const elapsed = (now - anim.startTime) / 1000
      const progress = Math.min(1, elapsed / 0.5)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      anim.text.y = anim.startY + (anim.targetY - anim.startY) * eased
      anim.text.alpha = eased
    })

    // Depth ring pulse animation
    this.depthRingContainers.forEach((container) => {
      const scale = 1 + Math.sin(now * 0.006) * 0.15
      container.scale.set(scale)
    })
  }

  // ═══════════════════════════════════════════════════════════════════
  // PIXEL PARTICLE SYSTEM
  // ═══════════════════════════════════════════════════════════════════

  private updateParticles(dt: number): void {
    this.particleGraphics.clear()

    // Update and draw
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life -= dt
      if (p.life <= 0) {
        this.particles.splice(i, 1)
        continue
      }

      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += p.gravity * dt

      const alpha = Math.min(1, p.life / p.maxLife * 2)
      this.particleGraphics.rect(Math.round(p.x), Math.round(p.y), p.size, p.size)
      this.particleGraphics.fill({ color: p.color, alpha })
    }

    // Match world container position for camera following
    this.particleGraphics.x = this.worldContainer.x
    this.particleGraphics.y = this.worldContainer.y
  }

  private spawnAmbientParticle(): void {
    if (!this.app || this.particles.length > 200) return
    // Dust motes drifting across the scene
    const screenW = this.app.screen.width
    const screenH = this.app.screen.height
    const colors = [0x94b0c2, 0xc2c3c7, 0xffcd75, 0x566c86]
    const x = Math.random() * screenW * 1.5 - this.worldContainer.x
    const y = Math.random() * screenH - this.worldContainer.y

    this.particles.push({
      x, y,
      vx: (Math.random() - 0.3) * 8,
      vy: -Math.random() * 3 - 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 3 + Math.random() * 4,
      maxLife: 7,
      size: Math.random() < 0.3 ? 2 : 1,
      gravity: -0.5,
    })
  }

  private spawnSmokeParticle(): void {
    if (this.activeChimneyPositions.length === 0 || this.particles.length > 200) return
    // Pick a random active chimney
    const chimney = this.activeChimneyPositions[
      Math.floor(Math.random() * this.activeChimneyPositions.length)
    ]
    const colors = [0x566c86, 0x94b0c2, 0xc2c3c7]

    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: chimney.x + (Math.random() - 0.5) * 4,
        y: chimney.y,
        vx: (Math.random() - 0.5) * 3,
        vy: -6 - Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.5 + Math.random() * 2,
        maxLife: 3.5,
        size: Math.random() < 0.5 ? 2 : 1,
        gravity: -1.5,
      })
    }
  }

  /** Burst particles at a location (for events like hits, pickups, etc.) */
  private burstParticles(x: number, y: number, count: number, colors: number[], speed: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = speed * (0.5 + Math.random() * 0.5)
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - speed * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.5 + Math.random() * 1,
        maxLife: 1.5,
        size: Math.random() < 0.3 ? 2 : 1,
        gravity: 20,
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════

  private getSnapForTick(agent: Agent, tick: number): Record<string, any> {
    const snap = agent.history[String(tick)]
    if (snap) return snap
    for (let t = tick - 1; t >= 0; t--) {
      const fallback = agent.history[String(t)]
      if (fallback) return fallback
    }
    return {}
  }
}
