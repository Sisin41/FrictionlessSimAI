/**
 * LayerControls.tsx
 * Toggle buttons for the 7 information overlay layers.
 *
 * DATA READS:  activeLayers
 * EMITS:       toggleLayer
 */

import { useSimStore, type LayerId } from '../store/simStore'

const LAYERS: Array<{ id: LayerId; label: string; color: string; description: string }> = [
  { id: 'economic_heatmap', label: 'Economy',   color: '#f97316', description: 'Zone health heatmap' },
  { id: 'social_graph',     label: 'Network',   color: '#4299e1', description: 'Social connections + trust' },
  { id: 'info_flow',        label: 'Info Flow', color: '#9f7aea', description: 'Information propagation' },
  { id: 'grief_topology',   label: 'Grief',     color: '#553c9a', description: 'Emotional state by agent' },
  { id: 'runway_countdown', label: 'Runway',    color: '#e53e3e', description: 'Financial survival countdowns' },
  { id: 'stress_topology',  label: 'Stress',    color: '#fc8181', description: 'Stress heatmap over homes' },
  { id: 'transaction_flow', label: 'Transactions', color: '#48bb78', description: 'Money/exchange flows' },
]

export default function LayerControls() {
  const { activeLayers, toggleLayer } = useSimStore()

  return (
    <div className="layer-controls">
      {LAYERS.map(layer => (
        <button
          key={layer.id}
          className={`layer-btn ${activeLayers.has(layer.id) ? 'active' : ''}`}
          style={{ '--layer-color': layer.color } as React.CSSProperties}
          onClick={() => toggleLayer(layer.id)}
          title={layer.description}
        >
          {layer.label}
        </button>
      ))}
    </div>
  )
}
