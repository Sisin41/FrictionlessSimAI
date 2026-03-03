/**
 * WorldRenderer.ts
 * Core PixiJS isometric renderer for Millfield — Phase 2.
 * Adds: movement interpolation, animation states, building transitions,
 * robotaxi sprites, scenario event animations, phenomena visuals.
 */

import { Application, Container, Graphics, Text } from 'pixi.js'
import { isoToScreen, lerpTile, tileDepth, TILE_W, TILE_H, GRID_COLS, GRID_ROWS, BUILDING_SPRITE_SIZE } from './iso'
import { getBuildingVisual, applyBuildingOverrides, type BuildingVisual } from './buildingSprite'
import { getAnimationState, getAgentLocation, TIER_TINT, GRIEF_TINT, getRunwayRingColor, type AnimationState } from './agentSprite'
import type { Agent, Building, BuildingTickState, SocialEdge, Transaction, LayerId } from '../store/simStore'
import { locationToTile } from './worldData'
import { BuildingTransitionManager, lerpColor } from './BuildingTransitionManager'
import { LayerRenderer } from './LayerRenderer'

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
  private protestContainer: Container | null = null
  private depthRingContainers: Map<string, Container> = new Map()
  private forLeaseAnimations: Map<string, { text: Text; targetY: number; startY: number; startTime: number }> = new Map()
  private informalMarketStalls: Container | null = null
  private lastAgents: Record<string, Agent> | null = null

  // Follow Agent mode
  private followedAgentId: string | null = null

  // Track tick for transition detection
  private lastRenderedTick = -1
  private currentRobotaxiCount = 0

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
    this.app.stage.addChild(this.layerContainer)
    this.layerContainer.addChild(this.layerRenderer.getContainer())
    this.app.stage.addChild(this.robotaxiContainer)
    this.app.stage.addChild(this.overlayContainer)

    // Ticker for continuous animations
    this.app.ticker.add(() => {
      const dt = this.app!.ticker.deltaMS / 1000
      this.tickAnimations(dt)
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
    this.forLeaseAnimations.clear()

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
      }
    } else {
      // Reset camera position when not following
      this.worldContainer.x += (0 - this.worldContainer.x) * 0.15
      this.worldContainer.y += (0 - this.worldContainer.y) * 0.15
      this.robotaxiContainer.x = this.worldContainer.x
      this.robotaxiContainer.y = this.worldContainer.y
      this.layerContainer.x = this.worldContainer.x
      this.layerContainer.y = this.worldContainer.y
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
      this.app.destroy(true)
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
        g.poly([x, y, x + TILE_W / 2, y + TILE_H / 2, x, y + TILE_H, x - TILE_W / 2, y + TILE_H / 2])
        g.fill({ color, alpha: 0.6 })
        g.stroke({ color: 0x2d3748, width: 0.5 })
      }
      const container = new Container()
      container.addChild(g)
      renderables.push({ depth: -1, container })
    }
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

      // Use transition override if active, otherwise compute normally
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

      // Floor diamond
      g.poly([
        x, y + TILE_H / 2,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH,
        x, y + TILE_H / 2 + floorHalfH * 2,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.3), alpha: 0.4 })

      // Left wall
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x, y + TILE_H / 2,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.5), alpha: visual.saturation * 0.8 + 0.2 })

      // Right wall
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x, y + TILE_H / 2,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: this.blendColor(visual.tint, 0x000000, 0.35), alpha: visual.saturation * 0.8 + 0.2 })

      // Roof
      g.poly([
        x, y + TILE_H / 2 - wallH,
        x + floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
        x, y + TILE_H / 2 + floorHalfH * 2 - wallH,
        x - floorHalfW, y + TILE_H / 2 + floorHalfH - wallH,
      ])
      g.fill({ color: visual.tint, alpha: visual.saturation * 0.6 + 0.2 })

      // Interior light
      if (visual.lightAlpha > 0) {
        const lw = floorHalfW * 0.4
        const lh = wallH * 0.35
        const lx = x + floorHalfW * 0.3
        const ly = y + TILE_H / 2 - wallH * 0.6
        g.rect(lx, ly, lw, lh)
        g.fill({ color: 0xfff3c4, alpha: visual.lightAlpha * 0.5 })
      }

      container.addChild(g)

      // Track declining buildings for flicker effect
      if (state.visual_state === 'declining' || state.visual_state === 'closing') {
        this.decliningGraphics.push({ g, baseAlpha: visual.saturation * 0.8 + 0.2 })
      }

      // FOR LEASE sign with slide-in animation
      if (visual.forLeaseSign) {
        const sign = new Text({
          text: 'FOR LEASE',
          style: { fill: 0xe53e3e, fontSize: 7, fontWeight: 'bold', fontFamily: 'monospace' },
        })
        const targetY = y + TILE_H / 2 - wallH * 0.3
        sign.x = x - sign.width / 2

        // If newly appearing, start above and animate down
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
    const tierColor = TIER_TINT[agent.tier] ?? 0x718096
    const griefColor = GRIEF_TINT[agent.grief_stage]

    switch (animState) {
      case 'sit': {
        // Seated: shorter body, shifted down
        g.rect(ax - 7, ay - 8, 14, 10)
        g.fill({ color: tierColor, alpha: 0.8 })
        g.circle(ax, ay - 13, 4)
        g.fill({ color: tierColor })
        if (griefColor != null) {
          g.rect(ax - 7, ay - 8, 14, 10)
          g.fill({ color: griefColor, alpha: 0.35 })
        }
        break
      }
      case 'slump': {
        // Tall narrow, head drooped right
        g.rect(ax - 5, ay - 20, 10, 20)
        g.fill({ color: tierColor })
        g.circle(ax + 2, ay - 22, 4)
        g.fill({ color: tierColor })
        if (griefColor != null) {
          g.rect(ax - 5, ay - 20, 10, 20)
          g.fill({ color: griefColor, alpha: 0.35 })
        }
        break
      }
      case 'hustle': {
        // Normal body with bounce — tracked for ticker animation
        g.rect(ax - 6, ay - 18, 12, 18)
        g.fill({ color: tierColor })
        g.circle(ax, ay - 22, 4)
        g.fill({ color: tierColor })
        if (griefColor != null) {
          g.rect(ax - 6, ay - 18, 12, 18)
          g.fill({ color: griefColor, alpha: 0.35 })
        }
        this.hustleContainers.set(agentId, { container, baseY: container.y })
        break
      }
      case 'walk_ne': {
        // Lean forward (tilt right)
        g.rect(ax - 6, ay - 18, 12, 18)
        g.fill({ color: tierColor })
        g.circle(ax, ay - 22, 4)
        g.fill({ color: tierColor })
        if (griefColor != null) {
          g.rect(ax - 6, ay - 18, 12, 18)
          g.fill({ color: griefColor, alpha: 0.35 })
        }
        if (isMoving) container.rotation = 0.14  // ~8 degrees
        container.pivot.set(ax, ay - 10)
        container.position.set(ax, ay - 10)
        break
      }
      case 'walk_sw': {
        // Lean back (tilt left)
        g.rect(ax - 6, ay - 18, 12, 18)
        g.fill({ color: tierColor })
        g.circle(ax, ay - 22, 4)
        g.fill({ color: tierColor })
        if (griefColor != null) {
          g.rect(ax - 6, ay - 18, 12, 18)
          g.fill({ color: griefColor, alpha: 0.35 })
        }
        if (isMoving) container.rotation = -0.14
        container.pivot.set(ax, ay - 10)
        container.position.set(ax, ay - 10)
        break
      }
      case 'work': {
        // Angled at desk
        g.rect(ax - 6, ay - 16, 12, 16)
        g.fill({ color: tierColor })
        g.circle(ax, ay - 20, 4)
        g.fill({ color: tierColor })
        // Small desk line
        g.rect(ax - 8, ay - 4, 16, 2)
        g.fill({ color: 0x555555 })
        break
      }
      case 'talk': {
        // Normal + speech pip
        g.rect(ax - 6, ay - 18, 12, 18)
        g.fill({ color: tierColor })
        g.circle(ax, ay - 22, 4)
        g.fill({ color: tierColor })
        // Speech bubble pip
        g.circle(ax + 8, ay - 26, 2)
        g.fill({ color: 0xffffff, alpha: 0.7 })
        g.circle(ax + 12, ay - 30, 3)
        g.fill({ color: 0xffffff, alpha: 0.5 })
        break
      }
      default: {
        // idle — standard upright
        g.rect(ax - 6, ay - 18, 12, 18)
        g.fill({ color: tierColor })
        g.circle(ax, ay - 22, 4)
        g.fill({ color: tierColor })
        if (griefColor != null) {
          g.rect(ax - 6, ay - 18, 12, 18)
          g.fill({ color: griefColor, alpha: 0.35 })
          g.circle(ax, ay - 22, 4)
          g.fill({ color: griefColor, alpha: 0.35 })
        }
        break
      }
    }

    // Runway danger ring
    const ringColor = getRunwayRingColor(agent.runway_months)
    if (ringColor != null) {
      g.circle(ax, ay - 12, 10)
      g.stroke({ color: ringColor, width: 2 })
    }

    // Update pulse ring position if this agent has one
    const pulseRing = this.depthRingContainers.get(agentId)
    if (pulseRing) {
      pulseRing.x = ax
      pulseRing.y = ay - 12
    }

    // Highlight selected agent
    if (this.highlightedAgentId === agentId) {
      g.circle(ax, ay - 12, 14)
      g.stroke({ color: 0xffffff, width: 2, alpha: 0.8 })
    }

    container.addChild(g)

    // Name label
    const nameLabel = new Text({
      text: agent.name.split(' ')[0],
      style: { fill: 0x999999, fontSize: 7, fontFamily: 'monospace' },
    })
    nameLabel.x = ax - nameLabel.width / 2
    nameLabel.y = ay + 2
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
    // Chassis: small isometric box
    g.poly([x, y - 4, x + 10, y, x, y + 4, x - 10, y])
    g.fill({ color: 0x63b3ed })
    // Roof bubble
    g.ellipse(x, y - 6, 7, 4)
    g.fill({ color: 0x90cdf4, alpha: 0.8 })
    // Sensor halo
    g.circle(x, y - 8, 3)
    g.fill({ color: 0xffffff, alpha: 0.6 })
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

    // News ticker
    const news = new Text({
      text: 'BREAKING: RoboRide announces autonomous vehicle service for Millfield',
      style: { fontSize: 13, fill: 0xffd700, fontFamily: 'monospace' },
    })
    news.x = this.app.screen.width
    news.y = 8
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

    // Informal market stalls appear sequentially
    const stallContainer = new Container()
    const stallColors = [0xed8936, 0xe53e3e, 0x48bb78, 0x4299e1]
    const basePos = isoToScreen(19, 15)

    for (let i = 0; i < 4; i++) {
      const stall = new Graphics()
      const sx = basePos.x + (i % 2 - 0.5) * 18
      const sy = basePos.y + Math.floor(i / 2) * 12 + TILE_H / 2

      // Stall awning
      stall.rect(sx - 8, sy - 10, 16, 8)
      stall.fill({ color: stallColors[i], alpha: 0.8 })
      // Stall counter
      stall.rect(sx - 6, sy - 2, 12, 4)
      stall.fill({ color: 0x8B4513, alpha: 0.7 })

      stall.alpha = 0
      stallContainer.addChild(stall)

      // Staggered appear
      const delay = i * 300
      setTimeout(() => { stall.alpha = 1 }, delay)
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

      const person = new Graphics()
      // Small protest person
      person.rect(x - 3, y - 8 + TILE_H / 2, 6, 10)
      person.fill({ color: 0xfbbf24 })
      person.circle(x, y - 10 + TILE_H / 2, 3)
      person.fill({ color: 0xfbbf24 })

      // Sign (small yellow rect above some)
      if (i % 2 === 0) {
        person.rect(x - 4, y - 18 + TILE_H / 2, 8, 5)
        person.fill({ color: 0xfbbf24, alpha: 0.8 })
        person.rect(x, y - 13 + TILE_H / 2, 1, 5)
        person.fill({ color: 0x8B4513 })
      }

      person.alpha = 0
      protestGroup.addChild(person)

      // Staggered appear
      setTimeout(() => { person.alpha = 1 }, i * 100)
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

    // Hustle bounce
    this.hustleContainers.forEach((data, id) => {
      const idx = parseInt(id.replace(/\D/g, ''), 10) || 0
      data.container.y = data.baseY - Math.abs(Math.sin(now * 0.005 + idx * 0.8)) * 4
    })

    // Declining building flicker
    for (const { g, baseAlpha } of this.decliningGraphics) {
      g.alpha = baseAlpha + Math.sin(now * 0.003) * 0.08
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
