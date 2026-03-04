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
import { useSimStore, type LayerId } from '../store/simStore'
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
  const maxTick = useSimStore(s => s.maxTick)
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

    let cancelled = false
    const renderer = new WorldRenderer()
    renderer.onAgentClick = (id) => selectAgent(id)
    renderer.onBuildingClick = (id) => selectBuilding(id)
    renderer.onAgentHover = (id) => setHoveredAgent(id)
    renderer.setMaxTick(maxTick)
    rendererRef.current = renderer

    renderer.init(canvasRef.current).then(() => {
      if (cancelled) { renderer.destroy(); return }
      if (agents && buildings && buildingTicks) {
        const robotaxiRate = timeseries?.[String(currentTick)]?.robotaxi_rate ?? 0
        renderer.renderSmooth(
          currentTick, 0, agents,
          buildingTicks[String(currentTick)],
          buildingTicks[String(Math.min(currentTick + 1, maxTick))],
          buildings,
          robotaxiRate,
        )
      }
    }).catch(err => { if (!cancelled) console.error('[WorldCanvas] Init failed:', err) })

    return () => {
      cancelled = true
      renderer.destroy()
      rendererRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents])

  // Cache latest render args so the PixiJS ticker can re-render with fresh interpolation
  const renderArgsRef = useRef<{
    tick: number; agents: Record<string, any>; buildings: any[]; buildingTicks: Record<string, any>;
    robotaxiRate: number; activeLayers?: Set<LayerId>; socialEdges?: any; transactions?: any; txByTick?: any;
  } | null>(null)

  // Re-render on tick change, selection, follow, or layer change (NOT interpolation)
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
    // Cache args for the PixiJS ticker to use for interpolation-only updates
    renderArgsRef.current = {
      tick: currentTick, agents, buildings, buildingTicks,
      robotaxiRate, activeLayers, socialEdges, transactions, txByTick,
    }
    renderer.renderSmooth(
      currentTick,
      useSimStore.getState().interpolation,
      agents,
      buildingTicks[String(currentTick)],
      buildingTicks[String(Math.min(currentTick + 1, maxTick))],
      buildings,
      robotaxiRate,
      activeLayers,
      socialEdges,
      transactions,
      txByTick,
    )
  }, [currentTick, agents, buildings, buildingTicks, selectedAgentId, followAgentId, timeseries, activeLayers, socialEdges, transactions, txByTick])

  // Drive interpolation-only re-renders from the PixiJS ticker instead of React useEffect
  useEffect(() => {
    const unsub = useSimStore.subscribe((state, prev) => {
      if (state.interpolation === prev.interpolation) return
      const renderer = rendererRef.current
      const args = renderArgsRef.current
      if (!renderer || !args) return
      renderer.renderSmooth(
        args.tick,
        state.interpolation,
        args.agents,
        args.buildingTicks[String(args.tick)],
        args.buildingTicks[String(Math.min(args.tick + 1, maxTick))],
        args.buildings,
        args.robotaxiRate,
        args.activeLayers,
        args.socialEdges,
        args.transactions,
        args.txByTick,
      )
    })
    return unsub
  }, [maxTick])

  return (
    <div ref={canvasRef} className="world-canvas">
      <SpeechBubble rendererRef={rendererRef} />
      <ReflectionCaption />
    </div>
  )
})

export default WorldCanvas
