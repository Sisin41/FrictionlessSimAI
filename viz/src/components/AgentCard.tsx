/**
 * AgentCard.tsx
 * Full drill-down panel for a selected agent.
 * Every field maps to a specific path in agents.json.
 *
 * DATA READS:
 *   agents[selectedAgentId]
 *   agents[selectedAgentId].history[currentTick]
 *   agents[selectedAgentId].reflections
 *   transactions filtered by selectedAgentId
 */

import { useSimStore, getAgentAtTick } from '../store/simStore'

export default function AgentCard() {
  const { selectedAgentId, agents, currentTick, selectAgent } = useSimStore()

  if (!selectedAgentId || !agents) return null
  const agent = agents[selectedAgentId]
  if (!agent) return null

  const snap = getAgentAtTick(agent, currentTick)
  const latestReflection = agent.reflections[agent.reflections.length - 1]
  const activeTransform = agent.transformations[0]

  // Color for runway bar
  const runwayColor =
    agent.runway_months < 1  ? '#e53e3e' :
    agent.runway_months < 6  ? '#f97316' :
    agent.runway_months < 12 ? '#fbbf24' : '#48bb78'

  const griefEmoji: Record<string, string> = {
    none:             '',
    bargaining:       '🤲',
    anger:            '😡',
    depression:       '😔',
    acceptance:       '🌱',
    acceptance_early: '🌿',
  }

  return (
    <div className="agent-card panel">
      <button className="close-btn" onClick={() => selectAgent(null)}>✕</button>

      {/* Header */}
      <div className="agent-header">
        <div className="agent-sprite-placeholder tier-{agent.tier}" />
        <div>
          <h2>{agent.name}, {agent.age}</h2>
          <p className="agent-role">{agent.role}</p>
          <div className="agent-meta">
            <span className="tier-badge">Tier {agent.tier}</span>
            <span className="archetype-badge">{agent.archetype}</span>
            {agent.grief_stage !== 'none' && (
              <span className="grief-badge">
                {griefEmoji[agent.grief_stage]} {agent.grief_stage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Financial */}
      <section>
        <h3>Financial</h3>
        <div className="stat-row">
          <span>Savings</span>
          <strong>${snap.savings?.toLocaleString() ?? agent.savings.toLocaleString()}</strong>
        </div>
        <div className="stat-row">
          <span>Income / Expenses</span>
          <strong>${agent.monthly_income.toLocaleString()} / ${agent.monthly_expenses.toLocaleString()}/mo</strong>
        </div>
        <div className="stat-row">
          <span>Debt</span>
          <strong>${agent.debt_total.toLocaleString()}</strong>
        </div>

        {/* Runway bar */}
        <div className="runway-bar-wrapper">
          <div className="stat-row">
            <span>Runway</span>
            <strong style={{ color: runwayColor }}>
              {agent.runway_months < 1 ? '< 1 month ⚠️' : `${agent.runway_months.toFixed(1)} months`}
            </strong>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, (agent.runway_months / 24) * 100)}%`,
                background: runwayColor,
              }}
            />
          </div>
        </div>
      </section>

      {/* Psychological */}
      <section>
        <h3>Psychological</h3>
        <div className="stat-row">
          <span>Stress</span>
          <BarMeter value={snap.stress ?? agent.savings} max={1} color="#e53e3e" />
        </div>
        <div className="stat-row">
          <span>Agency</span>
          <BarMeter value={agent.agency} max={1} color="#4299e1" />
        </div>
        <div className="stat-row">
          <span>Threat level</span>
          <BarMeter value={agent.threat_level} max={1} color="#f97316" />
        </div>
        <div className="stat-row">
          <span>Identity attachment</span>
          <BarMeter value={agent.identity_attachment} max={1} color="#9f7aea" />
        </div>
      </section>

      {/* Status */}
      <section>
        <h3>Status</h3>
        <div className="stat-row">
          <span>Employment</span>
          <strong>{snap.employment_status}</strong>
        </div>
        <div className="stat-row">
          <span>Owns car</span>
          <strong>{agent.owns_car ? 'Yes' : 'No'} {agent.uses_robotaxi ? '(uses robotaxi)' : ''}</strong>
        </div>
        {agent.dependents > 0 && (
          <div className="stat-row">
            <span>Dependents</span>
            <strong>{agent.dependents}</strong>
          </div>
        )}
      </section>

      {/* In-progress transformation */}
      {activeTransform && (
        <section>
          <h3>In Progress</h3>
          <div className="transform-block">
            <div className="stat-row">
              <span>{activeTransform.type}</span>
              <strong>{(activeTransform.progress * 100).toFixed(0)}%</strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${activeTransform.progress * 100}%`, background: '#48bb78' }} />
            </div>
            <p className="transform-desc">ETA: {activeTransform.completion_eta_months} months</p>
          </div>
        </section>
      )}

      {/* Reflection (documentary layer) */}
      {latestReflection && (
        <section>
          <h3>Reflection (Tick {latestReflection.tick})</h3>
          <blockquote className="reflection-text">
            "{latestReflection.text.slice(0, 300)}{latestReflection.text.length > 300 ? '…' : ''}"
          </blockquote>
        </section>
      )}

      {/* Inner monologue for current tick */}
      {snap.inner_monologue && (
        <section>
          <h3>Inner Monologue (Tick {currentTick})</h3>
          <p className="inner-monologue">{snap.inner_monologue.slice(0, 250)}…</p>
        </section>
      )}

      {/* Commitments */}
      {agent.commitments.length > 0 && (
        <section>
          <h3>Locked In</h3>
          {agent.commitments.map((c, i) => (
            <div key={i} className="stat-row commitment">
              <span>{c.type}</span>
              <strong>${c.monthly_cost.toLocaleString()}/mo
                {c.remaining_months ? ` · ${c.remaining_months}mo left` : ''}
              </strong>
            </div>
          ))}
        </section>
      )}

      {/* Action buttons */}
      <div className="card-actions">
        <button>Follow Agent</button>
        <button>All Reflections</button>
        <button>Transactions</button>
      </div>
    </div>
  )
}

function BarMeter({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="bar-meter">
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      <span className="bar-value">{value.toFixed(2)}</span>
    </div>
  )
}
