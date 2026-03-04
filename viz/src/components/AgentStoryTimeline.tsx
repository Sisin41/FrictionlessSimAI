/**
 * AgentStoryTimeline.tsx
 * Narrative timeline panel that lets users follow an agent's journey
 * tick-by-tick like a story. Shows inner monologue, employment changes,
 * financial trajectory, reflections, and outcome narratives.
 *
 * Appears when an agent is selected — provides the "follow like a story"
 * experience across all 14 ticks.
 *
 * DATA READS:
 *   agents[selectedAgentId], currentTick, maxTick, transactions
 */

import { useRef, useEffect, useMemo } from 'react'
import { useSimStore, getAgentAtTick, type Agent, type Transaction } from '../store/simStore'

interface StoryEntry {
  tick: number
  employment: string
  savings: number
  stress: number
  monologue: string | null
  narrative: string | null
  reflection: string | null
  employmentChanged: boolean
  transactions: string[]
}

function buildStory(agent: Agent, maxTick: number, allTx: Transaction[] | null): StoryEntry[] {
  const entries: StoryEntry[] = []
  let prevEmployment = ''

  for (let t = 0; t <= maxTick; t++) {
    const snap = agent.history[String(t)]
    if (!snap) continue

    const employment = snap.employment_status ?? 'unknown'
    const employmentChanged = prevEmployment !== '' && employment !== prevEmployment
    prevEmployment = employment

    // Find reflections at this tick
    let reflection: string | null = null
    for (const ref of agent.reflections) {
      const refTick = typeof ref.tick === 'string' ? parseInt(ref.tick, 10) : ref.tick
      if (refTick === t) {
        reflection = ref.text
        break
      }
    }

    // Find transactions involving this agent at this tick
    const txDescs: string[] = []
    if (allTx) {
      for (const tx of allTx) {
        if (tx.tick === t && (tx.initiator === agent.id || tx.target === agent.id)) {
          txDescs.push(tx.description)
        }
      }
    }

    entries.push({
      tick: t,
      employment,
      savings: snap.savings,
      stress: snap.stress,
      monologue: snap.inner_monologue ?? null,
      narrative: snap.outcome_narrative ?? null,
      reflection,
      employmentChanged,
      transactions: txDescs,
    })
  }

  return entries
}

function formatMoney(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n.toLocaleString()}`
}

function stressLabel(s: number): string {
  if (s < 0.2) return 'calm'
  if (s < 0.4) return 'uneasy'
  if (s < 0.6) return 'stressed'
  if (s < 0.8) return 'distressed'
  return 'crisis'
}

export default function AgentStoryTimeline() {
  const { selectedAgentId, agents, currentTick, maxTick, transactions, setTick, setFollowAgent, followAgentId } = useSimStore()
  const activeRef = useRef<HTMLDivElement>(null)

  const agent = selectedAgentId && agents ? agents[selectedAgentId] : null

  const story = useMemo(() => {
    if (!agent) return []
    return buildStory(agent, maxTick, transactions ?? null)
  }, [agent, maxTick, transactions])

  // Auto-scroll to current tick entry
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [currentTick])

  if (!agent || story.length === 0) return null

  const isFollowing = followAgentId === selectedAgentId

  return (
    <div className="agent-story-timeline panel">
      <div className="story-header">
        <h3>{agent.name}'s Story</h3>
        <div className="story-header-actions">
          <button
            className={`story-follow-btn ${isFollowing ? 'active' : ''}`}
            onClick={() => setFollowAgent(isFollowing ? null : selectedAgentId)}
            title={isFollowing ? 'Stop following' : 'Follow agent on map'}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      <div className="story-meta">
        <span>{agent.role}</span>
        <span>Tier {agent.tier}</span>
        <span>{agent.archetype}</span>
      </div>

      <div className="story-entries">
        {story.map((entry) => {
          const isCurrent = entry.tick === currentTick
          const isPast = entry.tick < currentTick
          const isFuture = entry.tick > currentTick

          return (
            <div
              key={entry.tick}
              ref={isCurrent ? activeRef : undefined}
              className={`story-entry ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
              onClick={() => setTick(entry.tick)}
            >
              <div className="story-tick-marker">
                <div className="story-tick-dot" />
                <span className="story-tick-num">T{entry.tick}</span>
              </div>

              <div className="story-tick-content">
                {/* Status badges */}
                <div className="story-status-row">
                  <span className={`story-badge employment-${entry.employment}`}>
                    {entry.employment}
                  </span>
                  <span className="story-badge savings">{formatMoney(entry.savings)}</span>
                  <span className={`story-badge stress-${stressLabel(entry.stress)}`}>
                    {stressLabel(entry.stress)}
                  </span>
                </div>

                {/* Employment change alert */}
                {entry.employmentChanged && (
                  <div className="story-event employment-change">
                    Status changed to {entry.employment}
                  </div>
                )}

                {/* Outcome narrative */}
                {entry.narrative && (
                  <p className="story-narrative">{entry.narrative}</p>
                )}

                {/* Inner monologue */}
                {entry.monologue && (
                  <blockquote className="story-monologue">
                    {entry.monologue.length > 180
                      ? entry.monologue.slice(0, 180) + '...'
                      : entry.monologue}
                  </blockquote>
                )}

                {/* Transactions */}
                {entry.transactions.length > 0 && (
                  <div className="story-transactions">
                    {entry.transactions.map((desc, i) => (
                      <p key={i} className="story-tx">
                        {desc.length > 120 ? desc.slice(0, 120) + '...' : desc}
                      </p>
                    ))}
                  </div>
                )}

                {/* Reflection */}
                {entry.reflection && (
                  <blockquote className="story-reflection">
                    "{entry.reflection.length > 200
                      ? entry.reflection.slice(0, 200) + '...'
                      : entry.reflection}"
                  </blockquote>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
