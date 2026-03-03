/**
 * useKeyboard.ts
 * Global keyboard shortcuts for the viewer.
 *
 * Space:        play/pause
 * ← / →:       step ±1 tick
 * Shift+← / →: step ±5 ticks
 * 1-7:          toggle layers
 * F:            follow selected agent
 * Esc:          deselect / close panels
 */

import { useEffect } from 'react'
import { useSimStore, type LayerId } from '../store/simStore'

const LAYER_KEYS: Record<string, LayerId> = {
  '1': 'economic_heatmap',
  '2': 'social_graph',
  '3': 'info_flow',
  '4': 'grief_topology',
  '5': 'runway_countdown',
  '6': 'stress_topology',
  '7': 'transaction_flow',
}

export function useKeyboard() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't capture when user is typing in an input
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const store = useSimStore.getState()

      switch (e.key) {
        case ' ':
          e.preventDefault()
          store.setPlaying(!store.isPlaying)
          break

        case 'ArrowLeft':
          e.preventDefault()
          store.stepTick(e.shiftKey ? -5 : -1)
          store.setPlaying(false)
          break

        case 'ArrowRight':
          e.preventDefault()
          store.stepTick(e.shiftKey ? 5 : 1)
          store.setPlaying(false)
          break

        case 'Escape':
          store.selectAgent(null)
          store.selectBuilding(null)
          store.setFollowAgent(null)
          break

        case 'f':
        case 'F':
          if (store.selectedAgentId) {
            const newFollow = store.followAgentId === store.selectedAgentId
              ? null
              : store.selectedAgentId
            store.setFollowAgent(newFollow)
          }
          break

        default:
          if (LAYER_KEYS[e.key]) {
            store.toggleLayer(LAYER_KEYS[e.key])
          }
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
