/**
 * ScreenshotButton.tsx
 * Captures the PixiJS canvas with a stats overlay and downloads as PNG.
 */

import { useSimStore } from '../store/simStore'
import type { WorldRenderer } from '../pixi/WorldRenderer'

interface Props {
  rendererRef: React.RefObject<WorldRenderer | null>
}

export default function ScreenshotButton({ rendererRef }: Props) {
  const currentTick = useSimStore(s => s.currentTick)
  const timeseries = useSimStore(s => s.timeseries)
  const selectedAgentId = useSimStore(s => s.selectedAgentId)
  const agents = useSimStore(s => s.agents)
  const activeLayers = useSimStore(s => s.activeLayers)

  function capture() {
    const renderer = rendererRef.current
    if (!renderer) return

    const srcCanvas = renderer.getCanvas()
    if (!srcCanvas) return

    // Create a composite canvas
    const w = srcCanvas.width
    const h = srcCanvas.height
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw the PixiJS canvas
    ctx.drawImage(srcCanvas, 0, 0)

    // Draw stats overlay bar at the bottom
    const barH = 40
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.fillRect(0, h - barH, w, barH)

    // Stats text
    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    const td = timeseries?.[String(currentTick)]
    const maxTick = useSimStore.getState().maxTick
    const parts: string[] = [`Tick ${currentTick}/${maxTick}`]
    if (td) {
      if (td.employment_rate != null) parts.push(`Emp: ${(td.employment_rate * 100).toFixed(0)}%`)
      if (td.spending_index != null)  parts.push(`Spend: ${Math.round(td.spending_index)}`)
      if (td.gini != null)            parts.push(`Gini: ${td.gini.toFixed(2)}`)
      if (td.robotaxi_rate != null)   parts.push(`RoboTaxi: ${(td.robotaxi_rate * 100).toFixed(0)}%`)
    }
    if (selectedAgentId && agents?.[selectedAgentId]) {
      parts.push(`Agent: ${agents[selectedAgentId].name}`)
    }
    if (activeLayers.size > 0) {
      parts.push(`Layers: ${[...activeLayers].join(', ')}`)
    }

    ctx.fillText(parts.join('  |  '), 12, h - barH + 24)

    // Watermark
    ctx.fillStyle = '#4a5568'
    ctx.font = '10px monospace'
    ctx.textAlign = 'right'
    ctx.fillText('FrictionlessSim AI — Millfield', w - 12, h - barH + 24)

    // Download
    const link = document.createElement('a')
    link.download = `millfield-tick${currentTick}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <button className="screenshot-btn" onClick={capture} title="Screenshot (capture canvas + stats)">
      Share
    </button>
  )
}
