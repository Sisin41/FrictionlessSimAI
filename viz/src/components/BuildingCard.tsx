/**
 * BuildingCard.tsx
 * Drill-down panel for a selected building.
 *
 * DATA READS:
 *   buildings[selectedBuildingId]
 *   buildingTicks[currentTick][selectedBuildingId]
 *   agents (for occupant details)
 *   transactions (filtered to this building's agents)
 */

import { useSimStore, getBuildingAtTick } from '../store/simStore'

export default function BuildingCard() {
  const {
    selectedBuildingId, buildings, buildingTicks,
    agents, currentTick, transactions, selectBuilding,
  } = useSimStore()

  if (!selectedBuildingId || !buildings || !buildingTicks) return null

  const building = buildings.find(b => b.id === selectedBuildingId)
  if (!building) return null

  const tickState = getBuildingAtTick(buildingTicks, selectedBuildingId, currentTick)

  const occupantAgents = building.occupants
    .map(id => agents?.[id])
    .filter(Boolean)

  const relevantTxns = (transactions ?? [])
    .filter(tx => tx.tick === currentTick &&
      (building.occupants.includes(tx.initiator) || building.occupants.includes(tx.target)))
    .slice(0, 5)

  // Health timeline for sparkline (all ticks)
  const healthHistory = Object.entries(buildingTicks)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([tick, tdata]) => tdata[selectedBuildingId]?.health ?? 0)

  const healthColor =
    (tickState?.health ?? 0) >= 70 ? '#48bb78' :
    (tickState?.health ?? 0) >= 40 ? '#f97316' : '#e53e3e'

  return (
    <div className="building-card panel">
      <button className="close-btn" onClick={() => selectBuilding(null)}>✕</button>

      <div className="building-header">
        <h2>{building.label}</h2>
        <div className="building-meta">
          <span className="sector-badge">{building.sector}</span>
          {tickState && (
            <span className="health-badge" style={{ color: healthColor }}>
              {tickState.visual_state} ({tickState.health.toFixed(0)}%)
            </span>
          )}
        </div>
      </div>

      {/* Health sparkline (D3 or simple div bars) */}
      <section>
        <h3>Health Over Time</h3>
        <div className="sparkline">
          {healthHistory.map((h, i) => (
            <div
              key={i}
              className="spark-bar"
              style={{
                height: `${h}%`,
                background: i === currentTick ? '#fbbf24' : (h >= 70 ? '#48bb78' : h >= 40 ? '#f97316' : '#e53e3e'),
                opacity: i === currentTick ? 1 : 0.6,
              }}
              title={`Tick ${i}: ${h.toFixed(0)}%`}
            />
          ))}
        </div>
      </section>

      {/* Occupants */}
      {occupantAgents.length > 0 && (
        <section>
          <h3>People ({occupantAgents.length})</h3>
          {occupantAgents.map(agent => {
            if (!agent) return null
            const snap = agent.history[String(currentTick)]
            return (
              <div key={agent.id} className="occupant-row">
                <span className="occupant-name">{agent.name}</span>
                <span className={`emp-status ${snap?.employment_status}`}>
                  {snap?.employment_status ?? '—'}
                </span>
                {agent.grief_stage !== 'none' && (
                  <span className="grief-mini">{agent.grief_stage}</span>
                )}
              </div>
            )
          })}
        </section>
      )}

      {/* Recent transactions */}
      {relevantTxns.length > 0 && (
        <section>
          <h3>Transactions (Tick {currentTick})</h3>
          {relevantTxns.map(tx => (
            <div key={tx.id} className="tx-row">
              <span className="tx-names">{tx.initiator_name} → {tx.target_name}</span>
              <span className={`tx-type ${tx.category}`}>{tx.type}</span>
            </div>
          ))}
        </section>
      )}

      <div className="card-actions">
        <button disabled title="Coming soon" style={{ opacity: 0.4, cursor: 'default' }}>All Transactions</button>
        <button disabled title="Coming soon" style={{ opacity: 0.4, cursor: 'default' }}>Sector View</button>
      </div>
    </div>
  )
}
