/**
 * ScrubBar.tsx
 * Timeline scrub control with phenomena markers, scenario event pins,
 * and outcome narrative tooltip on hover (Phase 3).
 *
 * DATA READS:
 *   currentTick, maxTick, isPlaying, playSpeed
 *   phenomena, scenarioEvents, timeseries
 *   selectedAgentId, agents
 *
 * EMITS:
 *   setTick, stepTick, setPlaying, setSpeed
 */

import { useState, useCallback, useRef } from 'react'
import { useSimStore, getAgentAtTick } from '../store/simStore'

const SPEEDS = [0.1, 0.25, 0.5, 1, 2, 5] as const

export default function ScrubBar() {
  const {
    currentTick, maxTick, isPlaying, playSpeed,
    phenomena, scenarioEvents,
    selectedAgentId, agents,
    setTick, stepTick, setPlaying, setSpeed,
  } = useSimStore()

  const [hoverTick, setHoverTick] = useState<number | null>(null)
  const [tooltipX, setTooltipX] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleTrackHover = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const tick = Math.round(pct * maxTick)
    setHoverTick(tick)
    setTooltipX(e.clientX - rect.left)
  }, [maxTick])

  const handleTrackLeave = useCallback(() => {
    setHoverTick(null)
  }, [])

  // Get outcome narrative for hovered tick + selected agent
  let narrativeTooltip: string | null = null
  if (hoverTick !== null && selectedAgentId && agents) {
    const agent = agents[selectedAgentId]
    if (agent) {
      const snap = getAgentAtTick(agent, hoverTick)
      if (snap.outcome_narrative) {
        narrativeTooltip = snap.outcome_narrative
      }
    }
  }

  const allMarkers = [
    ...(scenarioEvents ?? []),
    ...(phenomena ?? []).filter(p => p.severity >= 2),
  ]

  return (
    <div className="scrub-bar">
      {/* Controls row */}
      <div className="scrub-controls">
        <button onClick={() => stepTick(-5)}>&#9668;&#9668;</button>
        <button onClick={() => stepTick(-1)}>&#9668;</button>
        <button onClick={() => setPlaying(!isPlaying)}>
          {isPlaying ? '\u2590\u2590' : '\u25B6'}
        </button>
        <button onClick={() => stepTick(1)}>&#9658;</button>
        <button onClick={() => stepTick(5)}>&#9658;&#9658;</button>

        <span className="tick-counter">
          Tick: <strong>{currentTick}</strong> / {maxTick}
        </span>

        <select value={playSpeed} onChange={e => setSpeed(Number(e.target.value) as any)}>
          {SPEEDS.map(s => <option key={s} value={s}>{s}x</option>)}
        </select>
      </div>

      {/* Scrub track */}
      <div
        className="scrub-track-wrapper"
        ref={trackRef}
        onMouseMove={handleTrackHover}
        onMouseLeave={handleTrackLeave}
      >
        <input
          type="range"
          min={0}
          max={maxTick}
          value={currentTick}
          onChange={e => setTick(Number(e.target.value))}
          className="scrub-track"
        />

        {/* Outcome narrative tooltip */}
        {narrativeTooltip && hoverTick !== null && (
          <div
            className="scrub-narrative-tooltip"
            style={{ left: tooltipX }}
          >
            <div className="scrub-narrative-tick">Tick {hoverTick}</div>
            <div className="scrub-narrative-text">{narrativeTooltip}</div>
          </div>
        )}

        {/* Phenomena markers */}
        <div className="scrub-markers">
          {allMarkers.map((m, i) => {
            const pct = (m.tick / maxTick) * 100
            return (
              <div
                key={i}
                className="scrub-marker"
                style={{ left: `${pct}%`, borderColor: m.color }}
                title={`${m.label}: ${m.description}`}
                onClick={() => setTick(m.tick)}
              >
                <span className="marker-shape" style={{ color: m.color }}>
                  {m.marker_shape === 'triangle_down' ? '\u25BC' :
                   m.marker_shape === 'star'          ? '\u2605' :
                   m.marker_shape === 'pin'           ? '\uD83D\uDCCD' :
                   m.marker_shape === 'diamond'       ? '\u25C6' : '\u25CF'}
                </span>
                <span className="marker-label">{m.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Macro stats removed — displayed in EconomicDash to avoid duplication */}
    </div>
  )
}
