"""
derive_history.py
Reconstructs per-tick agent state for all 30 agents.

Strategy:
- state.json = anchor at tick 14 (the final state)
- outcomes_tick_NNN.json = {savings_delta, stress_delta, employment_changed, narrative}
- Walk backwards from tick 14 to tick 0 using deltas
- Fill in employment status transitions using employment_changed events
- Output: dict keyed by (agent_id, tick) -> state snapshot
"""

import json
import glob
import os
import sys

SIM_DIR = os.path.join(os.path.dirname(__file__), "../frictionless-sim")
ALL_TICKS = list(range(15))   # 0..14

def load_agent(agent_id):
    """Load complete current state for one agent."""
    return json.load(open(f"{SIM_DIR}/agents/{agent_id}/state.json"))

def load_outcomes(agent_id):
    """Load all outcome files, return dict: tick -> outcome."""
    outcomes = {}
    for path in glob.glob(f"{SIM_DIR}/agents/{agent_id}/outcomes_tick_*.json"):
        tick = int(path.split("_")[-1].replace(".json", ""))
        raw = json.load(open(path))
        if isinstance(raw, list):
            raw = raw[0] if raw else {}
        outcomes[tick] = raw
    return outcomes

def load_reflections(agent_id):
    """Load reflections from memory.json."""
    try:
        m = json.load(open(f"{SIM_DIR}/agents/{agent_id}/memory.json"))
        return m.get("reflections", [])
    except:
        return []

def load_actions(agent_id):
    """Load action responses per tick."""
    actions = {}
    for path in glob.glob(f"{SIM_DIR}/agents/{agent_id}/actions/tick_*.json"):
        tick = int(path.split("/")[-1].replace("tick_", "").replace(".json", ""))
        raw = json.load(open(path))
        if isinstance(raw, list):
            raw = raw[0] if raw else {}
        # Extract the internal_assessment (the inner monologue)
        resp = raw.get("response", {})
        if isinstance(resp, str):
            actions[tick] = {"inner_monologue": resp[:400]}
        else:
            actions[tick] = {
                "inner_monologue": resp.get("internal_assessment", resp.get("narrative", ""))[:400],
                "action_text": resp.get("action_taken", resp.get("action", ""))[:300],
            }
    return actions

def reconstruct_employment_history(current_status, outcomes, all_ticks):
    """
    Forward reconstruction of employment_status per tick.
    employment_changed=True at tick T means status changed AT tick T.
    Infers initial status from number of transitions, then walks forward.
    """
    transition_ticks = sorted(
        tick for tick, o in outcomes.items() if o.get("employment_changed", False)
    )
    n = len(transition_ticks)
    if n == 0:
        return {tick: current_status for tick in all_ticks}
    # Infer tick-0 status
    if n % 2 == 1:
        initial = _flip_status(current_status)
    else:
        # Even changes -> same as current at end, but most agents START employed
        initial = "employed" if current_status == "unemployed" else current_status

    sim_status = initial
    trans_set  = set(transition_ticks)
    status     = {}
    for tick in sorted(all_ticks):
        if tick in trans_set:
            sim_status = _flip_status(sim_status)
        status[tick] = sim_status
    return status


def _flip_status(status):
    """Invert employment status."""
    return "unemployed" if status == "employed" else "employed"

def reconstruct_financial_history(current_savings, current_stress, outcomes, all_ticks):
    """
    Reconstruct savings and stress at each tick by walking backwards from tick 14.
    savings[t-1] = savings[t] - delta[t]
    """
    sorted_ticks_desc = sorted(outcomes.keys(), reverse=True)

    savings = {}
    stress = {}
    s_cur = current_savings
    st_cur = current_stress

    # Anchor at latest tick
    latest = max(outcomes.keys()) if outcomes else 14
    savings[latest] = current_savings
    stress[latest] = current_stress

    # Walk backwards through outcome ticks
    for i, tick in enumerate(sorted_ticks_desc):
        # Apply the delta for this tick backwards to get state at start of this tick
        delta_s = outcomes[tick].get("savings_delta", 0)
        delta_st = outcomes[tick].get("stress_delta", 0)

        # savings_delta = savings[tick] - savings[tick-1]
        # => savings[tick-1] = savings[tick] - savings_delta[tick]
        prev_tick = sorted_ticks_desc[i + 1] if i + 1 < len(sorted_ticks_desc) else None

        if prev_tick is not None:
            savings[prev_tick] = savings[tick] - delta_s
            stress[prev_tick] = round(stress[tick] - delta_st, 4)
        elif tick > 0:
            savings[tick - 1] = savings[tick] - delta_s
            stress[tick - 1] = round(stress[tick] - delta_st, 4)

    # Fill gaps with interpolation
    known_ticks = sorted(savings.keys())
    for tick in all_ticks:
        if tick not in savings:
            before = [t for t in known_ticks if t <= tick]
            after  = [t for t in known_ticks if t > tick]
            if before and after:
                t0, t1 = max(before), min(after)
                frac = (tick - t0) / (t1 - t0) if t1 != t0 else 0
                savings[tick] = int(savings[t0] + frac * (savings[t1] - savings[t0]))
                stress[tick]  = round(savings[t0] / max(savings[t0], 1) * stress[t0] + frac * (stress[t1] - stress[t0]), 4)
            elif before:
                savings[tick] = savings[max(before)]
                stress[tick]  = stress[max(before)]
            elif after:
                savings[tick] = savings[min(after)]
                stress[tick]  = stress[min(after)]

    return savings, stress

def derive_all_agents(output_path):
    """Main function: build per-tick state for all agents."""
    agent_index = json.load(open(f"{SIM_DIR}/agents/index.json"))

    result = {}

    for a in agent_index:
        agent_id = a["id"]
        print(f"  Processing {agent_id}...")

        state = load_agent(agent_id)
        outcomes = load_outcomes(agent_id)
        reflections = load_reflections(agent_id)
        actions = load_actions(agent_id)

        # --- Static identity fields (don't change tick-to-tick) ---
        identity = state["identity"]
        biases   = state["perception"]["cognitive_biases"]
        hier     = state["hierarchy"]

        # --- Reconstruct per-tick financials ---
        cur_savings = state["financial"]["savings"]
        cur_stress  = state["psychological"]["stress_level"]
        savings_h, stress_h = reconstruct_financial_history(
            cur_savings, cur_stress, outcomes, ALL_TICKS
        )

        # --- Reconstruct employment status history ---
        cur_emp = hier["L2_PARTICIPATE"]["employment_status"]
        emp_h = reconstruct_employment_history(cur_emp, outcomes, ALL_TICKS)

        # --- Build tick snapshots ---
        tick_snapshots = {}
        for tick in ALL_TICKS:
            snap = {
                "savings":           savings_h.get(tick, cur_savings),
                "stress":            max(0.0, min(1.0, stress_h.get(tick, cur_stress))),
                "employment_status": emp_h.get(tick, cur_emp),
            }
            if tick in outcomes:
                o = outcomes[tick]
                snap["outcome_narrative"] = o.get("narrative", "")[:300]
                snap["employment_changed"] = o.get("employment_changed", False)
            if tick in actions:
                snap["inner_monologue"]  = actions[tick].get("inner_monologue", "")
            tick_snapshots[str(tick)] = snap

        # --- Build reflections list ---
        reflection_list = []
        for r in reflections:
            tick = r.get("tick", r.get("created_at", r.get("timestamp", "?")))
            text = r.get("text", r.get("reflection", r.get("content", "")))
            if text:
                reflection_list.append({"tick": tick, "text": text})

        # --- Commitments ---
        commitments = state.get("commitments", [])
        total_committed_monthly = sum(
            c.get("monthly_cost", 0) for c in commitments
        )

        # --- In-progress transformations (latest only) ---
        transformations = state.get("in_progress_transformations", [])

        # --- Assemble agent record ---
        result[agent_id] = {
            # Identification
            "id":       agent_id,
            "name":     identity["name"],
            "age":      identity.get("age"),
            "role":     identity["role"],
            "tier":     identity["tier"],
            "sector":   identity["sector"],
            "archetype": state.get("archetype", "adapter"),
            "locality": state.get("locality", "millfield"),

            # Identity (static)
            "narrative":           identity.get("narrative", ""),
            "identity_attachment": identity.get("identity_attachment", 0.5),
            "dependents":          identity.get("dependents", 0),
            "skills":              identity.get("skills", []),
            "skill_relevance":     identity.get("skill_relevance", 0.5),
            "historical_conditioning": identity.get("historical_conditioning", []),

            # Psychology (current / tick 14)
            "grief_stage":         state["psychological"].get("grief_stage", "none"),
            "agency":              state["psychological"].get("agency", 0.5),
            "temporal_horizon":    state["psychological"].get("temporal_horizon_months", 6),
            "high_stress_ticks":   state["psychological"].get("high_stress_ticks", 0),
            "sentiment":           state["perception"].get("sentiment", "determined"),

            # Financial (current / tick 14)
            "savings":             state["financial"]["savings"],
            "monthly_income":      state["financial"]["monthly_income"],
            "monthly_expenses":    state["financial"]["monthly_expenses"],
            "debt_total":          state["financial"].get("debt_total", 0),
            "credit_score":        state["financial"].get("credit_score", 650),

            # Survival layer
            "runway_months":       hier["L0_SURVIVE"].get("runway_months", 0),
            "threat_level":        hier["L0_SURVIVE"].get("threat_level", 0),
            "monthly_essentials":  hier["L0_SURVIVE"].get("monthly_essentials", 0),
            "health_cost_from_stress": hier["L0_SURVIVE"].get("health_cost_from_stress", 0),

            # Participation
            "employment_status":   cur_emp,
            "role_security":       hier["L2_PARTICIPATE"].get("role_security", 0),
            "network_strength":    hier["L2_PARTICIPATE"].get("network_strength", 0),

            # Consumption (mobility signals)
            "owns_car":            hier["L3_CONSUME"].get("owns_car", False),
            "uses_robotaxi":       hier["L3_CONSUME"].get("uses_robotaxi", False),
            "substitution_willingness": hier["L3_CONSUME"].get("substitution_willingness", 0),
            "discretionary_budget": hier["L3_CONSUME"].get("discretionary_budget", 0),

            # Status / identity
            "status_anxiety":      hier["L4_SIGNAL"].get("status_anxiety", 0),
            "reference_group":     hier["L4_SIGNAL"].get("reference_group", ""),

            # Future orientation
            "future_orientation":  hier["L5_BUILD"].get("future_orientation", 0),
            "entrepreneurial_drive": hier["L5_BUILD"].get("entrepreneurial_drive", 0),

            # Community / meaning
            "meaning_source":      hier["L6_TRANSCEND"].get("meaning_source", ""),
            "purpose_stability":   hier["L6_TRANSCEND"].get("purpose_stability", 0),
            "community_ties":      hier["L6_TRANSCEND"].get("community_ties", 0),

            # Cognitive biases
            "biases": biases,

            # Temporal mismatch (structural trap indicators)
            "temporal_mismatches": state.get("temporal_mismatches", {}),

            # Commitments
            "commitments":                commitments,
            "total_committed_monthly":    total_committed_monthly,

            # In-progress transformations
            "transformations":            transformations,

            # Per-tick history (reconstructed)
            "history":            tick_snapshots,

            # Documentary layer
            "reflections":        reflection_list,
        }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"\n  ✓ Wrote {len(result)} agents to {output_path}")
    return result


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "../viz-data/agents_raw.json"
    derive_all_agents(out)
