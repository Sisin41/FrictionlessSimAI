/**
 * ScrubBar.tsx
 * Timeline scrub control with phenomena markers and scenario event pins.
 *
 * DATA READS:
 *   currentTick, maxTick, isPlaying, playSpeed
 *   phenomena, scenarioEvents, timeseries
 *
 * EMITS:
 *   setTick, stepTick, setPlaying, setSpeed
 */

import { useSimStore } from '../store/simStore'

const SPEEDS = [0.5, 1, 2, 5, 10] as const

export default function ScrubBar() {
  const {
    currentTick, maxTick, isPlaying, playSpeed,
    phenomena, scenarioEvents, timeseries,
    setTick, stepTick, setPlaying, setSpeed,
  } = useSimStore()

  const allMarkers = [
    ...(scenarioEvents ?? []),
    ...(phenomena ?? []).filter(p => p.severity >= 2),
  ]

  return (
    <div className="scrub-bar">
      {/* Controls row */}
      <div className="scrub-controls">
        <button onClick={() => stepTick(-5)}>◄◄</button>
        <button onClick={() => stepTick(-1)}>◄</button>
        <button onClick={() => setPlaying(!isPlaying)}>
          {isPlaying ? '▐▐' : '►'}
        </button>
        <button onClick={() => stepTick(1)}>►</button>
        <button onClick={() => stepTick(5)}>►►</button>

        <span className="tick-counter">
          Tick: <strong>{currentTick}</strong> / {maxTick}
        </span>

        <select value={playSpeed} onChange={e => setSpeed(Number(e.target.value) as any)}>
          {SPEEDS.map(s => <option key={s} value={s}>{s}x</option>)}
        </select>
      </div>

      {/* Scrub track */}
      <div className="scrub-track-wrapper">
        <input
          type="range"
          min={0}
          max={maxTick}
          value={currentTick}
          onChange={e => setTick(Number(e.target.value))}
          className="scrub-track"
        />

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
                  {m.marker_shape === 'triangle_down' ? '▼' :
                   m.marker_shape === 'star'          ? '★' :
                   m.marker_shape === 'pin'           ? '📍' :
                   m.marker_shape === 'diamond'       ? '◆' : '●'}
                </span>
                <span className="marker-label">{m.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current tick macro stats */}
      {timeseries && (() => {
        const t = timeseries[String(currentTick)]
        if (!t) return null
        return (
          <div className="tick-stats">
            {t.interpolated && <span className="interp-badge">interpolated</span>}
            <span>Employed: <strong>{t.employment_rate != null ? `${(t.employment_rate*100).toFixed(0)}%` : '—'}</strong></span>
            <span>Spending: <strong>{t.spending_index != null ? `${t.spending_index}%` : '—'}</strong></span>
            <span>Cars: <strong>{t.car_ownership_rate != null ? `${(t.car_ownership_rate*100).toFixed(0)}%` : '—'}</strong></span>
            <span>Gini: <strong>{t.gini != null ? t.gini.toFixed(3) : '—'}</strong></span>
            <span>Protests: <strong>{t.protests}</strong></span>
            <span>Retraining: <strong>{t.retraining_enrollments}</strong></span>
          </div>
        )
      })()}
    </div>
  )
}
