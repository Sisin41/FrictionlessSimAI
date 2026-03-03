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

/** Well-known tile locations for non-building destinations. */
const WELL_KNOWN_TILES: Record<string, [number, number]> = {
  park:             [21, 7],
  community_center: [1, 7],
  high_school:      [20, 2],
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
