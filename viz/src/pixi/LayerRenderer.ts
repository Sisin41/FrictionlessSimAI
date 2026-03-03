/**
 * LayerRenderer.ts
 * Renders the 7 information overlay layers for Phase 4.
 * Each layer draws into a shared Container that sits between the world and overlay.
 *
 * Layers:
 *   1. economic_heatmap  — Zone polygons colored by avg building health
 *   2. social_graph      — Lines between agent positions by trust/type
 *   3. info_flow         — Particle arcs for information propagation
 *   4. grief_topology    — Agents colored by grief stage (overrides tier tint)
 *   5. runway_countdown  — Countdown rings on home tiles
 *   6. stress_topology   — Radial heatmap over residential zones
 *   7. transaction_flow  — Animated arcs between transaction parties
 */

import { Container, Graphics, Text } from 'pixi.js'
import { isoToScreen, TILE_W, TILE_H, GRID_COLS, GRID_ROWS } from './iso'
import { HOME_TILES } from './worldData'
import { GRIEF_TINT, getRunwayRingColor } from './agentSprite'
import type { Agent, Building, BuildingTickState, SocialEdge, Transaction } from '../store/simStore'
import type { LayerId } from '../store/simStore'

// ─── Zone definitions (matching WorldRenderer) ───────────────────────
const ZONES = [
  { id: 'auto_row',       cols: [6, 17],  rows: [0, 4] },
  { id: 'services_row',   cols: [2, 17],  rows: [5, 9] },
  { id: 'civic_district', cols: [0, 5],   rows: [0, 9] },
  { id: 'education',      cols: [18, 25], rows: [0, 4] },
  { id: 'park',           cols: [18, 25], rows: [5, 9] },
  { id: 'residential_t1', cols: [0, 5],   rows: [10, 13] },
  { id: 'residential_t2', cols: [6, 11],  rows: [10, 13] },
  { id: 'residential_t4', cols: [0, 25],  rows: [14, 19] },
]

// Grief stage → color for grief topology layer
const GRIEF_LAYER_COLORS: Record<string, number> = {
  none:             0xaaaaaa,
  bargaining:       0xffd700,
  anger:            0xe53e3e,
  depression:       0x4a5568,
  acceptance:       0x48bb78,
  acceptance_early: 0x68d391,
}

// Social edge type → color
const EDGE_TYPE_COLOR: Record<string, number> = {
  neighbor:     0xfbbf24,  // amber
  colleague:    0x38b2ac,  // teal
  professional: 0x4299e1,  // blue
}

// Info flow message type → particle color
const INFO_PARTICLE_COLOR: Record<string, number> = {
  CAPABILITY_FACT: 0xffffff,
  MARKET_DATA:     0x4299e1,
  WORD_OF_MOUTH:   0xf97316,
  SECTOR_DATA:     0x48bb78,
  SOCIAL:          0x9f7aea,
  OBSERVATION:     0xa0aec0,
  NEWS:            0xfbbf24,
}

export class LayerRenderer {
  private container: Container = new Container()
  private infoFlowParticles: Array<{
    sx: number; sy: number; tx: number; ty: number
    color: number; startTime: number; speed: number
  }> = []
  private txFlowArcs: Array<{
    sx: number; sy: number; tx: number; ty: number
    color: number; dashed: boolean; startTime: number
  }> = []

  // ── Tick-level cache for static layers ──
  private cachedTick = -1
  private cachedHeatmap: Container | null = null
  private cachedStress: Container | null = null

  getContainer(): Container {
    return this.container
  }

  clear(): void {
    this.container.removeChildren()
  }

  /** Invalidate caches when tick changes. */
  private checkCache(tick: number): void {
    if (tick !== this.cachedTick) {
      this.cachedTick = tick
      this.cachedHeatmap = null
      this.cachedStress = null
    }
  }

  /**
   * Render active layers. Called every frame from WorldRenderer.
   */
  render(
    activeLayers: Set<LayerId>,
    tick: number,
    agents: Record<string, Agent>,
    buildings: Building[],
    buildingStates: Record<string, BuildingTickState> | undefined,
    socialEdges: SocialEdge[] | null,
    transactions: Transaction[] | null,
    txByTick: Record<string, string[]> | null,
    agentScreenPositions: Map<string, { x: number; y: number }>,
  ): void {
    this.clear()

    if (activeLayers.size === 0) return

    this.checkCache(tick)

    if (activeLayers.has('economic_heatmap')) {
      if (this.cachedHeatmap) {
        this.container.addChild(this.cachedHeatmap)
      } else {
        this.renderEconomicHeatmap(buildings, buildingStates)
      }
    }
    if (activeLayers.has('social_graph')) {
      this.renderSocialGraph(socialEdges, agentScreenPositions)
    }
    if (activeLayers.has('info_flow')) {
      this.renderInfoFlow(agentScreenPositions)
    }
    if (activeLayers.has('grief_topology')) {
      this.renderGriefTopology(agents, agentScreenPositions)
    }
    if (activeLayers.has('runway_countdown')) {
      this.renderRunwayCountdown(agents, tick)
    }
    if (activeLayers.has('stress_topology')) {
      if (this.cachedStress) {
        this.container.addChild(this.cachedStress)
      } else {
        this.renderStressTopology(agents, tick)
      }
    }
    if (activeLayers.has('transaction_flow')) {
      this.renderTransactionFlow(tick, transactions, txByTick, agentScreenPositions)
    }
  }

  /**
   * Update animated particles (called from ticker).
   */
  tickAnimations(): void {
    const now = Date.now()
    // Info flow particles are rendered statically per frame (no persistent animation yet)
    // Transaction flow arcs are rendered statically per frame
  }

  // Ticks with CAPABILITY_FACT / scenario events (RoboRide milestones)
  private static readonly CAPABILITY_TICKS = new Set([1, 3, 8, 14])

  /**
   * Seed info flow particles on tick advance.
   * Only fires at CAPABILITY_FACT event ticks (1, 3, 8, 14).
   */
  seedInfoFlowParticles(
    tick: number,
    agents: Record<string, Agent>,
    agentScreenPositions: Map<string, { x: number; y: number }>,
  ): void {
    // Only seed particles at ticks with capability events
    if (!LayerRenderer.CAPABILITY_TICKS.has(tick)) {
      this.infoFlowParticles = []
      return
    }

    this.infoFlowParticles = []
    const now = Date.now()

    // For each agent, create particles going TO them from random sources
    // (simulating info propagation — tier 1 gets more/cleaner info)
    const agentIds = Object.keys(agents)
    for (const [agentId, agent] of Object.entries(agents)) {
      const targetPos = agentScreenPositions.get(agentId)
      if (!targetPos) continue

      // Pick a random source agent for the particle
      const srcIdx = Math.floor(Math.random() * agentIds.length)
      const srcId = agentIds[srcIdx]
      if (srcId === agentId) continue
      const srcPos = agentScreenPositions.get(srcId)
      if (!srcPos) continue

      // Tier determines message quality
      const msgType = agent.tier <= 2 ? 'CAPABILITY_FACT' : 'WORD_OF_MOUTH'
      const speed = agent.tier <= 2 ? 1.5 : 0.8

      this.infoFlowParticles.push({
        sx: srcPos.x, sy: srcPos.y,
        tx: targetPos.x, ty: targetPos.y,
        color: INFO_PARTICLE_COLOR[msgType] ?? 0xffffff,
        startTime: now + Math.random() * 2000,
        speed,
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 1: ECONOMIC HEATMAP
  // ═══════════════════════════════════════════════════════════════════

  private renderEconomicHeatmap(
    buildings: Building[],
    buildingStates: Record<string, BuildingTickState> | undefined,
  ): void {
    if (!buildingStates) return

    const wrapper = new Container()

    // Compute avg health per zone
    for (const zone of ZONES) {
      const zoneBuildings = buildings.filter(b => {
        const [col, row] = b.tile
        return col >= zone.cols[0] && col <= zone.cols[1] &&
               row >= zone.rows[0] && row <= zone.rows[1]
      })

      let totalHealth = 0
      let count = 0
      for (const b of zoneBuildings) {
        const state = buildingStates[b.id]
        if (state && state.visible) {
          totalHealth += state.health
          count++
        }
      }

      const avgHealth = count > 0 ? totalHealth / count : 100
      const color = this.healthToColor(avgHealth)

      const g = new Graphics()
      // Draw semi-transparent polygon over zone tiles
      for (let col = zone.cols[0]; col <= zone.cols[1]; col++) {
        for (let row = zone.rows[0]; row <= zone.rows[1]; row++) {
          const { x, y } = isoToScreen(col, row)
          g.poly([x, y, x + TILE_W / 2, y + TILE_H / 2, x, y + TILE_H, x - TILE_W / 2, y + TILE_H / 2])
          g.fill({ color, alpha: 0.25 })
        }
      }

      // Zone label
      const cx = (zone.cols[0] + zone.cols[1]) / 2
      const cy = (zone.rows[0] + zone.rows[1]) / 2
      const labelPos = isoToScreen(cx, cy)
      const label = new Text({
        text: `${zone.id.replace(/_/g, ' ')} ${Math.round(avgHealth)}%`,
        style: { fontSize: 9, fill: 0xe2e8f0, fontFamily: 'monospace' },
      })
      label.x = labelPos.x - label.width / 2
      label.y = labelPos.y + TILE_H / 2

      const labelContainer = new Container()
      labelContainer.addChild(g)
      labelContainer.addChild(label)
      wrapper.addChild(labelContainer)
    }

    this.cachedHeatmap = wrapper
    this.container.addChild(wrapper)
  }

  private healthToColor(health: number): number {
    if (health >= 70) return 0x48bb78  // green
    if (health >= 50) return 0xfbbf24  // amber
    return 0xe53e3e                     // red
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 2: SOCIAL NETWORK GRAPH
  // ═══════════════════════════════════════════════════════════════════

  private renderSocialGraph(
    socialEdges: SocialEdge[] | null,
    agentScreenPositions: Map<string, { x: number; y: number }>,
  ): void {
    if (!socialEdges) return

    const g = new Graphics()

    for (const edge of socialEdges) {
      const srcPos = agentScreenPositions.get(edge.source)
      const tgtPos = agentScreenPositions.get(edge.target)
      if (!srcPos || !tgtPos) continue

      const color = EDGE_TYPE_COLOR[edge.type] ?? 0x718096
      let alpha: number
      let width: number

      if (edge.trust >= 0.6) {
        alpha = 0.8
        width = 2
      } else if (edge.trust >= 0.4) {
        alpha = 0.5
        width = 1.5
      } else {
        alpha = 0.3
        width = 1
      }

      g.moveTo(srcPos.x, srcPos.y)
      g.lineTo(tgtPos.x, tgtPos.y)
      g.stroke({ color, width, alpha })
    }

    this.container.addChild(g)

    // Draw power arrows (directional)
    this.renderPowerArrows(socialEdges, agentScreenPositions)
  }

  private renderPowerArrows(
    edges: SocialEdge[],
    positions: Map<string, { x: number; y: number }>,
  ): void {
    // Power relationships: find edges where one node has power_over the other
    // We don't have power_over in edges, but we can identify high-trust professional links
    // as power indicators. Draw arrow heads for high-trust professional edges.
    const g = new Graphics()

    for (const edge of edges) {
      if (edge.trust < 0.6) continue

      const srcPos = positions.get(edge.source)
      const tgtPos = positions.get(edge.target)
      if (!srcPos || !tgtPos) continue

      // Arrow head at target
      const dx = tgtPos.x - srcPos.x
      const dy = tgtPos.y - srcPos.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 10) continue

      const nx = dx / dist
      const ny = dy / dist

      // Arrow tip near target
      const tipX = tgtPos.x - nx * 12
      const tipY = tgtPos.y - ny * 12
      const leftX = tipX - nx * 6 + ny * 4
      const leftY = tipY - ny * 6 - nx * 4
      const rightX = tipX - nx * 6 - ny * 4
      const rightY = tipY - ny * 6 + nx * 4

      const arrowColor = EDGE_TYPE_COLOR[edge.type] ?? 0x4299e1
      g.poly([tipX, tipY, leftX, leftY, rightX, rightY])
      g.fill({ color: arrowColor, alpha: 0.7 })
    }

    this.container.addChild(g)
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 3: INFORMATION FLOW
  // ═══════════════════════════════════════════════════════════════════

  private renderInfoFlow(
    agentScreenPositions: Map<string, { x: number; y: number }>,
  ): void {
    const now = Date.now()
    const g = new Graphics()

    for (const p of this.infoFlowParticles) {
      const elapsed = (now - p.startTime) / 1000
      if (elapsed < 0) continue // not started yet
      const duration = 2.0 / p.speed
      const t = Math.min(1, elapsed / duration)

      if (t >= 1) continue // done

      // Arc path
      const mx = (p.sx + p.tx) / 2
      const my = (p.sy + p.ty) / 2 - 30 // arc upward

      // Quadratic bezier at t
      const x = (1 - t) * (1 - t) * p.sx + 2 * (1 - t) * t * mx + t * t * p.tx
      const y = (1 - t) * (1 - t) * p.sy + 2 * (1 - t) * t * my + t * t * p.ty

      const alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1

      g.circle(x, y, 2.5)
      g.fill({ color: p.color, alpha: alpha * 0.8 })
    }

    this.container.addChild(g)
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 4: GRIEF TOPOLOGY
  // ═══════════════════════════════════════════════════════════════════

  private renderGriefTopology(
    agents: Record<string, Agent>,
    agentScreenPositions: Map<string, { x: number; y: number }>,
  ): void {
    const g = new Graphics()

    for (const [agentId, agent] of Object.entries(agents)) {
      const pos = agentScreenPositions.get(agentId)
      if (!pos) continue

      const color = GRIEF_LAYER_COLORS[agent.grief_stage] ?? 0xaaaaaa

      // Colored ring around agent
      g.circle(pos.x, pos.y + 12, 12)
      g.stroke({ color, width: 3, alpha: 0.8 })

      // Small filled indicator
      g.circle(pos.x, pos.y + 12, 4)
      g.fill({ color, alpha: 0.6 })
    }

    this.container.addChild(g)
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 5: RUNWAY COUNTDOWN
  // ═══════════════════════════════════════════════════════════════════

  private renderRunwayCountdown(
    agents: Record<string, Agent>,
    tick: number,
  ): void {
    const now = Date.now()
    const g = new Graphics()

    for (const [agentId, agent] of Object.entries(agents)) {
      const homeTile = HOME_TILES[agentId]
      if (!homeTile) continue

      const { x, y } = isoToScreen(homeTile[0], homeTile[1])
      const cx = x
      const cy = y + TILE_H / 2

      const ringColor = getRunwayRingColor(agent.runway_months)
      if (ringColor == null) continue

      // Ring width proportional to runway (max 12 months = full ring)
      const fraction = Math.min(1, agent.runway_months / 12)
      const maxRadius = 16
      const ringWidth = 2 + fraction * 3

      // Draw arc representing remaining runway
      const startAngle = -Math.PI / 2
      const endAngle = startAngle + fraction * Math.PI * 2

      g.arc(cx, cy, maxRadius, startAngle, endAngle)
      g.stroke({ color: ringColor, width: ringWidth, alpha: 0.8 })

      // Pulsing effect for critical (< 1 month)
      if (agent.runway_months < 1) {
        const pulse = 0.7 + Math.sin(now * 0.005) * 0.3
        g.circle(cx, cy, maxRadius + 2)
        g.stroke({ color: 0xef4444, width: 1.5, alpha: pulse })
      }

      // Small text showing months
      const label = new Text({
        text: agent.runway_months < 1 ? '0' : `${Math.round(agent.runway_months)}`,
        style: { fontSize: 8, fill: ringColor, fontFamily: 'monospace', fontWeight: 'bold' },
      })
      label.x = cx - label.width / 2
      label.y = cy - 3

      const c = new Container()
      c.addChild(label)
      this.container.addChild(c)
    }

    this.container.addChild(g)
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 6: STRESS TOPOLOGY
  // ═══════════════════════════════════════════════════════════════════

  private renderStressTopology(
    agents: Record<string, Agent>,
    tick: number,
  ): void {
    const wrapper = new Container()
    const g = new Graphics()

    for (const [agentId, agent] of Object.entries(agents)) {
      const homeTile = HOME_TILES[agentId]
      if (!homeTile) continue

      const snap = agent.history[String(tick)]
      const stress = snap?.stress ?? agent.stress ?? 0

      if (stress < 0.05) continue // skip very low stress

      const { x, y } = isoToScreen(homeTile[0], homeTile[1])
      const cx = x
      const cy = y + TILE_H / 2

      const color = this.stressToColor(stress)
      const radius = 12 + stress * 20 // bigger radius for higher stress

      // Radial gradient effect (concentric circles with decreasing alpha)
      for (let r = radius; r > 4; r -= 4) {
        const alpha = (stress * 0.4) * (r / radius)
        g.circle(cx, cy, r)
        g.fill({ color, alpha: alpha * 0.3 })
      }

      // Center dot
      g.circle(cx, cy, 3)
      g.fill({ color, alpha: stress * 0.8 })
    }

    wrapper.addChild(g)
    this.cachedStress = wrapper
    this.container.addChild(wrapper)
  }

  private stressToColor(stress: number): number {
    // blue(0) → yellow(0.5) → red(1.0)
    if (stress <= 0.5) {
      // blue to yellow
      const t = stress / 0.5
      return this.lerpColorRgb(0x4299e1, 0xfbbf24, t)
    }
    // yellow to red
    const t = (stress - 0.5) / 0.5
    return this.lerpColorRgb(0xfbbf24, 0xe53e3e, t)
  }

  private lerpColorRgb(a: number, b: number, t: number): number {
    const r1 = (a >> 16) & 0xff, g1 = (a >> 8) & 0xff, b1 = a & 0xff
    const r2 = (b >> 16) & 0xff, g2 = (b >> 8) & 0xff, b2 = b & 0xff
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const bl = Math.round(b1 + (b2 - b1) * t)
    return (r << 16) | (g << 8) | bl
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYER 7: TRANSACTION FLOW
  // ═══════════════════════════════════════════════════════════════════

  private renderTransactionFlow(
    tick: number,
    transactions: Transaction[] | null,
    txByTick: Record<string, string[]> | null,
    agentScreenPositions: Map<string, { x: number; y: number }>,
  ): void {
    if (!transactions || !txByTick) return

    const tickIds = txByTick[String(tick)]
    if (!tickIds) return

    // Build id → transaction lookup
    const txMap = new Map<string, Transaction>()
    for (const tx of transactions) txMap.set(tx.id, tx)

    const now = Date.now()
    const g = new Graphics()

    for (const txId of tickIds) {
      const tx = txMap.get(txId)
      if (!tx) continue

      const srcPos = agentScreenPositions.get(tx.initiator)
      const tgtPos = agentScreenPositions.get(tx.target)

      if (!srcPos && !tgtPos) continue

      if (srcPos && tgtPos) {
        // Bilateral: draw arc between
        const color = tx.category === 'formal' ? 0xfbbf24 :
                      tx.category === 'informal' ? 0x9f7aea :
                      tx.category === 'institutional' ? 0x4299e1 : 0x718096

        // Animated arc progress
        const progress = ((now % 2000) / 2000)

        // Draw arc
        const mx = (srcPos.x + tgtPos.x) / 2
        const my = (srcPos.y + tgtPos.y) / 2 - 20

        // Full arc path
        const steps = 20
        for (let i = 0; i < steps; i++) {
          const t = i / steps
          const x1 = (1 - t) * (1 - t) * srcPos.x + 2 * (1 - t) * t * mx + t * t * tgtPos.x
          const y1 = (1 - t) * (1 - t) * srcPos.y + 2 * (1 - t) * t * my + t * t * tgtPos.y
          const t2 = (i + 1) / steps
          const x2 = (1 - t2) * (1 - t2) * srcPos.x + 2 * (1 - t2) * t2 * mx + t2 * t2 * tgtPos.x
          const y2 = (1 - t2) * (1 - t2) * srcPos.y + 2 * (1 - t2) * t2 * my + t2 * t2 * tgtPos.y

          // Animated segment alpha based on distance from "leading edge"
          const dist = Math.abs(t - progress)
          const segAlpha = Math.max(0.15, 1 - dist * 3)

          g.moveTo(x1, y1)
          g.lineTo(x2, y2)
          g.stroke({ color, width: tx.is_bilateral ? 2 : 1.5, alpha: segAlpha * 0.7 })
        }

        // Particle at leading edge
        const px = (1 - progress) * (1 - progress) * srcPos.x + 2 * (1 - progress) * progress * mx + progress * progress * tgtPos.x
        const py = (1 - progress) * (1 - progress) * srcPos.y + 2 * (1 - progress) * progress * my + progress * progress * tgtPos.y
        g.circle(px, py, 3)
        g.fill({ color, alpha: 0.9 })

      } else if (srcPos || tgtPos) {
        // Unilateral / no counterparty: glow on the agent who has a position
        const pos = srcPos ?? tgtPos!
        g.circle(pos.x, pos.y, 14)
        g.stroke({ color: 0x9f7aea, width: 2, alpha: 0.5 })
      }
    }

    this.container.addChild(g)
  }
}
