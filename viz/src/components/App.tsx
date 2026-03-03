/**
 * App.tsx — Root component.
 * Loads data, renders layout: canvas left, panels right.
 */

import { useEffect } from 'react'
import { useSimStore } from '../store/simStore'
import WorldCanvas    from './WorldCanvas'
import ScrubBar       from './ScrubBar'
import EconomicDash   from './EconomicDash'
import AgentCard      from './AgentCard'
import BuildingCard   from './BuildingCard'
import LayerControls  from './LayerControls'
import { usePlayback } from '../hooks/usePlayback'

export default function App() {
  const { isLoaded, loadError, loadData } = useSimStore()

  useEffect(() => { loadData() }, [])
  usePlayback()

  if (loadError)  return <div className="error">Failed to load: {loadError}</div>
  if (!isLoaded)  return <div className="loading">Loading Millfield...</div>

  return (
    <div className="app-root">
      {/* Top: economic dashboard strip */}
      <EconomicDash />

      <div className="main-layout">
        {/* Center: isometric world canvas */}
        <div className="canvas-area">
          <WorldCanvas />
          <LayerControls />
        </div>

        {/* Right: drill-down panels */}
        <div className="panel-area">
          <AgentCard />
          <BuildingCard />
        </div>
      </div>

      {/* Bottom: scrub bar */}
      <ScrubBar />
    </div>
  )
}
