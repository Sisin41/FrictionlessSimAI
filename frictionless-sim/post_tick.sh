#!/bin/bash
# post_tick.sh — Phases 3-5: Resolve, Update, Observe
# Computes market reality from agent actions (not scripted)
# Generates bulletin for next tick's inboxes
# Writes outcomes to memory so agents learn
#
# Usage: bash post_tick.sh <tick_number>
set -e
SIM_DIR="$(cd "$(dirname "$0")" && pwd)"
TICK=${1:-0}
TICK_PAD=$(printf "%03d" "$TICK")

echo ""
echo "═══════════════════════════════════════════════"
echo "  POST-TICK $TICK — Resolve & Compute"
echo "═══════════════════════════════════════════════"

python3 - "$SIM_DIR" "$TICK" << 'PYEOF'
import json, os, sys, glob, re
from pathlib import Path

sim = sys.argv[1]
tick = int(sys.argv[2])
tick_pad = f"{tick:03d}"

agents = json.loads(open(f"{sim}/agents/index.json").read())
prev_market = json.loads(open(f"{sim}/world/market_state.json").read())

# ─── 1. Collect all actions ─────────────────────────────────
print("  1. Collecting actions...")
all_actions = {}
missing = []
for a in agents:
    path = f"{sim}/agents/{a['id']}/actions/tick_{tick_pad}.json"
    if os.path.exists(path):
        all_actions[a["id"]] = json.loads(open(path).read())
    else:
        missing.append(a["id"])
print(f"     {len(all_actions)}/{len(agents)} decisions. Missing: {len(missing)}")

# ─── 2. Resolve transactions ────────────────────────────────
print("  2. Resolving transactions...")
pending_dir = f"{sim}/transactions/pending"
resolved_dir = f"{sim}/transactions/resolved/tick_{tick_pad}"
os.makedirs(resolved_dir, exist_ok=True)
os.makedirs(pending_dir, exist_ok=True)

resolved_txns = []
for fp in glob.glob(f"{pending_dir}/*.json"):
    tx = json.loads(open(fp).read())
    target = tx.get("target", "")
    target_exists = os.path.exists(f"{sim}/agents/{target}/state.json")
    
    if target_exists:
        # Rule-based resolution (Spec 12.2)
        target_state = json.loads(open(f"{sim}/agents/{target}/state.json").read())
        target_stress = target_state["psychological"]["stress_level"]
        
        # Auto-reject if target is in SURVIVE mode (too stressed to engage)
        if target_stress > 0.8:
            tx["status"] = "rejected"
            tx["reason"] = "Target too stressed to engage"
        # Auto-accept transfers (giving, not taking)
        elif tx.get("type") == "TRANSFER":
            tx["status"] = "accepted"
        # Accept exchanges/commitments if target has capacity
        else:
            tx["status"] = "accepted"
    else:
        tx["status"] = "no_counterparty"
    
    with open(f"{resolved_dir}/{os.path.basename(fp)}", "w") as f:
        json.dump(tx, f, indent=2)
    os.remove(fp)
    resolved_txns.append(tx)

print(f"     {sum(1 for t in resolved_txns if t['status']=='accepted')} accepted, "
      f"{sum(1 for t in resolved_txns if t['status']!='accepted')} rejected/failed")

# ─── 3. Scan actions for economic events ─────────────────────
print("  3. Scanning for economic events...")

# Track changes
layoffs = []
hirings = []
closures = []
new_businesses = []
car_sales = []  # people selling their car
car_ditches = []  # people stopping car ownership
robotaxi_switches = []
protests = []
retraining = []
policy_proposals = []
mutual_aid = []

for aid, record in all_actions.items():
    resp = record.get("response", {})
    agent_name = record.get("agent_name", aid)
    agent_info = next((a for a in agents if a["id"] == aid), {})
    
    for action in resp.get("chosen_actions", []):
        atype = action.get("type", "")
        desc = (action.get("description", "") or "").lower()
        target = action.get("target_agent")
        resources = action.get("resources_involved", "")
        
        # Detect layoffs (check economic_effects OR keywords)
        econ = action.get("economic_effects", {})
        if econ.get("employment_change") == "fired" or any(w in desc for w in ["lay off", "layoff", "fire", "let go", "terminate", "cut staff", "downsize", "laid off"]):
            layoffs.append({"by": aid, "by_name": agent_name, "target": target, "description": desc})
        
        # Detect closures
        if econ.get("asset_change") == "closed_business" or any(w in desc for w in ["close", "shut down", "bankrupt", "going out of business", "shutting"]):
            closures.append({"agent": aid, "name": agent_name, "description": desc})
        
        # Detect new businesses
        if econ.get("asset_change") == "started_business" or (atype == "ASSOCIATION" and any(w in desc for w in ["start business", "launch", "founded", "open", "co-op", "cooperative"])):
            new_businesses.append({"agent": aid, "name": agent_name, "description": desc})
        
        # Detect car sales / ditching (check economic_effects OR description keywords)
        econ = action.get("economic_effects", {})
        if econ.get("asset_change") == "sold_car" or ("sell" in desc and "car" in desc) or ("sold" in desc and "car" in desc) or ("ditch" in desc and "car" in desc) or ("gave up" in desc and "car" in desc):
            car_ditches.append(aid)
        
        # Detect robotaxi adoption (must have action verb, not just mentioning it)
        if any(w in desc for w in ["robotaxi", "roboride", "autonomous ride"]):
            if econ.get("asset_change") == "sold_car" or econ.get("expense_change", 0) < -100 or any(v in desc for v in ["switch to", "signed up", "start using", "adopted", "commute via", "using robotaxi", "use robotaxi"]):
                robotaxi_switches.append(aid)
            robotaxi_switches.append(aid)
        
        # Detect protests
        if any(w in desc for w in ["protest", "rally", "march", "strike", "petition", "demonstrate"]):
            protests.append({"agent": aid, "name": agent_name, "description": desc})
        
        # Detect retraining
        if atype == "TRANSFORMATION" and any(w in desc for w in ["retrain", "learn", "study", "course", "skill", "certification"]):
            retraining.append({"agent": aid, "name": agent_name, "description": desc})
        
        # Detect policy proposals (from council/policy agents)
        if agent_info.get("sector") == "policy" and atype == "SIGNAL":
            policy_proposals.append({"agent": aid, "name": agent_name, "description": desc})
        
        # Detect mutual aid / informal economy
        if any(w in desc for w in ["barter", "mutual aid", "share", "favor", "help each other", "trade service"]):
            mutual_aid.append({"agent": aid, "name": agent_name, "description": desc})
        
        # Detect hirings
        if any(w in desc for w in ["hire", "new job", "accepted position", "got hired", "employed"]):
            hirings.append({"agent": aid if not target else target, "name": agent_name, "description": desc})

# ─── 4. Update agent states ─────────────────────────────────
print("  4. Updating states...")

for aid, record in all_actions.items():
    state = json.loads(open(f"{sim}/agents/{aid}/state.json").read())
    old_state = json.loads(json.dumps(state))  # deep copy for outcome comparison
    resp = record.get("response", {})
    agent_info = next((a for a in agents if a["id"] == aid), {})
    
    # Archetype
    state["archetype"] = resp.get("archetype_self_assessment", state.get("archetype", "stable"))
    
    # Emotion → stress/agency
    emotion = resp.get("emotional_state", "neutral")
    stress_d = {"hopeful": -0.05, "excited": -0.05, "relieved": -0.03, "determined": -0.02,
                "anxious": 0.05, "angry": 0.07, "resigned": 0.03, "numb": 0.04}.get(emotion, 0)
    state["psychological"]["stress_level"] = round(max(0, min(1, state["psychological"]["stress_level"] + stress_d)), 3)
    
    if emotion in ("hopeful", "excited", "determined"):
        state["psychological"]["agency"] = round(min(1, state["psychological"]["agency"] + 0.02), 3)
    elif emotion in ("resigned", "numb"):
        state["psychological"]["agency"] = round(max(0, state["psychological"]["agency"] - 0.03), 3)
    
    # Temporal horizon
    stress = state["psychological"]["stress_level"]
    state["psychological"]["temporal_horizon_months"] = max(1, int(12 * (1 - stress * 0.7)))
    
    # Process specific actions
    for action in resp.get("chosen_actions", []):
        desc = (action.get("description", "") or "").lower()
        atype = action.get("type", "")
        target = action.get("target_agent")
        
        # Retraining → track in-progress transformation (§9.2)
        if atype == "TRANSFORMATION" and any(w in desc for w in ["retrain", "learn", "study", "course", "skill"]):
            # Check if already in-progress
            transformations = state.get("in_progress_transformations", [])
            existing = [t for t in transformations if t.get("type") == "retraining"]
            if existing:
                # Advance existing transformation
                existing[0]["progress"] = min(1.0, existing[0]["progress"] + 0.1)
                existing[0]["months_invested"] = existing[0].get("months_invested", 0) + 1
                if existing[0]["progress"] >= 1.0:
                    # Completed! Big skill bump
                    state["hierarchy"]["L2_PARTICIPATE"]["skill_relevance"] = round(
                        min(1, state["hierarchy"]["L2_PARTICIPATE"]["skill_relevance"] + 0.15), 2)
                    transformations.remove(existing[0])
                else:
                    # Incremental skill improvement while learning
                    state["hierarchy"]["L2_PARTICIPATE"]["skill_relevance"] = round(
                        min(1, state["hierarchy"]["L2_PARTICIPATE"]["skill_relevance"] + 0.03), 2)
            else:
                # Start new transformation (6-12 month ETA depending on age)
                age = state["identity"].get("age", 35)
                eta = 8 if age < 40 else 10 if age < 55 else 14
                transformations.append({
                    "type": "retraining",
                    "description": desc,
                    "started_tick": tick,
                    "completion_eta_months": eta,
                    "progress": round(1.0 / eta, 2),
                    "months_invested": 1
                })
                state["hierarchy"]["L2_PARTICIPATE"]["skill_relevance"] = round(
                    min(1, state["hierarchy"]["L2_PARTICIPATE"]["skill_relevance"] + 0.02), 2)
            state["in_progress_transformations"] = transformations
        
        # Quit/fired/laid off
        if any(w in desc for w in ["quit", "resign", "laid off", "fired", "lost job", "let go"]):
            state["hierarchy"]["L2_PARTICIPATE"]["employment_status"] = "unemployed"
            state["financial"]["monthly_income"] = 0
        
        # Got hired
        if any(w in desc for w in ["new job", "got hired", "accepted position", "started working"]):
            state["hierarchy"]["L2_PARTICIPATE"]["employment_status"] = "employed"
        
        # Started business
        if atype == "ASSOCIATION" and any(w in desc for w in ["start business", "launch", "founded"]):
            state["hierarchy"]["L5_BUILD"]["entrepreneurial_drive"] = round(
                min(1, state["hierarchy"]["L5_BUILD"]["entrepreneurial_drive"] + 0.1), 2)
        
        # Ditched car (check economic_effects first, then keywords)
        econ = action.get("economic_effects", {})
        if econ.get("asset_change") == "sold_car" or ("sell" in desc and "car" in desc) or ("sold" in desc and "car" in desc) or ("ditch" in desc and "car" in desc):
            state["hierarchy"]["L3_CONSUME"]["owns_car"] = False
            state["hierarchy"]["L3_CONSUME"]["car_payment_monthly"] = 0
        
        # Switched to robotaxi (must be an active adoption, not just mentioning)
        if any(w in desc for w in ["robotaxi", "roboride"]):
            if econ.get("asset_change") == "sold_car" or any(v in desc for v in ["switch to", "signed up", "start using", "adopted", "commute via", "using robotaxi", "use robotaxi"]):
                state["hierarchy"]["L3_CONSUME"]["uses_robotaxi"] = True
        
        # Protest → grief stage
        if any(w in desc for w in ["protest", "rally", "march"]):
            state["psychological"]["grief_stage"] = "anger"
    
    # Was this agent laid off BY someone else?
    for layoff in layoffs:
        if layoff.get("target") == aid:
            state["hierarchy"]["L2_PARTICIPATE"]["employment_status"] = "unemployed"
            state["financial"]["monthly_income"] = 0
            state["psychological"]["grief_stage"] = "denial"
            state["psychological"]["stress_level"] = min(1, state["psychological"]["stress_level"] + 0.2)
    
    # ── Sector income linkage ──
    # Agent income tracks sector health (the transmission mechanism)
    sector = agent_info.get("sector", "")
    if state["hierarchy"]["L2_PARTICIPATE"]["employment_status"] == "employed":
        auto_idx = prev_market.get("auto_sector", {}).get("dealership_revenue_index", 100) / 100
        if sector in ("retail_auto",):
            state["financial"]["monthly_income"] = round(old_state["financial"]["monthly_income"] * max(0.3, auto_idx))
        elif sector in ("insurance",):
            ins_ratio = prev_market.get("auto_sector", {}).get("insurance_policies_active", 30) / 30
            state["financial"]["monthly_income"] = round(old_state["financial"]["monthly_income"] * max(0.3, ins_ratio))
        elif sector in ("fuel",):
            gas_idx = prev_market.get("auto_sector", {}).get("gas_station_revenue_index", 100) / 100
            state["financial"]["monthly_income"] = round(old_state["financial"]["monthly_income"] * max(0.3, gas_idx))
        elif sector in ("finance",):
            lend_idx = prev_market.get("auto_sector", {}).get("auto_lending_volume_index", 100) / 100
            state["financial"]["monthly_income"] = round(old_state["financial"]["monthly_income"] * max(0.5, lend_idx))
    
    # Monthly financial burn
    gap = state["financial"]["monthly_expenses"] - state["financial"]["monthly_income"]
    if gap > 0:
        state["financial"]["savings"] = max(0, state["financial"]["savings"] - gap)
    else:
        state["financial"]["savings"] += int(abs(gap) * 0.5)
    
    # Runway + threat
    expenses = max(1, state["financial"]["monthly_expenses"])
    state["hierarchy"]["L0_SURVIVE"]["runway_months"] = round(state["financial"]["savings"] / expenses, 1)
    state["hierarchy"]["L0_SURVIVE"]["threat_level"] = round(max(0, min(1, 1 - state["hierarchy"]["L0_SURVIVE"]["runway_months"] / 12)), 2)
    
    # Grief progression
    grief = state["psychological"]["grief_stage"]
    if grief != "none" and tick % 2 == 0:
        prog = {"denial": "anger", "anger": "bargaining", "bargaining": "depression", "depression": "acceptance", "acceptance": "none"}
        state["psychological"]["grief_stage"] = prog.get(grief, grief)
    
    # Chronic stress → health costs (§11.1)
    # Sustained high stress increases SURVIVE costs (medical, substance, etc.)
    chronic_ticks = state["psychological"].get("high_stress_ticks", 0)
    if stress > 0.6:
        chronic_ticks += 1
    else:
        chronic_ticks = max(0, chronic_ticks - 1)
    state["psychological"]["high_stress_ticks"] = chronic_ticks
    
    if chronic_ticks >= 3:
        # After 3+ months of high stress: health costs increase
        health_cost = int(state["financial"]["monthly_expenses"] * 0.05 * min(chronic_ticks - 2, 4))
        state["financial"]["monthly_expenses"] += health_cost
        state["hierarchy"]["L0_SURVIVE"]["health_cost_from_stress"] = health_cost
    else:
        state["hierarchy"]["L0_SURVIVE"]["health_cost_from_stress"] = 0
    
    state["perception"]["sentiment"] = emotion
    state["tick_updated"] = tick
    
    with open(f"{sim}/agents/{aid}/state.json", "w") as f:
        json.dump(state, f, indent=2)
    
    # ── 4b. Write outcome to memory ──
    action_desc = resp.get("chosen_actions", [{}])[0].get("description", "routine")
    savings_delta = state["financial"]["savings"] - old_state["financial"]["savings"]
    emp_changed = state["hierarchy"]["L2_PARTICIPATE"]["employment_status"] != old_state["hierarchy"]["L2_PARTICIPATE"]["employment_status"]
    
    outcome = {
        "tick": tick,
        "action": action_desc,
        "savings_delta": savings_delta,
        "stress_delta": round(state["psychological"]["stress_level"] - old_state["psychological"]["stress_level"], 3),
        "employment_changed": emp_changed,
        "narrative": f"You {action_desc}. "
    }
    if savings_delta > 0:
        outcome["narrative"] += f"Savings grew by ${savings_delta:,}. "
    elif savings_delta < 0:
        outcome["narrative"] += f"Savings dropped by ${abs(savings_delta):,}. "
    if emp_changed:
        outcome["narrative"] += f"Employment status changed to {state['hierarchy']['L2_PARTICIPATE']['employment_status']}. "
    
    # Write to memory outcomes + update past_actions
    mem = json.loads(open(f"{sim}/agents/{aid}/memory.json").read())
    mem["past_actions"].append({"tick": tick, "summary": action_desc, "emotional_state": emotion})
    mem["past_outcomes"].append(outcome)
    with open(f"{sim}/agents/{aid}/memory.json", "w") as f:
        json.dump(mem, f, indent=2)
    
    # Write outcome file for next tick's inbox
    outcomes_path = f"{sim}/agents/{aid}/outcomes_tick_{tick_pad}.json"
    with open(outcomes_path, "w") as f:
        json.dump([outcome], f, indent=2)

print(f"     {len(all_actions)} states updated, outcomes written to memory.")

# ─── 5. Compute market state from ACTUAL agent data ─────────
print("  5. Computing market state...")

total = len(agents)
car_owners = 0
robotaxi_users = 0
employed = 0
unemployed = 0
total_income = 0
total_spending = 0
incomes = []

for a in agents:
    s = json.loads(open(f"{sim}/agents/{a['id']}/state.json").read())
    if s["hierarchy"]["L3_CONSUME"].get("owns_car", False):
        car_owners += 1
    if s["hierarchy"]["L3_CONSUME"].get("uses_robotaxi", False):
        robotaxi_users += 1
    emp_status = s["hierarchy"]["L2_PARTICIPATE"]["employment_status"]
    if emp_status == "employed":
        employed += 1
    else:
        unemployed += 1
    inc = s["financial"]["monthly_income"]
    total_income += inc
    total_spending += min(inc, s["financial"]["monthly_expenses"])
    incomes.append(inc)

# Gini
incomes_sorted = sorted(incomes)
n = len(incomes_sorted)
gini = 0
if n > 0 and sum(incomes_sorted) > 0:
    for i, x in enumerate(incomes_sorted):
        gini += (2 * (i + 1) - n - 1) * x
    gini = round(abs(gini) / (n * sum(incomes_sorted)), 3)

# Baselines: preserve tick-0 values, never drift
baseline_spending = prev_market.get("spending", {}).get("spending_baseline", total_spending)
if baseline_spending == 0:
    baseline_spending = total_spending

# For car baseline, use a stored field that stays constant
baseline_owners = prev_market.get("car_ownership", {}).get("baseline_owners", 
    prev_market.get("car_ownership", {}).get("total_owners", car_owners))
if baseline_owners == 0:
    baseline_owners = car_owners

# Auto sector indices derived from actual ownership/adoption
ownership_ratio = car_owners / max(1, baseline_owners)
market_state = {
    "tick": tick,
    "car_ownership": {
        "total_owners": car_owners,
        "baseline_owners": baseline_owners,
        "ownership_rate": round(car_owners / total, 2),
        "cars_ditched_this_tick": len(car_ditches),
        "robotaxi_adopters": robotaxi_users,
        "robotaxi_adoption_rate": round(robotaxi_users / total, 2)
    },
    "employment": {
        "employed": employed,
        "unemployed": unemployed,
        "employment_rate": round(employed / total, 2),
        "layoffs_this_tick": [l["by_name"] + ": " + l["description"] for l in layoffs],
        "hirings_this_tick": [h["description"] for h in hirings],
        "new_businesses_this_tick": [b["description"] for b in new_businesses]
    },
    "spending": {
        "total_consumer_spending": total_spending,
        "spending_baseline": baseline_spending,
        "spending_index": round(total_spending / max(1, baseline_spending) * 100)
    },
    "auto_sector": {
        "dealership_revenue_index": round(ownership_ratio * 100),
        "insurance_policies_active": car_owners,
        "mechanic_demand_index": round(ownership_ratio * 100),
        "gas_station_revenue_index": round(ownership_ratio * 100),
        "auto_lending_volume_index": round(ownership_ratio * 100)
    },
    "community": {
        "protests": len(protests),
        "mutual_aid_events": len(mutual_aid),
        "new_organizations": len(new_businesses),
        "retraining_enrollments": len(retraining),
        "policy_proposals": [p["description"] for p in policy_proposals]
    },
    "inequality": {
        "gini_coefficient": gini,
        "total_community_income": total_income
    },
    "computed_from": "agent_actions"
}

with open(f"{sim}/world/market_state.json", "w") as f:
    json.dump(market_state, f, indent=2)
print(f"     Market: {car_owners} car owners, {robotaxi_users} robotaxi users, "
      f"{employed} employed, spending index {market_state['spending']['spending_index']}")

# ─── 6. Generate bulletin for next tick ──────────────────────
print("  6. Generating bulletin...")
bulletin_events = []

for l in layoffs:
    bulletin_events.append({
        "type": "layoff", "source_agent": l["by"], "sector": "retail_auto",
        "visibility": "local_news" if len(layoffs) >= 2 else "sector",
        "description": f"{l['by_name']} laid off workers: {l['description']}"
    })

for c in closures:
    bulletin_events.append({
        "type": "closure", "source_agent": c["agent"], "sector": "retail_auto",
        "visibility": "local_news",
        "description": f"Business closing: {c['name']} — {c['description']}"
    })

for b in new_businesses:
    bulletin_events.append({
        "type": "new_business", "source_agent": b["agent"], "sector": "new_economy",
        "visibility": "local_news",
        "description": f"New venture: {b['name']} — {b['description']}"
    })

for p in protests:
    bulletin_events.append({
        "type": "protest", "source_agent": p["agent"], "sector": "community",
        "visibility": "local_news",
        "description": f"Community action: {p['name']} — {p['description']}"
    })

for pp in policy_proposals:
    bulletin_events.append({
        "type": "policy", "source_agent": pp["agent"], "sector": "policy",
        "visibility": "local_news",
        "description": f"Policy proposal: {pp['name']} — {pp['description']}"
    })

if len(retraining) >= 3:
    bulletin_events.append({
        "type": "trend", "source_agent": "", "sector": "education",
        "visibility": "local_news",
        "description": f"{len(retraining)} people enrolled in retraining this month."
    })

if len(car_ditches) >= 2:
    bulletin_events.append({
        "type": "trend", "source_agent": "", "sector": "retail_auto",
        "visibility": "local_news",
        "description": f"Noticeable trend: {len(car_ditches)} people sold or stopped using their cars this month."
    })

with open(f"{sim}/world/bulletin_tick_{tick_pad}.json", "w") as f:
    json.dump({"tick": tick, "events": bulletin_events}, f, indent=2)
print(f"     Bulletin: {len(bulletin_events)} events promoted")

# ─── 7. Update locality ─────────────────────────────────────
try:
    loc = json.loads(open(f"{sim}/localities/millfield.json").read())
    loc["unemployment_rate"] = round(unemployed / total, 3)
    loc["gini_coefficient"] = gini
    loc["total_income"] = total_income
    loc["disrupted_agent_count"] = unemployed
    if unemployed / total > 0.2:
        loc["local_cascade_sensitivity"] = min(1.0, loc.get("local_cascade_sensitivity", 0.7) + 0.05)
    with open(f"{sim}/localities/millfield.json", "w") as f:
        json.dump(loc, f, indent=2)
except Exception as e:
    print(f"     Warning: locality update failed: {e}")

# ─── 8. Observation metrics ──────────────────────────────────
print("  7. Writing observations...")
obs_dir = f"{sim}/observations/tick_{tick_pad}"
os.makedirs(obs_dir, exist_ok=True)

archetype_counts = {}
emotion_counts = {}
for aid, rec in all_actions.items():
    r = rec.get("response", {})
    arch = r.get("archetype_self_assessment", "stable")
    emo = r.get("emotional_state", "neutral")
    archetype_counts[arch] = archetype_counts.get(arch, 0) + 1
    emotion_counts[emo] = emotion_counts.get(emo, 0) + 1

# Count missing agents as stable/neutral
for aid in missing:
    archetype_counts["unknown"] = archetype_counts.get("unknown", 0) + 1

action_summaries = {}
for aid, rec in all_actions.items():
    r = rec.get("response", {})
    action_summaries[aid] = {
        "name": rec.get("agent_name", aid),
        "actions": [a.get("description", "?") for a in r.get("chosen_actions", [])],
        "emotion": r.get("emotional_state", "?"),
        "archetype": r.get("archetype_self_assessment", "?"),
        "inner_monologue": r.get("inner_monologue", "")
    }

metrics = {
    "tick": tick,
    "employment_rate": market_state["employment"]["employment_rate"],
    "average_stress": round(sum(
        json.loads(open(f"{sim}/agents/{a['id']}/state.json").read())["psychological"]["stress_level"]
        for a in agents) / total, 3),
    "average_savings": round(sum(
        json.loads(open(f"{sim}/agents/{a['id']}/state.json").read())["financial"]["savings"]
        for a in agents) / total),
    "archetype_distribution": archetype_counts,
    "emotion_distribution": emotion_counts,
    "car_ownership_rate": market_state["car_ownership"]["ownership_rate"],
    "robotaxi_adoption": market_state["car_ownership"]["robotaxi_adoption_rate"],
    "spending_index": market_state["spending"]["spending_index"],
    "gini": gini,
    "layoffs": len(layoffs),
    "new_businesses": len(new_businesses),
    "protests": len(protests),
    "bulletin_events": len(bulletin_events)
}

with open(f"{obs_dir}/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)
with open(f"{obs_dir}/actions_summary.json", "w") as f:
    json.dump(action_summaries, f, indent=2)
with open(f"{obs_dir}/market_state.json", "w") as f:
    json.dump(market_state, f, indent=2)

# Update config
config = json.loads(open(f"{sim}/config/simulation.json").read())
config["current_tick"] = tick + 1
with open(f"{sim}/config/simulation.json", "w") as f:
    json.dump(config, f, indent=2)

# Print summary
print(f"""
  ┌─────── TICK {tick} SUMMARY ───────┐
  │ Employment: {metrics['employment_rate']:.0%}
  │ Car ownership: {metrics['car_ownership_rate']:.0%}
  │ Robotaxi adoption: {metrics['robotaxi_adoption']:.0%}
  │ Spending index: {metrics['spending_index']}
  │ Avg stress: {metrics['average_stress']:.0%}
  │ Avg savings: ${metrics['average_savings']:,}
  │ Gini: {metrics['gini']}
  │ Layoffs: {metrics['layoffs']} | New biz: {metrics['new_businesses']}
  │ Protests: {metrics['protests']} | Bulletin: {metrics['bulletin_events']} events
  │ Archetypes: {archetype_counts}
  └─────────────────────────────────┘

  ✓ Tick {tick} complete. Next tick: {tick + 1}
""")
PYEOF
