/**
 * App.tsx — Root component.
 * Loads data, renders layout: canvas left, panels right.
 * Phase 5: URL state, keyboard shortcuts, screenshot, comparison shell.
 */

import { useEffect, useRef, useState } from 'react'
import { useSimStore } from '../store/simStore'
import WorldCanvas, { type WorldCanvasHandle } from './WorldCanvas'
import ScrubBar       from './ScrubBar'
import EconomicDash   from './EconomicDash'
import AgentCard      from './AgentCard'
import BuildingCard   from './BuildingCard'
import LayerControls  from './LayerControls'
import ScreenshotButton from './ScreenshotButton'
import ComparisonShell  from './ComparisonShell'
import { usePlayback }  from '../hooks/usePlayback'
import { useUrlState }  from '../hooks/useUrlState'
import { useKeyboard }  from '../hooks/useKeyboard'

export default function App() {
  const { isLoaded, loadError, loadData } = useSimStore()
  const worldCanvasRef = useRef<WorldCanvasHandle>(null)
  const rendererRef = useRef<import('../pixi/WorldRenderer').WorldRenderer | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Check for embed mode
  const isEmbed = new URLSearchParams(window.location.search).has('embed')

  useEffect(() => { loadData() }, [])
  usePlayback()
  useUrlState()
  useKeyboard()

  // Keep rendererRef in sync
  useEffect(() => {
    const interval = setInterval(() => {
      rendererRef.current = worldCanvasRef.current?.getRenderer() ?? null
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (loadError)  return <div className="error">Failed to load: {loadError}</div>
  if (!isLoaded)  return <div className="loading">Loading Millfield...</div>

  if (isEmbed) {
    return (
      <div className="app-root embed-mode">
        <div className="main-layout">
          <div className="canvas-area">
            <WorldCanvas ref={worldCanvasRef} />
          </div>
        </div>
        <ScrubBar />
      </div>
    )
  }

  return (
    <div className="app-root">
      {/* Top: economic dashboard strip */}
      <EconomicDash />

      <div className="main-layout">
        {/* Center: isometric world canvas */}
        <div className="canvas-area">
          <WorldCanvas ref={worldCanvasRef} />
          <LayerControls />

          {/* Phase 5: toolbar */}
          <div className="canvas-toolbar">
            <ScreenshotButton rendererRef={rendererRef} />
            <button
              className="toolbar-btn"
              onClick={() => setShowComparison(!showComparison)}
              title="Compare scenarios"
            >
              Compare
            </button>
            <button
              className="toolbar-btn"
              onClick={() => setShowHelp(!showHelp)}
              title="Keyboard shortcuts"
            >
              ?
            </button>
          </div>

          {/* Keyboard help overlay */}
          {showHelp && (
            <div className="shortcuts-help" onClick={() => setShowHelp(false)}>
              <div className="shortcuts-card" onClick={e => e.stopPropagation()}>
                <h3>Keyboard Shortcuts</h3>
                <div className="shortcut-row"><kbd>Space</kbd><span>Play / Pause</span></div>
                <div className="shortcut-row"><kbd>&larr;</kbd> / <kbd>&rarr;</kbd><span>Step ±1 tick</span></div>
                <div className="shortcut-row"><kbd>Shift + &larr;</kbd> / <kbd>&rarr;</kbd><span>Step ±5 ticks</span></div>
                <div className="shortcut-row"><kbd>1</kbd>–<kbd>7</kbd><span>Toggle layers</span></div>
                <div className="shortcut-row"><kbd>F</kbd><span>Follow selected agent</span></div>
                <div className="shortcut-row"><kbd>Esc</kbd><span>Deselect / close panels</span></div>
                <button className="close-btn" onClick={() => setShowHelp(false)}>&times;</button>
              </div>
            </div>
          )}
        </div>

        {/* Right: drill-down panels */}
        <div className="panel-area">
          <AgentCard />
          <BuildingCard />
        </div>
      </div>

      {/* Comparison shell overlay */}
      {showComparison && (
        <ComparisonShell onClose={() => setShowComparison(false)} />
      )}

      {/* Bottom: scrub bar */}
      <ScrubBar />
    </div>
  )
}
