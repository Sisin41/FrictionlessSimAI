/**
 * WorldCanvas.tsx
 * PixiJS isometric renderer — wired to WorldRenderer.
 * Phase 4: passes active layer set and data for all 7 info layers.
 *
 * DATA READS:
 *   agents, buildings, buildingTicks, currentTick, interpolation,
 *   selectedAgentId, followAgentId, timeseries, activeLayers,
 *   socialEdges, transactions, txByTick
 *
 * EMITS:
 *   selectAgent(id), selectBuilding(id), setHoveredAgent(id)
 */

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useSimStore } from '../store/simStore'
import { WorldRenderer } from '../pixi/WorldRenderer'
import SpeechBubble from './SpeechBubble'
import ReflectionCaption from './ReflectionCaption'

export interface WorldCanvasHandle {
  getRenderer(): WorldRenderer | null
}

const WorldCanvas = forwardRef<WorldCanvasHandle>(function WorldCanvas(_props, ref) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<WorldRenderer | null>(null)

  useImperativeHandle(ref, () => ({
    getRenderer: () => rendererRef.current,
  }))
  const prevTickRef = useRef(0)

  const agents = useSimStore(s => s.agents)
  const buildings = useSimStore(s => s.buildings)
  const buildingTicks = useSimStore(s => s.buildingTicks)
  const currentTick = useSimStore(s => s.currentTick)
  const interpolation = useSimStore(s => s.interpolation)
  const timeseries = useSimStore(s => s.timeseries)
  const selectAgent = useSimStore(s => s.selectAgent)
  const selectBuilding = useSimStore(s => s.selectBuilding)
  const setHoveredAgent = useSimStore(s => s.setHoveredAgent)
  const selectedAgentId = useSimStore(s => s.selectedAgentId)
  const followAgentId = useSimStore(s => s.followAgentId)
  const activeLayers = useSimStore(s => s.activeLayers)
  const socialEdges = useSimStore(s => s.socialEdges)
  const transactions = useSimStore(s => s.transactions)
  const txByTick = useSimStore(s => s.txByTick)

  // Initialize renderer on mount
  useEffect(() => {
    if (!canvasRef.current || !agents) return

    const renderer = new WorldRenderer()
    renderer.onAgentClick = (id) => selectAgent(id)
    renderer.onBuildingClick = (id) => selectBuilding(id)
    renderer.onAgentHover = (id) => setHoveredAgent(id)
    rendererRef.current = renderer

    renderer.init(canvasRef.current).then(() => {
      console.log('[WorldCanvas] Renderer initialized, agents:', Object.keys(agents ?? {}).length)
      if (agents && buildings && buildingTicks) {
        const robotaxiRate = timeseries?.[String(currentTick)]?.robotaxi_rate ?? 0
        renderer.renderSmooth(
          currentTick, 0, agents,
          buildingTicks[String(currentTick)],
          buildingTicks[String(Math.min(currentTick + 1, 14))],
          buildings,
          robotaxiRate,
        )
      }
    }).catch(err => console.error('[WorldCanvas] Init failed:', err))

    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents])

  // Re-render on tick change, interpolation change, selection, follow, or layer change
  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer || !agents || !buildings || !buildingTicks) return

    // Detect tick transitions for scenario event animations
    const prev = prevTickRef.current
    if (prev !== currentTick) {
      renderer.onTickAdvance(prev, currentTick)
      prevTickRef.current = currentTick
    }

    renderer.highlightAgent(selectedAgentId)
    renderer.setFollowAgent(followAgentId)

    const robotaxiRate = timeseries?.[String(currentTick)]?.robotaxi_rate ?? 0
    renderer.renderSmooth(
      currentTick,
      interpolation,
      agents,
      buildingTicks[String(currentTick)],
      buildingTicks[String(Math.min(currentTick + 1, 14))],
      buildings,
      robotaxiRate,
      activeLayers,
      socialEdges,
      transactions,
      txByTick,
    )
  }, [currentTick, interpolation, agents, buildings, buildingTicks, selectedAgentId, followAgentId, timeseries, activeLayers, socialEdges, transactions, txByTick])

  return (
    <div ref={canvasRef} className="world-canvas">
      <SpeechBubble rendererRef={rendererRef} />
      <ReflectionCaption />
    </div>
  )
})

export default WorldCanvas
