/**
 * BuildingTransitionManager.ts
 * Crossfade building visuals between ticks instead of instant cuts.
 * Manages per-building interpolation of tint, lightAlpha, saturation.
 */

import type { BuildingVisual } from './buildingSprite'

interface BuildingTransition {
  buildingId: string
  fromVisual: BuildingVisual
  toVisual: BuildingVisual
  progress: number  // 0-1
  duration: number  // seconds
}

export function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return (r << 16) | (g << 8) | bl
}

export class BuildingTransitionManager {
  private transitions: Map<string, BuildingTransition> = new Map()

  startTransition(buildingId: string, from: BuildingVisual, to: BuildingVisual, duration = 0.4) {
    this.transitions.set(buildingId, {
      buildingId,
      fromVisual: from,
      toVisual: to,
      progress: 0,
      duration,
    })
  }

  /** Advance all transitions by dt seconds. Returns map of currently-transitioning visuals. */
  update(dtSeconds: number): Map<string, BuildingVisual> {
    const current = new Map<string, BuildingVisual>()
    const toRemove: string[] = []

    this.transitions.forEach((t, id) => {
      t.progress = Math.min(1, t.progress + dtSeconds / t.duration)
      current.set(id, this.interpolateVisual(t.fromVisual, t.toVisual, t.progress))
      if (t.progress >= 1) toRemove.push(id)
    })

    for (const id of toRemove) this.transitions.delete(id)
    return current
  }

  isTransitioning(buildingId: string): boolean {
    return this.transitions.has(buildingId)
  }

  clear() {
    this.transitions.clear()
  }

  private interpolateVisual(a: BuildingVisual, b: BuildingVisual, t: number): BuildingVisual {
    return {
      ...b,
      lightAlpha: a.lightAlpha + (b.lightAlpha - a.lightAlpha) * t,
      saturation: a.saturation + (b.saturation - a.saturation) * t,
      tint: lerpColor(a.tint, b.tint, t),
      crowdLevel: t < 0.5 ? a.crowdLevel : b.crowdLevel,
    }
  }
}
