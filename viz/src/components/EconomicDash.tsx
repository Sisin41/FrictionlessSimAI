/**
 * EconomicDash.tsx
 * Always-visible macro stats strip across the top.
 *
 * DATA READS: timeseries[currentTick]
 * SOURCE:     viz-data/phenomena.json → timeseries
 */

import { useSimStore } from '../store/simStore'

export default function EconomicDash() {
  const { currentTick, timeseries } = useSimStore()
  const t = timeseries?.[String(currentTick)]
  if (!t) return null

  const stats = [
    { label: 'Employed',    value: t.employment_rate    != null ? `${(t.employment_rate*100).toFixed(0)}%` : '—', delta: t.employment_rate != null ? t.employment_rate - 1.0 : 0 },
    { label: 'Spending',    value: t.spending_index     != null ? `${t.spending_index}%` : '—',                 delta: t.spending_index != null ? (t.spending_index - 83) / 83 : 0 },
    { label: 'Cars Owned',  value: t.car_ownership_rate != null ? `${(t.car_ownership_rate*100).toFixed(0)}%` : '—', delta: t.car_ownership_rate != null ? t.car_ownership_rate - 0.93 : 0 },
    { label: 'RoboTaxi',   value: t.robotaxi_rate       != null ? `${(t.robotaxi_rate*100).toFixed(0)}%` : '—',    delta: t.robotaxi_rate ?? 0 },
    { label: 'Gini',        value: t.gini               != null ? t.gini.toFixed(3) : '—',                     delta: t.gini != null ? -(t.gini - 0.254) : 0 },
    { label: 'Protests',    value: String(t.protests ?? 0),                                                      delta: -(t.protests ?? 0) / 10 },
    { label: 'Retraining',  value: String(t.retraining_enrollments ?? 0),                                       delta: (t.retraining_enrollments ?? 0) / 15 },
    { label: 'Mutual Aid',  value: String(t.mutual_aid_events ?? 0),                                            delta: (t.mutual_aid_events ?? 0) / 3 },
  ]

  return (
    <div className="economic-dash">
      <span className="dash-title">MILLFIELD</span>
      <span className="dash-tick">Tick {currentTick}</span>
      {t.interpolated && <span className="interp-note">interpolated</span>}
      {stats.map(s => (
        <div key={s.label} className="dash-stat">
          <span className="dash-label">{s.label}</span>
          <span className="dash-value" style={{ color: getDeltaColor(s.delta) }}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function getDeltaColor(delta: number): string {
  if (delta > 0.05)  return '#48bb78'   // green — good
  if (delta < -0.05) return '#fc8181'   // red — bad
  return '#e2e8f0'                       // neutral
}
