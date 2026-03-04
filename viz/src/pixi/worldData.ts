/**
 * worldData.ts
 * Position maps for agents and buildings, translated from data-pipeline/world_layout.py.
 */

/** Home tile [col, row] per agent id. */
export const HOME_TILES: Record<string, [number, number]> = {
  // Tier 1
  council_member:        [1, 10],
  ceo_regional_auto:     [3, 11],
  bank_manager:          [5, 12],
  // Tier 2
  dealership_gm:         [7, 10],
  insurance_manager:     [9, 11],
  hr_director:           [11, 12],
  // Tier 3
  mechanic_carlos:       [3, 15],
  mechanic_sarah:        [5, 14],
  insurance_agent_tom:   [7, 15],
  insurance_agent_priya: [9, 14],
  gas_station_owner:     [11, 15],
  loan_officer:          [13, 14],
  salesperson_jake:      [15, 15],
  salesperson_tamika:    [17, 14],
  // Tier 4
  diner_owner:           [1, 16],
  driving_instructor:    [3, 17],
  car_wash_worker:       [5, 16],
  parking_garage_mgr:    [7, 17],
  commuter_james:        [9, 16],
  commuter_rachel:       [11, 17],
  truck_owner:           [13, 16],
  retiree:               [15, 17],
  young_gig_worker:      [17, 16],
  single_parent:         [19, 17],
  parts_store_owner:     [21, 16],
  rideshare_driver:      [23, 17],
  real_estate_agent:     [1, 18],
  auto_shop_teacher:     [3, 19],
  community_organizer:   [5, 18],
  uber_driver_2:         [7, 19],
}

/** Agent → workplace building id (null = no fixed workplace). */
export const AGENT_WORKPLACE: Record<string, string | null> = {
  ceo_regional_auto:     'auto_mall',
  bank_manager:          'bank',
  council_member:        'city_hall',
  dealership_gm:         'auto_mall',
  insurance_manager:     'insurance_office',
  hr_director:           'auto_mall',
  salesperson_jake:      'auto_mall',
  salesperson_tamika:    'auto_mall',
  mechanic_carlos:       'mechanic_shop_a',
  mechanic_sarah:        'mechanic_shop_b',
  gas_station_owner:     'gas_station',
  insurance_agent_tom:   'insurance_office',
  insurance_agent_priya: 'insurance_office',
  loan_officer:          'bank',
  diner_owner:           'diner',
  driving_instructor:    'driving_school',
  car_wash_worker:       'car_wash',
  parking_garage_mgr:    'parking_garage',
  commuter_james:        null,
  commuter_rachel:       null,
  truck_owner:           null,
  retiree:               null,
  young_gig_worker:      'park',
  single_parent:         null,
  parts_store_owner:     'parts_store',
  rideshare_driver:      null,
  real_estate_agent:     'real_estate',
  auto_shop_teacher:     'high_school',
  community_organizer:   'community_center',
  uber_driver_2:         null,
}

/**
 * Override tile positions for buildings to spread them across the grid
 * and eliminate isometric overlaps (buildings with same col-row value
 * stack on top of each other in screen space).
 */
export const BUILDING_TILE_OVERRIDES: Record<string, [number, number]> = {
  // Civic district — spread vertically
  city_hall:          [1, 1],
  bank:              [4, 4],
  community_center:  [1, 8],

  // Auto row — break col-row ties, wider horizontal spread
  parts_store:       [7, 2],
  real_estate:       [8, 0],    // was [9,0], same col-row as auto_mall
  auto_mall:         [12, 2],   // shifted right 1
  gas_station:       [16, 0],   // was [15,1], same col-row as diner
  diner:             [17, 4],   // moved down 1

  // Services row — spread more evenly across cols 3-18
  mechanic_shop_a:   [3, 6],
  mechanic_shop_b:   [7, 7],   // was [6,6], shifted right+down
  insurance_office:  [11, 6],  // was [10,7], shifted
  parking_garage:    [15, 7],  // was [14,6], shifted
  car_wash:          [18, 8],  // was [17,7], shifted right+down

  // Education — spread
  high_school:       [21, 1],  // was [20,2]
  driving_school:    [24, 3],  // was [23,1]

  // Park + market — break col-row tie
  park:              [22, 6],  // was [21,7]
  informal_market:   [19, 9],  // was [19,6], moved down
}

/** Well-known tile locations for non-building destinations (derived from overrides). */
const WELL_KNOWN_TILES: Record<string, [number, number]> = {
  park:             BUILDING_TILE_OVERRIDES.park,
  community_center: BUILDING_TILE_OVERRIDES.community_center,
  high_school:      BUILDING_TILE_OVERRIDES.high_school,
}

/**
 * Get the display tile for a building, applying spread overrides.
 */
export function getBuildingDisplayTile(buildingId: string, originalTile: [number, number]): [number, number] {
  return BUILDING_TILE_OVERRIDES[buildingId] ?? originalTile
}

/**
 * Convert a LocationType string to a tile [col, row].
 * Uses building tile positions when the location is 'workplace'.
 */
export function locationToTile(
  location: string,
  agentId: string,
  buildingTiles: Record<string, [number, number]>,
): [number, number] {
  if (location === 'workplace') {
    const bId = AGENT_WORKPLACE[agentId]
    if (bId && buildingTiles[bId]) return buildingTiles[bId]
    // Fallback: if no workplace, go home
    return HOME_TILES[agentId] ?? [13, 10]
  }
  if (location === 'home') {
    return HOME_TILES[agentId] ?? [13, 10]
  }
  if (location === 'transit') {
    // Midpoint-ish: just use park for now
    return WELL_KNOWN_TILES.park
  }
  if (WELL_KNOWN_TILES[location]) {
    return WELL_KNOWN_TILES[location]
  }
  // Default fallback
  return HOME_TILES[agentId] ?? [13, 10]
}
