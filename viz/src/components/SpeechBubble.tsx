/**
 * SpeechBubble.tsx
 * Shows agent inner monologue on hover as a speech bubble
 * positioned above the agent sprite on the canvas.
 *
 * DATA READS:
 *   hoveredAgentId, agents, currentTick
 */

import { useSimStore, getAgentAtTick } from '../store/simStore'
import type { WorldRenderer } from '../pixi/WorldRenderer'

interface Props {
  rendererRef: React.RefObject<WorldRenderer | null>
}

export default function SpeechBubble({ rendererRef }: Props) {
  const hoveredAgentId = useSimStore(s => s.hoveredAgentId)
  const agents = useSimStore(s => s.agents)
  const currentTick = useSimStore(s => s.currentTick)

  if (!hoveredAgentId || !agents) return null

  const agent = agents[hoveredAgentId]
  if (!agent) return null

  const snap = getAgentAtTick(agent, currentTick)
  const monologue = snap.inner_monologue
  if (!monologue) return null

  const renderer = rendererRef.current
  if (!renderer) return null

  const pos = renderer.getAgentScreenPos(hoveredAgentId)
  if (!pos) return null

  // Truncate for bubble display
  const text = monologue.length > 180 ? monologue.slice(0, 180) + '...' : monologue

  return (
    <div
      className="speech-bubble"
      style={{
        left: pos.x,
        top: pos.y - 20,
      }}
    >
      <div className="speech-bubble-name">{agent.name}</div>
      <div className="speech-bubble-text">{text}</div>
      <div className="speech-bubble-tail" />
    </div>
  )
}
