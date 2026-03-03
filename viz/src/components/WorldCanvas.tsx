/**
 * WorldCanvas.tsx
 * PixiJS isometric renderer.
 * Phase 1: static world + agent positions
 * Phase 2: animations + movement
 *
 * DATA READS:
 *   agents, buildings, buildingTicks, worldLayout, currentTick, interpolation
 *   selectedAgentId, socialEdges (when social_graph layer active)
 *
 * EMITS:
 *   selectAgent(id), selectBuilding(id)
 */

import { useEffect, useRef } from 'react'
import { Application, Container, Graphics, Text } from 'pixi.js'
import { useSimStore } from '../store/simStore'
import { isoToScreen, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y } from '../pixi/iso'

export default function WorldCanvas() {
  const canvasRef  = useRef<HTMLDivElement>(null)
  const appRef     = useRef<Application | null>(null)

  const { agents, buildings, buildingTicks, currentTick, selectAgent, selectBuilding } = useSimStore()

  // Initialize PixiJS on mount
  useEffect(() => {
    if (!canvasRef.current || !agents) return
    const app = new Application()
    app.init({
      width:       1200,
      height:      700,
      background:  0x1a202c,   // dark charcoal
      antialias:   true,
    }).then(() => {
      canvasRef.current!.appendChild(app.canvas)
      appRef.current = app
      renderWorld(app)
    })
    return () => { app.destroy(true) }
  }, [agents])

  // Re-render on tick change (Phase 1: full redraw; Phase 2: update positions)
  useEffect(() => {
    if (!appRef.current || !agents) return
    renderWorld(appRef.current)
  }, [currentTick])

  function renderWorld(app: Application) {
    app.stage.removeChildren()

    // TODO Phase 1:
    //   renderTileGrid(app)
    //   renderBuildings(app, buildings, buildingTicks, currentTick)
    //   renderAgents(app, agents, currentTick)

    // Placeholder: draw tile grid
    const grid = new Graphics()
    for (let col = 0; col < 26; col++) {
      for (let row = 0; row < 20; row++) {
        const { x, y } = isoToScreen(col, row)
        grid.moveTo(x, y)
        grid.lineTo(x + TILE_W/2, y + TILE_H/2)
        grid.lineTo(x, y + TILE_H)
        grid.lineTo(x - TILE_W/2, y + TILE_H/2)
        grid.lineTo(x, y)
        grid.stroke({ color: 0x2d3748, width: 0.5 })
      }
    }
    app.stage.addChild(grid)

    // Placeholder: label buildings
    if (buildings) {
      buildings.forEach(b => {
        const [col, row] = b.tile
        const { x, y } = isoToScreen(col, row)
        const label = new Text({ text: b.label.slice(0, 12), style: { fill: 0xffffff, fontSize: 9 } })
        label.x = x - label.width / 2
        label.y = y
        app.stage.addChild(label)
      })
    }
  }

  return <div ref={canvasRef} className="world-canvas" />
}
