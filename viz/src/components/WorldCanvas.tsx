/**
 * WorldCanvas.tsx
 * PixiJS isometric renderer — wired to WorldRenderer.
 *
 * DATA READS:
 *   agents, buildings, buildingTicks, currentTick, selectedAgentId
 *
 * EMITS:
 *   selectAgent(id), selectBuilding(id)
 */

import { useEffect, useRef } from 'react'
import { useSimStore } from '../store/simStore'
import { WorldRenderer } from '../pixi/WorldRenderer'

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<WorldRenderer | null>(null)

  const agents = useSimStore(s => s.agents)
  const buildings = useSimStore(s => s.buildings)
  const buildingTicks = useSimStore(s => s.buildingTicks)
  const currentTick = useSimStore(s => s.currentTick)
  const selectAgent = useSimStore(s => s.selectAgent)
  const selectBuilding = useSimStore(s => s.selectBuilding)
  const selectedAgentId = useSimStore(s => s.selectedAgentId)

  // Initialize renderer on mount
  useEffect(() => {
    if (!canvasRef.current || !agents) return

    const renderer = new WorldRenderer()
    renderer.onAgentClick = (id) => selectAgent(id)
    renderer.onBuildingClick = (id) => selectBuilding(id)
    rendererRef.current = renderer

    renderer.init(canvasRef.current).then(() => {
      if (agents && buildings && buildingTicks) {
        renderer.render(currentTick, agents, buildingTicks[String(currentTick)], buildings)
      }
    })

    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents])

  // Re-render on tick change or selection change
  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer || !agents || !buildings || !buildingTicks) return
    renderer.highlightAgent(selectedAgentId)
    renderer.render(currentTick, agents, buildingTicks[String(currentTick)], buildings)
  }, [currentTick, agents, buildings, buildingTicks, selectedAgentId])

  return <div ref={canvasRef} className="world-canvas" />
}
