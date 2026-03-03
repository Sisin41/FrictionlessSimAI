/**
 * ReflectionCaption.tsx
 * Documentary film-subtitle overlay that shows agent reflections
 * at tick 6 and 9. Cycles through all agents with reflections at
 * that tick. Fade in / hold 4s / fade out.
 *
 * DATA READS:
 *   agents, currentTick, followAgentId
 */

import { useEffect, useState, useRef } from 'react'
import { useSimStore, type Agent, type AgentReflection } from '../store/simStore'

interface CaptionEntry {
  agentName: string
  agentId: string
  tick: number
  text: string
}

export default function ReflectionCaption() {
  const agents = useSimStore(s => s.agents)
  const currentTick = useSimStore(s => s.currentTick)
  const followAgentId = useSimStore(s => s.followAgentId)

  const [caption, setCaption] = useState<CaptionEntry | null>(null)
  const [visible, setVisible] = useState(false)
  const queueRef = useRef<CaptionEntry[]>([])
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTickRef = useRef(-1)

  // Build caption queue when tick changes to a reflection tick
  useEffect(() => {
    if (!agents || currentTick === lastTickRef.current) return
    lastTickRef.current = currentTick

    // Clear existing queue
    if (timerRef.current) clearTimeout(timerRef.current)
    setCaption(null)
    setVisible(false)

    // Gather all reflections at this tick
    const entries: CaptionEntry[] = []
    for (const [id, agent] of Object.entries(agents)) {
      for (const ref of agent.reflections) {
        const refTick = typeof ref.tick === 'string' ? parseInt(ref.tick, 10) : ref.tick
        if (refTick === currentTick) {
          entries.push({
            agentName: agent.name,
            agentId: id,
            tick: currentTick,
            text: ref.text.slice(0, 200) + (ref.text.length > 200 ? '...' : ''),
          })
        }
      }
    }

    if (entries.length === 0) return

    // If following an agent, prioritize their caption
    if (followAgentId) {
      const followIdx = entries.findIndex(e => e.agentId === followAgentId)
      if (followIdx > 0) {
        const [entry] = entries.splice(followIdx, 1)
        entries.unshift(entry)
      }
    }

    queueRef.current = entries
    indexRef.current = 0
    showNext()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTick, agents])

  function showNext() {
    const queue = queueRef.current
    const idx = indexRef.current
    if (idx >= queue.length) {
      setCaption(null)
      setVisible(false)
      return
    }

    setCaption(queue[idx])
    setVisible(true)

    // Hold for 4s, then fade out, then advance
    timerRef.current = setTimeout(() => {
      setVisible(false)
      timerRef.current = setTimeout(() => {
        indexRef.current++
        showNext()
      }, 600) // fade out duration
    }, 4000)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!caption) return null

  return (
    <div className={`reflection-caption-overlay ${visible ? 'visible' : 'fading'}`}>
      <div className="reflection-caption-text">
        "{caption.text}"
      </div>
      <div className="reflection-caption-attr">
        — {caption.agentName}, tick {caption.tick}
      </div>
    </div>
  )
}
