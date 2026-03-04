/**
 * buildingSprite.ts
 * Visual encoding rules for buildings.
 * Every visual state maps to real simulation data — health score drives everything.
 */

import type { BuildingTickState } from '../store/simStore'

export interface BuildingVisual {
  lightAlpha:    number    // 0-1, how much interior light shows
  signVisible:   boolean   // main open/hours sign
  forLeaseSign:  boolean   // FOR LEASE sign
  boardedUp:     boolean   // boarded windows
  smokeActive:   boolean   // chimney/industrial activity
  doorOpen:      boolean   // door animation
  tint:          number    // overall building tint
  saturation:    number    // 1 = full color, 0 = greyscale
  crowdLevel:    number    // 0-3, how many agent silhouettes visible in windows
}

/** Map BuildingTickState → BuildingVisual */
export function getBuildingVisual(state: BuildingTickState): BuildingVisual {
  const h = state.health

  if (!state.visible || state.visual_state === 'hidden') {
    return {
      lightAlpha: 0, signVisible: false, forLeaseSign: false,
      boardedUp: false, smokeActive: false, doorOpen: false,
      tint: 0xffffff, saturation: 0, crowdLevel: 0,
    }
  }

  switch (state.visual_state) {
    case 'thriving':
      return {
        lightAlpha: 1.0, signVisible: true, forLeaseSign: false,
        boardedUp: false, smokeActive: true, doorOpen: true,
        tint: 0xc8e6c9,   // subtle light green — healthy/thriving
        saturation: 1.0,
        crowdLevel: 3,
      }
    case 'stressed':
      return {
        lightAlpha: 0.8, signVisible: true, forLeaseSign: false,
        boardedUp: false, smokeActive: false, doorOpen: true,
        tint: 0xffa500,
        saturation: 0.85,
        crowdLevel: 2,
      }
    case 'declining':
      return {
        lightAlpha: 0.5, signVisible: false, forLeaseSign: h < 45,
        boardedUp: false, smokeActive: false, doorOpen: false,
        tint: 0xcc8800,
        saturation: 0.6,
        crowdLevel: 1,
      }
    case 'closing':
      return {
        lightAlpha: 0.2, signVisible: false, forLeaseSign: true,
        boardedUp: false, smokeActive: false, doorOpen: false,
        tint: 0x886633,
        saturation: 0.35,
        crowdLevel: 0,
      }
    case 'closed':
      return {
        lightAlpha: 0, signVisible: false, forLeaseSign: false,
        boardedUp: true, smokeActive: false, doorOpen: false,
        tint: 0x666666,
        saturation: 0.0,   // fully greyscale
        crowdLevel: 0,
      }
    default:
      return {
        lightAlpha: 0.5, signVisible: true, forLeaseSign: false,
        boardedUp: false, smokeActive: false, doorOpen: false,
        tint: 0xffffff, saturation: 0.7, crowdLevel: 1,
      }
  }
}

/**
 * Special overrides for specific buildings.
 * Community Center inverts normal rules — it glows brighter as disruption grows.
 * City Hall is always fully lit.
 * Park is always natural green.
 */
export function applyBuildingOverrides(
  buildingId: string,
  visual:     BuildingVisual,
  health:     number
): BuildingVisual {
  if (buildingId === 'community_center') {
    // Community Center brightens as the rest of the town darkens
    return {
      ...visual,
      lightAlpha:  Math.min(1.0, 1 - (health / 100)),
      saturation:  0.8,
      tint:        0x9f7aea,  // purple — community/mutual aid color
      signVisible: true,
      doorOpen:    true,
    }
  }
  if (buildingId === 'city_hall') {
    return { ...visual, lightAlpha: 0.95, tint: 0x4299e1, doorOpen: true }
  }
  if (buildingId === 'park') {
    return { ...visual, tint: 0x48bb78, saturation: 1.0, lightAlpha: 1.0 }
  }
  if (buildingId === 'informal_market') {
    return { ...visual, tint: 0xed8936, saturation: 0.9 }  // warm orange
  }
  return visual
}

/** Zone background tint for economic heatmap layer. */
export function getZoneHeatmapColor(healthAvg: number): number {
  if (healthAvg >= 70) return 0x276749   // green
  if (healthAvg >= 50) return 0x744210   // amber
  if (healthAvg >= 30) return 0x7b341e   // orange-red
  return 0x742a2a                         // deep red
}
