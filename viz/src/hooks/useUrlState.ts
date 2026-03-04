/**
 * useUrlState.ts
 * Syncs store state ↔ URL hash.
 * Format: #tick=9&agent=rick_tanner&layers=social_graph,grief_topology
 * On load: restores state from hash.
 * On change: updates hash (debounced).
 */

import { useEffect, useRef } from 'react'
import { useSimStore, type LayerId } from '../store/simStore'

const VALID_LAYERS: Set<string> = new Set([
  'economic_heatmap', 'social_graph', 'info_flow', 'grief_topology',
  'runway_countdown', 'stress_topology', 'transaction_flow',
])

/** Parse URL hash into state values. */
function parseHash(): { tick?: number; agent?: string; layers?: LayerId[] } {
  const hash = window.location.hash.slice(1)
  if (!hash) return {}

  const params = new URLSearchParams(hash)
  const result: { tick?: number; agent?: string; layers?: LayerId[] } = {}

  const tickStr = params.get('tick')
  if (tickStr != null) {
    const t = parseInt(tickStr, 10)
    const maxTick = useSimStore.getState().maxTick
    if (!isNaN(t) && t >= 0 && t <= maxTick) result.tick = t
  }

  const agent = params.get('agent')
  if (agent) result.agent = agent

  const layersStr = params.get('layers')
  if (layersStr) {
    result.layers = layersStr.split(',').filter(l => VALID_LAYERS.has(l)) as LayerId[]
  }

  return result
}

/** Build hash string from current state. */
function buildHash(tick: number, agentId: string | null, layers: Set<LayerId>): string {
  const parts: string[] = []
  parts.push(`tick=${tick}`)
  if (agentId) parts.push(`agent=${agentId}`)
  if (layers.size > 0) parts.push(`layers=${[...layers].join(',')}`)
  return parts.join('&')
}

export function useUrlState() {
  const currentTick = useSimStore(s => s.currentTick)
  const selectedAgentId = useSimStore(s => s.selectedAgentId)
  const activeLayers = useSimStore(s => s.activeLayers)
  const isLoaded = useSimStore(s => s.isLoaded)
  const setTick = useSimStore(s => s.setTick)
  const selectAgent = useSimStore(s => s.selectAgent)
  const agents = useSimStore(s => s.agents)

  const restoredRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore from URL on first load
  useEffect(() => {
    if (!isLoaded || restoredRef.current) return
    restoredRef.current = true

    const parsed = parseHash()
    if (parsed.tick != null) setTick(parsed.tick)
    if (parsed.agent && agents && agents[parsed.agent]) selectAgent(parsed.agent)
    if (parsed.layers && parsed.layers.length > 0) {
      const store = useSimStore.getState()
      const newLayers = new Set<LayerId>(parsed.layers)
      // Only set if different from current
      if (newLayers.size > 0) {
        // Toggle on each requested layer
        for (const layer of parsed.layers) {
          if (!store.activeLayers.has(layer)) store.toggleLayer(layer)
        }
      }
    }
  }, [isLoaded, agents, setTick, selectAgent])

  // Update URL hash on state change (debounced 300ms)
  useEffect(() => {
    if (!isLoaded || !restoredRef.current) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const hash = buildHash(currentTick, selectedAgentId, activeLayers)
      window.history.replaceState(null, '', '#' + hash)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [currentTick, selectedAgentId, activeLayers, isLoaded])

  // Listen for popstate (back/forward navigation)
  useEffect(() => {
    function onPopState() {
      const parsed = parseHash()
      if (parsed.tick != null) useSimStore.getState().setTick(parsed.tick)
      if (parsed.agent) useSimStore.getState().selectAgent(parsed.agent)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
}
