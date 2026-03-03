"""
detect_phenomena.py
Auto-detects significant events from the market_state timeseries.
Produces phenomena list with tick, type, description, and visual hint.
"""

import json
import glob
import os
import sys

SIM_DIR = os.path.join(os.path.dirname(__file__), "../frictionless-sim")

ALL_TICKS = list(range(15))

def load_all_market_states():
    """Load all market state snapshots."""
    ms = {}
    for path in sorted(glob.glob(f"{SIM_DIR}/observations/tick_*/market_state.json")):
        tick = int(path.split("/")[-2].replace("tick_", ""))
        ms[tick] = json.load(open(path))
    return ms

def load_scenario_events():
    """Load canonical scenario events from config."""
    path = f"{SIM_DIR}/config/scenario.json"
    data = json.load(open(path))
    return data.get("events", [])

def load_all_agents():
    """Load current state for all agents."""
    agents = {}
    for path in glob.glob(f"{SIM_DIR}/agents/*/state.json"):
        agent_id = path.split("/")[-2]
        agents[agent_id] = json.load(open(path))
    return agents

def get(ms, *keys, default=None):
    """Safe nested get from market state."""
    d = ms
    for k in keys:
        if not isinstance(d, dict):
            return default
        d = d.get(k, default)
        if d is None:
            return default
    return d

def detect_phenomena(ms_by_tick, agents):
    """Run all detection rules and return sorted phenomena list."""
    phenomena = []
    sorted_ticks = sorted(ms_by_tick.keys())

    def add(tick, ptype, label, description, color, marker_shape="circle", severity=1):
        phenomena.append({
            "tick":          tick,
            "type":          ptype,
            "label":         label,
            "description":   description,
            "color":         color,
            "marker_shape":  marker_shape,
            "severity":      severity,  # 1=minor, 2=major, 3=critical
        })

    # ── Employment collapse: drop > 10pp in one tick ──────────────
    for i in range(1, len(sorted_ticks)):
        t_prev = sorted_ticks[i - 1]
        t_curr = sorted_ticks[i]
        emp_prev = get(ms_by_tick[t_prev], "employment", "employment_rate", default=1.0)
        emp_curr = get(ms_by_tick[t_curr], "employment", "employment_rate", default=1.0)
        drop = emp_prev - emp_curr
        if drop >= 0.10:
            add(t_curr, "employment_collapse",
                f"Mass Job Loss (−{drop:.0%})",
                f"Employment dropped from {emp_prev:.0%} to {emp_curr:.0%} in one tick. "
                f"{get(ms_by_tick[t_curr], 'employment', 'employed', default=0)} of 30 still employed.",
                "#e53e3e", "triangle_down", 3)

    # ── Spending collapse: drop > 20pp in one tick ────────────────
    for i in range(1, len(sorted_ticks)):
        t_prev = sorted_ticks[i - 1]
        t_curr = sorted_ticks[i]
        sp_prev = get(ms_by_tick[t_prev], "spending", "spending_index", default=100)
        sp_curr = get(ms_by_tick[t_curr], "spending", "spending_index", default=100)
        if sp_prev and sp_curr and (sp_prev - sp_curr) >= 20:
            add(t_curr, "spending_collapse",
                f"Spending Cliff (−{sp_prev - sp_curr}pts)",
                f"Consumer spending dropped from {sp_prev}% to {sp_curr}% of baseline. "
                f"Local multiplier effect collapses.",
                "#dd6b20", "triangle_down", 3)

    # ── Herd retraining: >= 8 enrollments in one tick ────────────
    for tick in sorted_ticks:
        enroll = get(ms_by_tick[tick], "community", "retraining_enrollments", default=0)
        if enroll >= 8:
            add(tick, "herd_retraining",
                f"Retraining Wave ({enroll} enrolled)",
                f"{enroll} people enrolled in retraining simultaneously — "
                f"herd behavior as agents respond to the same signal.",
                "#d69e2e", "circle", 2)

    # ── Informal market emergence: first mutual_aid_events > 0 ───
    for tick in sorted_ticks:
        aid = get(ms_by_tick[tick], "community", "mutual_aid_events", default=0)
        if aid and aid > 0:
            add(tick, "informal_emergence",
                "Informal Economy Born",
                f"First mutual aid transaction recorded. "
                f"Millfield's informal economy materializes outside the market.",
                "#805ad5", "star", 2)
            break  # only first occurrence

    # ── Protest wave: >= 5 protests ────────────────────────────────
    for tick in sorted_ticks:
        protests = get(ms_by_tick[tick], "community", "protests", default=0)
        if protests and protests >= 5:
            add(tick, "protest_wave",
                f"Protest Wave ({protests} events)",
                f"{protests} protest events recorded. Community anger becomes visible.",
                "#e53e3e", "exclamation", 2)

    # ── Gini threshold crossings ───────────────────────────────────
    thresholds = [0.35, 0.50, 0.60]
    crossed = set()
    for tick in sorted_ticks:
        gini = get(ms_by_tick[tick], "inequality", "gini_coefficient", default=0)
        if gini:
            for threshold in thresholds:
                if gini >= threshold and threshold not in crossed:
                    crossed.add(threshold)
                    add(tick, "gini_breach",
                        f"Inequality Milestone (Gini {gini:.3f})",
                        f"Gini coefficient crossed {threshold:.2f}. "
                        f"Wealth gap now {'severe' if threshold >= 0.5 else 'significant'}.",
                        "#9b2335", "diamond", 2 if threshold >= 0.5 else 1)

    # ── Robotaxi adoption milestones ──────────────────────────────
    rt_milestones = [0.03, 0.07, 0.10]
    rt_crossed = set()
    for tick in sorted_ticks:
        rt = get(ms_by_tick[tick], "car_ownership", "robotaxi_adoption_rate", default=0)
        if rt:
            for milestone in rt_milestones:
                if rt >= milestone and milestone not in rt_crossed:
                    rt_crossed.add(milestone)
                    add(tick, "robotaxi_milestone",
                        f"RoboRide {rt:.0%} Adoption",
                        f"Robotaxi adoption hits {milestone:.0%}. "
                        f"{get(ms_by_tick[tick], 'car_ownership', 'total_owners', default=0)} cars remain.",
                        "#3182ce", "circle", 1)

    # ── Car ownership crash: loss > 5 cars in one tick ────────────
    for i in range(1, len(sorted_ticks)):
        t_prev = sorted_ticks[i - 1]
        t_curr = sorted_ticks[i]
        cars_prev = get(ms_by_tick[t_prev], "car_ownership", "total_owners", default=28)
        cars_curr = get(ms_by_tick[t_curr], "car_ownership", "total_owners", default=28)
        ditched = get(ms_by_tick[t_curr], "car_ownership", "cars_ditched_this_tick", default=0)
        if ditched and ditched >= 2:
            add(t_curr, "car_abandonment",
                f"{ditched} Cars Abandoned",
                f"{ditched} people surrendered their cars this tick. "
                f"Car ownership now {cars_curr}/{cars_prev} ({cars_curr/28:.0%} of baseline).",
                "#718096", "circle", 1)

    # ── Runway crisis: look at final tick agent states ────────────
    at_zero = [a for a in agents.values()
               if a["hierarchy"]["L0_SURVIVE"].get("runway_months", 99) < 1.0]
    if at_zero:
        add(14, "runway_crisis",
            f"{len(at_zero)} Agents Financially Critical",
            f"{len(at_zero)} people have less than 1 month of savings runway: "
            f"{', '.join(a['identity']['name'] for a in at_zero[:4])}{'...' if len(at_zero) > 4 else ''}.",
            "#e53e3e", "pulse", 3)

    # ── Depression cluster (emotional state) ──────────────────────
    depression_agents = [a for a in agents.values()
                         if a["psychological"].get("grief_stage") == "depression"]
    if depression_agents:
        # Find approx tick when depression first appeared — use stress inflection
        add(9, "depression_cluster",
            f"Grief Cluster: {len(depression_agents)} in Depression",
            f"By tick 14: {', '.join(a['identity']['name'] for a in depression_agents)} "
            f"are in depression stage. The economic collapse is becoming psychological.",
            "#553c9a", "circle", 2)

    # Sort by tick, then severity
    phenomena.sort(key=lambda p: (p["tick"], -p["severity"]))
    return phenomena

def load_scenario_markers(scenario_events):
    """Convert scenario events to timeline markers."""
    markers = []
    type_to_color = {
        "baseline":              "#718096",
        "capability_announcement": "#3182ce",
        "capability_deployment":   "#2b6cb0",
        "capability_improvement":  "#2c5282",
        "capability_maturation":   "#1a365d",
    }
    type_to_label = {
        "baseline":              "Baseline",
        "capability_announcement": "RoboRide Announces",
        "capability_deployment":   "RoboRide Launches",
        "capability_improvement":  "Price Drop + Coverage Expand",
        "capability_maturation":   "Full Market Coverage",
    }
    for event in scenario_events:
        markers.append({
            "tick":     event["tick"],
            "type":     "scenario_event",
            "subtype":  event["type"],
            "label":    type_to_label.get(event["type"], event["type"]),
            "description": event["fact"],
            "color":    type_to_color.get(event["type"], "#718096"),
            "marker_shape": "pin",
            "severity": 3,
        })
    return markers

def derive_phenomena(output_path):
    """Main: detect all phenomena and write to JSON."""
    ms_by_tick = load_all_market_states()
    agents = load_all_agents()
    scenario_events = load_scenario_events()

    phenomena = detect_phenomena(ms_by_tick, agents)
    scenario_markers = load_scenario_markers(scenario_events)

    # Build market state timeseries (compact) for the dashboard
    timeseries = {}
    for tick in ALL_TICKS:
        if tick in ms_by_tick:
            ms = ms_by_tick[tick]
            timeseries[str(tick)] = {
                "employment_rate":        ms.get("employment", {}).get("employment_rate", None),
                "employed_count":         ms.get("employment", {}).get("employed", None),
                "spending_index":         ms.get("spending", {}).get("spending_index", None),
                "car_ownership_rate":     ms.get("car_ownership", {}).get("ownership_rate", None),
                "total_cars":             ms.get("car_ownership", {}).get("total_owners", None),
                "cars_ditched":           ms.get("car_ownership", {}).get("cars_ditched_this_tick", 0),
                "robotaxi_rate":          ms.get("car_ownership", {}).get("robotaxi_adoption_rate", 0),
                "robotaxi_adopters":      ms.get("car_ownership", {}).get("robotaxi_adopters", 0),
                "gini":                   ms.get("inequality", {}).get("gini_coefficient", None),
                "total_community_income": ms.get("inequality", {}).get("total_community_income", None),
                "protests":               ms.get("community", {}).get("protests", 0),
                "retraining_enrollments": ms.get("community", {}).get("retraining_enrollments", 0),
                "mutual_aid_events":      ms.get("community", {}).get("mutual_aid_events", 0),
                "policy_proposals":       len(ms.get("community", {}).get("policy_proposals", [])),
                "dealership_index":       ms.get("auto_sector", {}).get("dealership_revenue_index", None),
                "insurance_policies":     ms.get("auto_sector", {}).get("insurance_policies_active", None),
                "mechanic_index":         ms.get("auto_sector", {}).get("mechanic_demand_index", None),
                "gas_station_index":      ms.get("auto_sector", {}).get("gas_station_revenue_index", None),
                "auto_lending_index":     ms.get("auto_sector", {}).get("auto_lending_volume_index", None),
                "total_spending":         ms.get("spending", {}).get("total_consumer_spending", None),
                "has_data":               True,
                "interpolated":           False,
            }
        else:
            # Mark missing ticks
            # Interpolate between adjacent ticks
            before_ticks = [t for t in ms_by_tick if t < tick]
            after_ticks  = [t for t in ms_by_tick if t > tick]
            if before_ticks and after_ticks:
                t0 = max(before_ticks)
                t1 = min(after_ticks)
                ms0 = ms_by_tick[t0]
                ms1 = ms_by_tick[t1]
                frac = (tick - t0) / (t1 - t0)
                def lerp(a, b):
                    if a is None or b is None:
                        return a or b
                    return round(a + frac * (b - a), 4)
                timeseries[str(tick)] = {
                    "employment_rate":    lerp(ms0.get("employment",{}).get("employment_rate"),
                                               ms1.get("employment",{}).get("employment_rate")),
                    "spending_index":     lerp(ms0.get("spending",{}).get("spending_index"),
                                               ms1.get("spending",{}).get("spending_index")),
                    "car_ownership_rate": lerp(ms0.get("car_ownership",{}).get("ownership_rate"),
                                               ms1.get("car_ownership",{}).get("ownership_rate")),
                    "gini":              lerp(ms0.get("inequality",{}).get("gini_coefficient"),
                                              ms1.get("inequality",{}).get("gini_coefficient")),
                    "has_data":           False,
                    "interpolated":       True,
                }

    result = {
        "phenomena":       phenomena,
        "scenario_events": scenario_markers,
        "timeseries":      timeseries,
        "summary": {
            "total_ticks":         14,
            "ticks_with_data":     len(ms_by_tick),
            "missing_ticks":       [t for t in range(15) if t not in ms_by_tick],
            "phenomenon_count":    len(phenomena),
            "total_markers":       len(phenomena) + len(scenario_markers),
        },
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✓ Detected {len(phenomena)} phenomena, {len(scenario_markers)} scenario events")
    print(f"  ✓ Wrote to {output_path}")
    return result


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "../viz-data/phenomena.json"
    derive_phenomena(out)
