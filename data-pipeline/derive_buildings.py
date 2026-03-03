"""
derive_buildings.py
Computes building health (0-100) per tick for all buildings.
Also produces per-tick agent-in-building assignments for rendering.
"""

import json
import glob
import os
import sys

SIM_DIR    = os.path.join(os.path.dirname(__file__), "../frictionless-sim")
LAYOUT_DIR = os.path.dirname(__file__)
sys.path.insert(0, LAYOUT_DIR)
from world_layout import BUILDINGS, BUILDING_HEALTH_SOURCES

ALL_TICKS = list(range(15))

def load_market_state_per_tick():
    """Load all available market_state.json files, indexed by tick."""
    ms = {}
    for path in glob.glob(f"{SIM_DIR}/observations/tick_*/market_state.json"):
        tick = int(path.split("/")[-2].replace("tick_", ""))
        ms[tick] = json.load(open(path))
    return ms

def flatten_market(ms):
    """Flatten nested market_state dict for formula evaluation."""
    flat = {}
    def _walk(d, prefix=""):
        for k, v in d.items():
            key = f"{prefix}{k}" if prefix else k
            if isinstance(v, dict):
                _walk(v, key + ".")
            else:
                flat[key] = v
    if ms:
        _walk(ms)
    return flat

def get_agent_employment_at_tick(agents_raw, agent_id, tick):
    """Look up employment status for agent at given tick."""
    if agent_id not in agents_raw:
        return "unknown"
    history = agents_raw[agent_id].get("history", {})
    return history.get(str(tick), {}).get("employment_status", "unknown")

def compute_building_health(building, flat_ms, agents_raw, tick):
    """Compute health (0-100) for one building at one tick."""
    bid = building["id"]
    source = BUILDING_HEALTH_SOURCES.get(bid)

    if source is None:
        return 80  # default: healthy

    stype = source["type"]

    if stype == "constant":
        return source["value"]

    if stype == "sector_index":
        field = source["field"]
        val = flat_ms.get(field, 80)
        return min(100, max(0, float(val)))

    if stype == "derived":
        # Safe eval of formula using flat_ms values
        formula = source["formula"]
        # Build local namespace from flat_ms
        ns = {k.replace(".", "_"): v for k, v in flat_ms.items()}
        # Also add direct access
        ns.update(flat_ms)
        try:
            result = eval(formula, {"__builtins__": {"min": min, "max": max, "abs": abs}}, flat_ms)
            return min(100, max(0, float(result)))
        except Exception:
            # Try with dot-replaced names
            try:
                formula2 = formula.replace("car_ownership.", "car_ownership_").replace(
                    "spending.", "spending_").replace("community.", "community_").replace(
                    "auto_sector.", "auto_sector_")
                result = eval(formula2, {"__builtins__": {"min": min, "max": max}}, ns)
                return min(100, max(0, float(result)))
            except Exception as e:
                return 60  # fallback

    if stype == "agent_status":
        agent_id = source["agent"]
        emp = get_agent_employment_at_tick(agents_raw, agent_id, tick)
        if emp == "employed":
            return source.get("employed_value", 80)
        else:
            return source.get("unemployed_value", 20)

    if stype == "inverted":
        formula = source["formula"]
        try:
            result = eval(formula, {"__builtins__": {"min": min, "max": max}}, flat_ms)
            return min(100, max(0, float(result)))
        except Exception:
            return 50

    return 80

def health_to_visual_state(health):
    """Map health score to visual state string."""
    if health >= 80:
        return "thriving"
    elif health >= 60:
        return "stressed"
    elif health >= 40:
        return "declining"
    elif health >= 20:
        return "closing"
    else:
        return "closed"

def interpolate_market_state(ms_by_tick, tick):
    """For missing ticks, interpolate between nearest known ticks."""
    if tick in ms_by_tick:
        return ms_by_tick[tick]
    known = sorted(ms_by_tick.keys())
    before = [t for t in known if t < tick]
    after  = [t for t in known if t > tick]
    if before:
        return ms_by_tick[max(before)]
    if after:
        return ms_by_tick[min(after)]
    return {}

def compute_agents_in_building(buildings_by_id, agents_raw, tick):
    """
    For each building, return list of agents present at this tick.
    Employed agents are at their workplace.
    Transitioning agents are at community_center or high_school.
    Unemployed agents are at park or home (not in a building).
    """
    # Map building_id -> list of present agents
    presence = {b["id"]: [] for b in buildings_by_id.values()}

    from world_layout import AGENT_WORKPLACE

    for agent_id, agent in agents_raw.items():
        history = agent.get("history", {})
        snap = history.get(str(tick), {})
        emp = snap.get("employment_status", "employed")

        if emp == "employed":
            workplace = AGENT_WORKPLACE.get(agent_id)
            if workplace and workplace in presence:
                presence[workplace].append(agent_id)
        elif emp == "transitioning":
            # Retraining agents gravitate to community_center or high_school
            # Based on their transformations field
            transformations = agent.get("transformations", [])
            if any("ev" in str(t).lower() or "tech" in str(t).lower() for t in transformations):
                if "high_school" in presence:
                    presence["high_school"].append(agent_id)
            else:
                if "community_center" in presence:
                    presence["community_center"].append(agent_id)
        # unemployed: at park (separate logic in renderer)

    return presence

def derive_buildings(agents_raw_path, output_path):
    """Main: build building states per tick."""
    agents_raw = json.load(open(agents_raw_path))
    ms_by_tick = load_market_state_per_tick()

    buildings_by_id = {b["id"]: b for b in BUILDINGS}

    result = {
        "buildings": [],
        "ticks": {},
    }

    # Static building definitions
    for b in BUILDINGS:
        result["buildings"].append({
            "id":          b["id"],
            "label":       b["label"],
            "zone":        b["zone"],
            "tile":        b["tile"],
            "size":        b.get("size", "medium"),
            "sector":      b.get("sector", "unknown"),
            "occupants":   b.get("agents", []),
            "appears_tick": b.get("appears_tick", 0),
        })

    # Per-tick health states
    for tick in ALL_TICKS:
        ms = interpolate_market_state(ms_by_tick, tick)
        flat = flatten_market(ms)
        # Add derived rate fields
        if "employment" in ms:
            flat["employment_rate"] = ms["employment"].get("employment_rate", 1.0)

        tick_buildings = {}
        for b in BUILDINGS:
            # Skip informal market before it appears
            appears_at = b.get("appears_tick", 0)
            if tick < appears_at:
                health = 0
                visible = False
            else:
                health = compute_building_health(b, flat, agents_raw, tick)
                visible = True

            tick_buildings[b["id"]] = {
                "health":       round(health, 1),
                "visual_state": health_to_visual_state(health) if visible else "hidden",
                "visible":      visible,
            }

        # Also compute agent presence
        presence = compute_agents_in_building(buildings_by_id, agents_raw, tick)
        for bid, agents in presence.items():
            if bid in tick_buildings:
                tick_buildings[bid]["agents_present"] = agents

        result["ticks"][str(tick)] = tick_buildings

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✓ Wrote building data for {len(BUILDINGS)} buildings × {len(ALL_TICKS)} ticks")
    return result


if __name__ == "__main__":
    agents_path  = sys.argv[1] if len(sys.argv) > 1 else "../viz-data/agents_raw.json"
    output_path  = sys.argv[2] if len(sys.argv) > 2 else "../viz-data/buildings.json"
    derive_buildings(agents_path, output_path)
