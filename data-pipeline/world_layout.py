"""
world_layout.py
Defines Millfield's isometric grid layout.
Grid: 26 cols × 20 rows. Each cell is a tile.
Isometric projection: screen_x = (col - row) * TW/2, screen_y = (col + row) * TH/4
"""

GRID_COLS = 26
GRID_ROWS = 20

# ─────────────────────────────────────────────────────────────────
# ZONE DEFINITIONS
# Each zone has a bounding box (col_start, row_start, col_end, row_end)
# and a label for the heatmap overlay.
# ─────────────────────────────────────────────────────────────────
ZONES = {
    "auto_row":          {"cols": (6, 17),  "rows": (0, 4),  "label": "Auto Row",          "color": "#2a4a7f"},
    "services_row":      {"cols": (2, 17),  "rows": (5, 9),  "label": "Services Row",       "color": "#1a5c3a"},
    "civic_district":    {"cols": (0, 5),   "rows": (0, 9),  "label": "Civic District",     "color": "#5a3a7f"},
    "education":         {"cols": (18, 25), "rows": (0, 4),  "label": "Education",          "color": "#7f5a1a"},
    "park":              {"cols": (18, 25), "rows": (5, 9),  "label": "Park / Commons",     "color": "#2a5a2a"},
    "residential_t1":    {"cols": (0, 5),   "rows": (10, 13),"label": "Uptown",             "color": "#2a4a7f"},
    "residential_t2":    {"cols": (6, 11),  "rows": (10, 13),"label": "Midtown",            "color": "#2a6a6a"},
    "residential_t4":    {"cols": (0, 25),  "rows": (14, 19),"label": "Residential",        "color": "#4a4a4a"},
    "informal_market":   {"cols": (18, 25), "rows": (5, 9),  "label": "Informal Market",    "color": "#7a4a2a"},  # overlaps park, appears tick 7
}

# ─────────────────────────────────────────────────────────────────
# BUILDING DEFINITIONS
# Each building has: id, label, zone, tile (col, row), agents[], sector
# ─────────────────────────────────────────────────────────────────
BUILDINGS = [
    # ── AUTO ROW ──────────────────────────────────────────────────
    {
        "id": "auto_mall",
        "label": "Millfield Auto Mall",
        "zone": "auto_row",
        "tile": (11, 2),
        "agents": ["ceo_regional_auto", "dealership_gm", "hr_director", "salesperson_jake", "salesperson_tamika"],
        "sector": "retail_auto",
        "size": "large",      # affects sprite footprint
    },
    {
        "id": "parts_store",
        "label": "Liu's Auto Parts",
        "zone": "auto_row",
        "tile": (7, 1),
        "agents": ["parts_store_owner"],
        "sector": "retail_auto",
        "size": "small",
    },
    {
        "id": "gas_station",
        "label": "Patel's Gas Station",
        "zone": "auto_row",
        "tile": (15, 1),
        "agents": ["gas_station_owner"],
        "sector": "fuel",
        "size": "small",
    },
    {
        "id": "diner",
        "label": "Auto Row Diner",
        "zone": "auto_row",
        "tile": (17, 3),
        "agents": ["diner_owner"],
        "sector": "food_service",
        "size": "small",
    },
    {
        "id": "real_estate",
        "label": "Morris Realty",
        "zone": "auto_row",
        "tile": (9, 0),
        "agents": ["real_estate_agent"],
        "sector": "real_estate",
        "size": "small",
    },

    # ── SERVICES ROW ──────────────────────────────────────────────
    {
        "id": "mechanic_shop_a",
        "label": "Ruiz Auto Service",
        "zone": "services_row",
        "tile": (3, 6),
        "agents": ["mechanic_carlos"],
        "sector": "service",
        "size": "medium",
    },
    {
        "id": "mechanic_shop_b",
        "label": "Kim's Garage",
        "zone": "services_row",
        "tile": (6, 6),
        "agents": ["mechanic_sarah"],
        "sector": "service",
        "size": "medium",
    },
    {
        "id": "insurance_office",
        "label": "AutoShield Insurance",
        "zone": "services_row",
        "tile": (10, 7),
        "agents": ["insurance_manager", "insurance_agent_tom", "insurance_agent_priya"],
        "sector": "insurance",
        "size": "medium",
    },
    {
        "id": "parking_garage",
        "label": "Millfield Parking",
        "zone": "services_row",
        "tile": (14, 6),
        "agents": ["parking_garage_mgr"],
        "sector": "transport",
        "size": "medium",
    },
    {
        "id": "car_wash",
        "label": "Sparkle Car Wash",
        "zone": "services_row",
        "tile": (17, 7),
        "agents": ["car_wash_worker"],
        "sector": "service",
        "size": "small",
    },

    # ── CIVIC DISTRICT ─────────────────────────────────────────────
    {
        "id": "city_hall",
        "label": "City Hall",
        "zone": "civic_district",
        "tile": (2, 2),
        "agents": ["council_member"],
        "sector": "policy",
        "size": "large",
    },
    {
        "id": "bank",
        "label": "First Community Bank",
        "zone": "civic_district",
        "tile": (4, 5),
        "agents": ["bank_manager", "loan_officer"],
        "sector": "finance",
        "size": "medium",
    },
    {
        "id": "community_center",
        "label": "Millfield Community Center",
        "zone": "civic_district",
        "tile": (1, 7),
        "agents": ["community_organizer"],
        "sector": "community",
        "size": "large",
    },

    # ── EDUCATION ─────────────────────────────────────────────────
    {
        "id": "high_school",
        "label": "Millfield High School",
        "zone": "education",
        "tile": (20, 2),
        "agents": ["auto_shop_teacher"],
        "sector": "education",
        "size": "large",
    },
    {
        "id": "driving_school",
        "label": "Russo Driving School",
        "zone": "education",
        "tile": (23, 1),
        "agents": ["driving_instructor"],
        "sector": "education",
        "size": "small",
    },

    # ── PARK ──────────────────────────────────────────────────────
    {
        "id": "park",
        "label": "Millfield Park",
        "zone": "park",
        "tile": (21, 7),
        "agents": [],        # gathering point, not a workplace
        "sector": "community",
        "size": "large",
    },

    # ── INFORMAL MARKET ───────────────────────────────────────────
    # Appears at tick 7 (first mutual_aid event)
    {
        "id": "informal_market",
        "label": "Community Swap Meet",
        "zone": "informal_market",
        "tile": (19, 6),
        "agents": [],         # no fixed occupants
        "sector": "informal",
        "size": "medium",
        "appears_tick": 7,
    },

    # ── RESIDENTIAL ───────────────────────────────────────────────
    # One "house" per agent, positioned by tier
    # Generated dynamically in assign_positions.py
]

# ─────────────────────────────────────────────────────────────────
# HOME TILE ASSIGNMENTS (by agent, hardcoded from tier)
# T1 agents: upper-left quadrant (spacious)
# T2 agents: midtown
# T3 agents: scattered across midtown
# T4 agents: lower band (dense)
# ─────────────────────────────────────────────────────────────────
HOME_TILES = {
    # Tier 1
    "council_member":        (1, 10),
    "ceo_regional_auto":     (3, 11),
    "bank_manager":          (5, 12),
    # Tier 2
    "dealership_gm":         (7, 10),
    "insurance_manager":     (9, 11),
    "hr_director":           (11, 12),
    # Tier 3 (scattered mid-zone)
    "mechanic_carlos":       (3, 15),
    "mechanic_sarah":        (5, 14),
    "insurance_agent_tom":   (7, 15),
    "insurance_agent_priya": (9, 14),
    "gas_station_owner":     (11, 15),
    "loan_officer":          (13, 14),
    "salesperson_jake":      (15, 15),
    "salesperson_tamika":    (17, 14),
    # Tier 4 (lower band, denser)
    "diner_owner":           (1, 16),
    "driving_instructor":    (3, 17),
    "car_wash_worker":       (5, 16),
    "parking_garage_mgr":    (7, 17),
    "commuter_james":        (9, 16),
    "commuter_rachel":       (11, 17),
    "truck_owner":           (13, 16),
    "retiree":               (15, 17),
    "young_gig_worker":      (17, 16),
    "single_parent":         (19, 17),
    "parts_store_owner":     (21, 16),
    "rideshare_driver":      (23, 17),
    "real_estate_agent":     (1, 18),
    "auto_shop_teacher":     (3, 19),
    "community_organizer":   (5, 18),
    "uber_driver_2":         (7, 19),
}

# ─────────────────────────────────────────────────────────────────
# AGENT → WORKPLACE BUILDING (where they go when employed)
# ─────────────────────────────────────────────────────────────────
AGENT_WORKPLACE = {
    "ceo_regional_auto":     "auto_mall",
    "bank_manager":          "bank",
    "council_member":        "city_hall",
    "dealership_gm":         "auto_mall",
    "insurance_manager":     "insurance_office",
    "hr_director":           "auto_mall",
    "salesperson_jake":      "auto_mall",
    "salesperson_tamika":    "auto_mall",
    "mechanic_carlos":       "mechanic_shop_a",
    "mechanic_sarah":        "mechanic_shop_b",
    "gas_station_owner":     "gas_station",
    "insurance_agent_tom":   "insurance_office",
    "insurance_agent_priya": "insurance_office",
    "loan_officer":          "bank",
    "diner_owner":           "diner",
    "driving_instructor":    "driving_school",
    "car_wash_worker":       "car_wash",
    "parking_garage_mgr":    "parking_garage",
    "commuter_james":        None,   # leaves town, no local building
    "commuter_rachel":       None,   # leaves town
    "truck_owner":           None,   # mobile, works job sites
    "retiree":               None,   # home-based
    "young_gig_worker":      "park", # gig work / informal
    "single_parent":         None,   # hospital, outside Millfield
    "parts_store_owner":     "parts_store",
    "rideshare_driver":      None,   # mobile
    "real_estate_agent":     "real_estate",
    "auto_shop_teacher":     "high_school",
    "community_organizer":   "community_center",
    "uber_driver_2":         None,   # mobile
}

# ─────────────────────────────────────────────────────────────────
# BUILDING HEALTH FORMULA
# health (0-100) per tick, computed from market_state + agent states
# ─────────────────────────────────────────────────────────────────
BUILDING_HEALTH_SOURCES = {
    "auto_mall":        {"type": "sector_index", "field": "auto_sector.dealership_revenue_index"},
    "parts_store":      {"type": "derived",      "formula": "car_ownership.ownership_rate * 100 * 0.9 + 10"},
    "gas_station":      {"type": "derived",      "formula": "car_ownership.ownership_rate * 100"},
    "diner":            {"type": "sector_index", "field": "spending.spending_index"},
    "real_estate":      {"type": "derived",      "formula": "min(100, spending.spending_index * 1.2)"},
    "mechanic_shop_a":  {"type": "sector_index", "field": "auto_sector.mechanic_demand_index"},
    "mechanic_shop_b":  {"type": "sector_index", "field": "auto_sector.mechanic_demand_index"},
    "insurance_office": {"type": "derived",      "formula": "auto_sector.insurance_policies_active / 28 * 100"},
    "parking_garage":   {"type": "derived",      "formula": "car_ownership.total_owners / 28 * 100"},
    "car_wash":         {"type": "derived",      "formula": "car_ownership.total_owners / 28 * 80"},
    "city_hall":        {"type": "constant",     "value": 95},   # always open
    "bank":             {"type": "agent_status", "agent": "bank_manager", "employed_value": 80, "unemployed_value": 25},
    "community_center": {"type": "inverted",     "formula": "min(100, (1 - employment_rate) * 100 + 40)"},
    "high_school":      {"type": "constant",     "value": 85},   # transformation in progress
    "driving_school":   {"type": "agent_status", "agent": "driving_instructor", "employed_value": 75, "unemployed_value": 10},
    "park":             {"type": "constant",     "value": 100},  # always there
    "informal_market":  {"type": "derived",      "formula": "community.mutual_aid_events * 25 + 30"},
}
