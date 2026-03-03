/**
 * agentSprite.ts
 * Defines the visual encoding rules for agent sprites.
 *
 * Every visual property maps to a specific data field — no random decoration.
 *
 * ─── State machine ────────────────────────────────────────────────────────────
 *
 * ANIMATION STATE (drives which sprite frame to show):
 *   grief_stage + agency + employment_status → animation_state
 *
 * MOVEMENT SPEED (drives walk cycle timing):
 *   stress_level → speed multiplier
 *
 * TINT / COLOR (drives clothing/body tint):
 *   tier → base tint
 *   grief_stage → overlay tint
 *
 * DANGER RING:
 *   runway_months → ring color + pulse speed
 *
 * POSITION:
 *   employment_status → home_tile vs work_tile vs park_tile
 */

export type AnimationState =
  | 'walk_ne'    // employed, normal
  | 'walk_sw'    // returning home
  | 'idle'       // at destination
  | 'sit'        // depression or zero runway
  | 'slump'      // very high stress (> 0.7)
  | 'hustle'     // hustler archetype, fast
  | 'talk'       // during transaction
  | 'work'       // at desk (inside building)

/** Map simulation state → animation state */
export function getAnimationState(params: {
  employment_status: string
  grief_stage:       string
  agency:            number
  stress:            number
  runway_months:     number
  archetype:         string
}): AnimationState {
  const { employment_status, grief_stage, agency, stress, runway_months, archetype } = params

  if (runway_months < 0.5) return 'sit'       // survival crisis → paralyzed
  if (stress > 0.70)       return 'slump'     // chronic high stress

  if (grief_stage === 'depression') return 'sit'

  if (employment_status === 'employed') {
    if (archetype === 'hustler' && agency > 0.75) return 'hustle'
    return 'walk_ne'
  }

  if (employment_status === 'transitioning') return 'walk_ne'   // going to retraining

  // unemployed
  if (agency < 0.55)  return 'sit'
  return 'idle'
}

/** Clothing tint per tier (hex numbers for PixiJS). */
export const TIER_TINT: Record<number, number> = {
  1: 0x1a365d,   // dark navy — suit
  2: 0x2a4365,   // business blue
  3: 0x4a5568,   // casual grey-blue
  4: 0x718096,   // worn grey
}

/** Overlay tint per grief stage (blended on top of tier tint). */
export const GRIEF_TINT: Record<string, number | null> = {
  none:             null,
  bargaining:       0xffd700,   // golden — grasping
  anger:            0xe53e3e,   // red
  depression:       0x4a5568,   // desaturated grey
  acceptance:       0x48bb78,   // gentle green
  acceptance_early: 0x68d391,   // lighter green
}

/** Pulse ring color per runway severity. */
export function getRunwayRingColor(runway: number): number | null {
  if (runway > 12) return null
  if (runway > 6)  return 0xfbbf24   // yellow
  if (runway > 1)  return 0xf97316   // orange
  return 0xef4444                     // red
}

/** Walk speed multiplier based on stress + archetype. */
export function getWalkSpeed(stress: number, archetype: string): number {
  if (archetype === 'hustler') return 1.4
  if (stress > 0.6)  return 1.3   // anxious fast
  if (stress > 0.3)  return 1.0   // normal
  if (stress < 0.1)  return 0.8   // calm, deliberate
  return 1.0
}

/**
 * Determine which building tile an agent should be at during a given tick.
 *
 * Priority order:
 * 1. during a transaction → midpoint between initiator and target
 * 2. employed             → workplace tile
 * 3. transitioning        → community_center or high_school
 * 4. unemployed, hustler  → park or wandering
 * 5. depression/zero-run  → home tile
 * 6. default unemployed   → park/commons
 */
export type LocationType = 'workplace' | 'home' | 'park' | 'community_center' | 'high_school' | 'transit'

export function getAgentLocation(params: {
  employment_status:   string
  grief_stage:         string
  agency:              number
  runway_months:       number
  archetype:           string
  has_active_tx:       boolean
  transformations:     Array<{type: string}>
}): LocationType {
  const { employment_status, grief_stage, agency, runway_months, archetype, has_active_tx, transformations } = params

  if (has_active_tx) return 'transit'

  if (employment_status === 'employed') return 'workplace'

  if (employment_status === 'transitioning') {
    const isEVtech = transformations.some(t =>
      t.type?.toLowerCase().includes('ev') || t.type?.toLowerCase().includes('cert')
    )
    return isEVtech ? 'high_school' : 'community_center'
  }

  // unemployed
  if (grief_stage === 'depression' || runway_months < 1.0) return 'home'
  if (agency < 0.55) return 'home'
  if (archetype === 'builder') return 'community_center'
  return 'park'
}
