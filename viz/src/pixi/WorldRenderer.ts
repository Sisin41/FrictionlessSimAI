/**
 * WorldRenderer.ts
 * Core PixiJS isometric renderer for Millfield.
 * Renders tile grid, buildings, and agents with z-ordering.
 */

import { Application, Container, Graphics, Text } from 'pixi.js'
import { isoToScreen, tileDepth, TILE_W, TILE_H, GRID_COLS, GRID_ROWS, BUILDING_SPRITE_SIZE } from './iso'
import { getBuildingVisual, applyBuildingOverrides } from './buildingSprite'
import { getAgentLocation, TIER_TINT, GRIEF_TINT, getRunwayRingColor } from './agentSprite'
import type { Agent, Building, BuildingTickState } from '../store/simStore'
import { HOME_TILES, locationToTile } from './worldData'

// Zone definitions for tile coloring
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

interface Renderable {
  depth: number
  container: Container
}

export class WorldRenderer {
  private app: Application | null = null
  private worldContainer: Container = new Container()
  private highlightedAgentId: string | null = null

  // Callbacks
  onAgentClick: ((id: string) => void) | null = null
  onBuildingClick: ((id: string) => void) | null = null

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application()
    await this.app.init({
      width: container.clientWidth || 1200,
      height: container.clientHeight || 700,
      background: 0x1a202c,
      antialias: true,
      resizeTo: container,
    })
    container.appendChild(this.app.canvas)
    this.app.stage.addChild(this.worldContainer)
  }

  render(
    tick: number,
    agents: Record<string, Agent>,
    buildingStates: Record<string, BuildingTickState> | undefined,
    buildings: Building[],
  ): void {
    if (!this.app) return

    this.worldContainer.removeChildren()

    // Build a map of building id → tile position
    const buildingTiles: Record<string, [number, number]> = {}
    for (const b of buildings) {
      buildingTiles[b.id] = b.tile
    }

    // Collect all renderables for z-ordering
    const renderables: Renderable[] = []

    // 1. Tile grid
    this.renderTileGrid(renderables)

    // 2. Buildings
    this.renderBuildings(renderables, buildings, buildingStates, tick)

    // 3. Agents
    this.renderAgents(renderables, agents, buildingTiles, tick)

    // Sort by depth (lower depth = further from camera = drawn first)
    renderables.sort((a, b) => a.depth - b.depth)

    // Add all to stage in order
    for (const r of renderables) {
      this.worldContainer.addChild(r.container)
    }
  }

  highlightAgent(id: string | null): void {
    this.highlightedAgentId = id
  }

  destroy(): void {
    if (this.app) {
      this.app.destroy(true)
      this.app = null
    }
  }

  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height)
    }
  }

  // ─── Tile Grid ───────────────────────────────────────────────────

  private getZoneColor(col: number, row: number): number {
    // Check zones in reverse order so more specific zones override general ones
    // residential_t4 is the broadest, check it last
    for (let i = ZONES.length - 1; i >= 0; i--) {
      const z = ZONES[i]
      if (col >= z.cols[0] && col <= z.cols[1] && row >= z.rows[0] && row <= z.rows[1]) {
        // Return a very dark version of the zone color (blend with dark bg)
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
    // Batch tiles per zone color for performance
    const colorBatches: Map<number, Array<[number, number]>> = new Map()

    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        const color = this.getZoneColor(col, row)
        if (!colorBatches.has(color)) colorBatches.set(color, [])
        colorBatches.get(color)!.push([col, row])
      }
    }

    for (const [color, tiles] of colorBatches) {
      const g = new Graphics()

      for (const [col, row] of tiles) {
        const { x, y } = isoToScreen(col, row)
        // Diamond: top, right, bottom, left
        g.poly([
          x,              y,
          x + TILE_W / 2, y + TILE_H / 2,
          x,              y + TILE_H,
          x - TILE_W / 2, y + TILE_H / 2,
        ])
        g.fill({ color, alpha: 0.6 })
        g.stroke({ color: 0x2d3748, width: 0.5 })
      }

      const container = new Container()
      container.addChild(g)
      renderables.push({ depth: -1, container })
    }
  }

  // ─── Buildings ───────────────────────────────────────────────────

  private renderBuildings(
    renderables: Renderable[],
    buildings: Building[],
    buildingStates: Record<string, BuildingTickState> | undefined,
    tick: number,
  ): void {
    for (const building of buildings) {
      // Check appears_tick
      if (building.appears_tick > tick) continue

      const state = buildingStates?.[building.id]
      if (!state) continue
      if (!state.visible) continue

      let visual = getBuildingVisual(state)
      visual = applyBuildingOverrides(building.id, visual, state.health)

      const [col, row] = building.tile
      const { x, y } = isoToScreen(col, row)
      const depth = tileDepth(col, row)

      const sizeSpec = BUILDING_SPRITE_SIZE[building.size]
      const bw = sizeSpec.w
      const bh = sizeSpec.h

      const container = new Container()
      container.eventMode = 'static'
      container.cursor = 'pointer'
      container.on('pointerdown', () => {
        this.onBuildingClick?.(building.id)
      })

      const g = new Graphics()

      // Building floor (diamond at ground level)
      const floorHalfW = bw / 2
      const floorHalfH = bw / 4  // isometric squash
      g.poly([
        x,                y + TILE_H / 2,
        x + floorHalfW,  y + TILE_H / 2 + floorHalfH,
        x,                y + TILE_H / 2 + floorHalfH * 2,
        x - floorHalfW,  y + TILE_H / 2 + floorHalfH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.3), alpha: 0.4 })

      // Wall height based on building size
      const wallH = bh * 0.6

      // Left wall
      g.poly([
        x,                y + TILE_H / 2 - wallH,
        x,                y + TILE_H / 2,
        x - floorHalfW,  y + TILE_H / 2 + floorHalfH,
        x - floorHalfW,  y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.5), alpha: visual.saturation * 0.8 + 0.2 })

      // Right wall
      g.poly([
        x,                y + TILE_H / 2 - wallH,
        x,                y + TILE_H / 2,
        x + floorHalfW,  y + TILE_H / 2 + floorHalfH,
        x + floorHalfW,  y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.35), alpha: visual.saturation * 0.8 + 0.2 })

      // Roof (flat top)
      g.poly([
        x,                y + TILE_H / 2 - wallH,
        x + floorHalfW,  y + TILE_H / 2 + floorHalfH - wallH,
        x,                y + TILE_H / 2 + floorHalfH * 2 - wallH,
        x - floorHalfW,  y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: visual.tint, alpha: visual.saturation * 0.6 + 0.2 })

      // Interior light on right wall
      if (visual.lightAlpha > 0) {
        const lw = floorHalfW * 0.4
        const lh = wallH * 0.35
        const lx = x + floorHalfW * 0.3
        const ly = y + TILE_H / 2 - wallH * 0.6
        g.rect(lx, ly, lw, lh)
        g.fill({ color: 0xfff3c4, alpha: visual.lightAlpha * 0.5 })
      }

      container.addChild(g)

      // FOR LEASE sign
      if (visual.forLeaseSign) {
        const sign = new Text({
          text: 'FOR LEASE',
          style: { fill: 0xe53e3e, fontSize: 7, fontWeight: 'bold', fontFamily: 'monospace' },
        })
        sign.x = x - sign.width / 2
        sign.y = y + TILE_H / 2 - wallH * 0.3
        container.addChild(sign)
      }

      // Building label
      const label = new Text({
        text: building.label.length > 16 ? building.label.slice(0, 14) + '...' : building.label,
        style: { fill: 0xcccccc, fontSize: 8, fontFamily: 'monospace' },
      })
      label.x = x - label.width / 2
      label.y = y + TILE_H / 2 - wallH - 12
      container.addChild(label)

      // Health indicator
      const healthText = new Text({
        text: `${state.health.toFixed(0)}%`,
        style: {
          fill: state.health >= 70 ? 0x48bb78 : state.health >= 40 ? 0xf97316 : 0xe53e3e,
          fontSize: 7,
          fontFamily: 'monospace',
        },
      })
      healthText.x = x - healthText.width / 2
      healthText.y = y + TILE_H / 2 - wallH - 22
      container.addChild(healthText)

      renderables.push({ depth, container })
    }
  }

  // ─── Agents ──────────────────────────────────────────────────────

  private renderAgents(
    renderables: Renderable[],
    agents: Record<string, Agent>,
    buildingTiles: Record<string, [number, number]>,
    tick: number,
  ): void {
    // Track agents per tile for jitter offsets
    const tileOccupancy: Map<string, number> = new Map()

    const agentEntries = Object.entries(agents)
    for (const [agentId, agent] of agentEntries) {
      // Get snapshot for this tick (fall back to nearest earlier tick)
      const snap = this.getSnapForTick(agent, tick)
      const employmentStatus = snap.employment_status ?? 'unemployed'

      // Determine location
      const location = getAgentLocation({
        employment_status: employmentStatus,
        grief_stage: agent.grief_stage,
        agency: agent.agency,
        runway_months: agent.runway_months,
        archetype: agent.archetype,
        has_active_tx: false,
        transformations: agent.transformations ?? [],
      })

      const tile = locationToTile(location, agentId, buildingTiles)
      const tileKey = `${tile[0]},${tile[1]}`
      const agentIndex = tileOccupancy.get(tileKey) ?? 0
      tileOccupancy.set(tileKey, agentIndex + 1)

      const { x: baseX, y: baseY } = isoToScreen(tile[0], tile[1])
      // Jitter to spread agents at same tile
      const jitterX = (agentIndex % 5 - 2) * 8
      const jitterY = Math.floor(agentIndex / 5) * 6
      const ax = baseX + jitterX
      const ay = baseY + TILE_H / 2 + jitterY

      const depth = tileDepth(tile[0], tile[1]) + 0.5

      const container = new Container()
      container.eventMode = 'static'
      container.cursor = 'pointer'
      container.on('pointerdown', () => {
        this.onAgentClick?.(agentId)
      })

      const g = new Graphics()
      const tierColor = TIER_TINT[agent.tier] ?? 0x718096

      // Body rectangle (12×18)
      g.rect(ax - 6, ay - 18, 12, 18)
      g.fill({ color: tierColor })

      // Head circle (8×8)
      g.circle(ax, ay - 22, 4)
      g.fill({ color: tierColor })

      // Grief overlay
      const griefColor = GRIEF_TINT[agent.grief_stage]
      if (griefColor != null) {
        g.rect(ax - 6, ay - 18, 12, 18)
        g.fill({ color: griefColor, alpha: 0.35 })
        g.circle(ax, ay - 22, 4)
        g.fill({ color: griefColor, alpha: 0.35 })
      }

      // Runway danger ring
      const ringColor = getRunwayRingColor(agent.runway_months)
      if (ringColor != null) {
        g.circle(ax, ay - 12, 10)
        g.stroke({ color: ringColor, width: 2 })
      }

      // Highlight selected agent
      if (this.highlightedAgentId === agentId) {
        g.circle(ax, ay - 12, 14)
        g.stroke({ color: 0xffffff, width: 2, alpha: 0.8 })
      }

      // Employment change flash (white outline)
      if (snap.employment_changed) {
        g.rect(ax - 8, ay - 24, 16, 26)
        g.stroke({ color: 0xffffff, width: 1.5, alpha: 0.9 })
      }

      container.addChild(g)

      // Agent name label (only on hover area, but we show tiny text always)
      const nameLabel = new Text({
        text: agent.name.split(' ')[0],
        style: { fill: 0x999999, fontSize: 7, fontFamily: 'monospace' },
      })
      nameLabel.x = ax - nameLabel.width / 2
      nameLabel.y = ay + 2
      container.addChild(nameLabel)

      renderables.push({ depth, container })
    }
  }

  /** Get the best available snapshot for a tick, falling back to earlier ticks. */
  private getSnapForTick(agent: Agent, tick: number): Record<string, any> {
    const snap = agent.history[String(tick)]
    if (snap) return snap
    // Fall back to nearest earlier tick
    for (let t = tick - 1; t >= 0; t--) {
      const fallback = agent.history[String(t)]
      if (fallback) return fallback
    }
    return {}
  }
}
