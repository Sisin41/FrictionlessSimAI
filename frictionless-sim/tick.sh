#!/bin/bash
# tick.sh — Phase 1: World Setup
# Reads capability facts + computed market state + agent bulletin
# Builds rich inboxes so agents perceive EMERGENT reality, not scripted outcomes
#
# Usage: bash tick.sh <tick_number>
set -e
SIM_DIR="$(cd "$(dirname "$0")" && pwd)"
TICK=${1:-0}
TICK_PAD=$(printf "%03d" "$TICK")

echo "═══════════════════════════════════════════════"
echo "  TICK $TICK — World Setup"
echo "═══════════════════════════════════════════════"

python3 - "$SIM_DIR" "$TICK" << 'PYEOF'
import json, os, sys, glob
from pathlib import Path

sim = sys.argv[1]
tick = int(sys.argv[2])
tick_pad = f"{tick:03d}"
prev_pad = f"{tick-1:03d}" if tick > 0 else None

# ─── 1. Read capability fact for this tick ──────────────────
scenario = json.loads(open(f"{sim}/config/scenario.json").read())
fact = None
for e in scenario["events"]:
    if e["tick"] == tick:
        fact = e
        break

# Also carry forward the most recent fact as ambient context
ambient_fact = None
for e in scenario["events"]:
    if e["tick"] <= tick:
        ambient_fact = e

if fact:
    print(f"  Capability fact: {fact['fact'][:80]}...")
else:
    print(f"  No new capability fact this tick.")

# Write world state
world_state = {"tick": tick, "capability_fact": fact, "ambient_fact": ambient_fact}
os.makedirs(f"{sim}/world/events", exist_ok=True)
with open(f"{sim}/world/state.json", "w") as f:
    json.dump(world_state, f, indent=2)
with open(f"{sim}/world/events/tick_{tick_pad}.json", "w") as f:
    json.dump(world_state, f, indent=2)

# ─── 2. Read market state from last tick ────────────────────
market = {}
market_path = f"{sim}/world/market_state.json"
if os.path.exists(market_path):
    market = json.loads(open(market_path).read())

# ─── 3. Read bulletin from last tick ───────────────────────
bulletin = {"events": []}
if prev_pad:
    bul_path = f"{sim}/world/bulletin_tick_{prev_pad}.json"
    if os.path.exists(bul_path):
        bulletin = json.loads(open(bul_path).read())
        print(f"  Bulletin from tick {tick-1}: {len(bulletin.get('events',[]))} events")

# ─── 4. Read last tick's actions for social routing ─────────
prev_actions = {}
if prev_pad:
    for f_path in glob.glob(f"{sim}/agents/*/actions/tick_{prev_pad}.json"):
        try:
            act = json.loads(open(f_path).read())
            prev_actions[act.get("agent_id", "")] = act
        except:
            pass

# ─── 5. Build inbox for each agent ─────────────────────────
agents = json.loads(open(f"{sim}/agents/index.json").read())
print(f"  Building inboxes for {len(agents)} agents...")

for a in agents:
    aid = a["id"]
    state = json.loads(open(f"{sim}/agents/{aid}/state.json").read())
    rels = json.loads(open(f"{sim}/agents/{aid}/relationships.json").read())
    sources = state.get("perception", {}).get("information_sources", [])
    msgs = []

    # ── Capability fact (if new this tick) ──
    if fact:
        if any(s in sources for s in ["local_news", "national_news", "social_media"]):
            msgs.append({"type": "CAPABILITY_FACT", "content": fact["fact"]})
        elif any(s in sources for s in ["word_of_mouth"]):
            # Telephone effect (§5.3): rumors degrade through social graph
            # Strip specifics, add uncertainty markers
            rumor_text = fact["fact"][:100]
            import re
            # Remove dollar amounts
            rumor_text = re.sub(r'\$[\d.]+', 'very cheap', rumor_text)
            # Replace standalone numbers (2+ digits) with vague language
            rumor_text = re.sub(r'\b\d{2,}\b', 'many', rumor_text)
            # Replace single-digit numbers > 1 before unit words
            rumor_text = re.sub(r'\b[2-9]\s+(minute|hour|mile|month|year|cit)', 'a few \\1', rumor_text)
            msgs.append({"type": "RUMOR", "content": f"People are saying: {rumor_text}. (You're not sure of the exact details.)"})

    # ── Ambient context (ongoing situation) ──
    if ambient_fact and ambient_fact.get("tick", -1) != tick:
        msgs.append({"type": "AMBIENT", "content": f"Ongoing: {ambient_fact['fact'][:120]}"})

    # ── Market state observations (filtered by sector) ──
    if market and market.get("tick", -1) >= 0:
        auto = market.get("auto_sector", {})
        emp = market.get("employment", {})
        cars = market.get("car_ownership", {})
        spending = market.get("spending", {})

        # Everyone sees general economic indicators
        if any(s in sources for s in ["local_news", "national_news"]):
            emp_rate = emp.get("employment_rate", 1.0)
            if emp_rate < 0.95:
                msgs.append({"type": "MARKET_DATA", "content": f"Local unemployment rising. Employment rate: {emp_rate:.0%}."})
            si = spending.get("spending_index", 100)
            if si < 90:
                msgs.append({"type": "MARKET_DATA", "content": f"Consumer spending down. Spending index: {si} (baseline: 100)."})

        # Robotaxi adoption visible to everyone
        adopt = cars.get("robotaxi_adoption_rate", 0)
        if adopt > 0.05:
            msgs.append({"type": "OBSERVATION", "content": f"You notice more robotaxis on the streets. About {adopt:.0%} of people seem to be using them regularly."})

        # Sector-specific observations
        if a["sector"] in ("retail_auto", "service", "fuel"):
            rev_idx = auto.get("dealership_revenue_index", 100)
            if rev_idx < 90:
                msgs.append({"type": "SECTOR_DATA", "content": f"Auto sector revenue index: {rev_idx} (baseline: 100). Foot traffic and sales are {'noticeably' if rev_idx < 70 else 'somewhat'} down."})
        if a["sector"] == "insurance":
            pol = auto.get("insurance_policies_active", 0)
            msgs.append({"type": "SECTOR_DATA", "content": f"Active auto insurance policies in area: {pol}. {'Cancellations increasing.' if pol < 25 else ''}"})
        if a["sector"] == "finance":
            lend = auto.get("auto_lending_volume_index", 100)
            if lend < 90:
                msgs.append({"type": "SECTOR_DATA", "content": f"Auto loan applications down. Lending volume index: {lend}."})
        if a["sector"] == "transport":
            msgs.append({"type": "SECTOR_DATA", "content": f"Robotaxi adoption: {adopt:.0%}. {'Direct competition intensifying.' if adopt > 0.1 else ''}"})

    # ── Bulletin events (agent-generated from last tick) ──
    for evt in bulletin.get("events", []):
        vis = evt.get("visibility", "local")
        source_agent = evt.get("source_agent", "")
        
        # Everyone sees local_news events
        if vis == "local_news" and any(s in sources for s in ["local_news", "social_media"]):
            msgs.append({"type": "NEWS", "content": evt["description"]})
        
        # Sector events visible to same sector
        elif vis == "sector" and a["sector"] == evt.get("sector", ""):
            msgs.append({"type": "SECTOR_NEWS", "content": evt["description"]})
        
        # Power cascade: if someone with power_over you did something
        elif source_agent in rels.get("power_over_me", []) or source_agent in [c["agent_id"] for c in rels.get("connections", []) if c.get("trust", 0) > 0.5]:
            msgs.append({"type": "DIRECT_IMPACT", "content": evt["description"]})

    # ── Social contagion from network ──
    if tick > 0:
        stressed = []
        hopeful = []
        for conn in rels.get("connections", [])[:8]:
            try:
                cs = json.loads(open(f"{sim}/agents/{conn['agent_id']}/state.json").read())
                if cs["psychological"]["stress_level"] > 0.5:
                    stressed.append(conn["name"])
                if cs["perception"].get("sentiment") in ("hopeful", "excited"):
                    hopeful.append(conn["name"])
            except:
                pass
        if stressed:
            msgs.append({"type": "SOCIAL", "content": f"People around you are stressed: {', '.join(stressed[:3])}. The mood is tense."})
        if hopeful:
            msgs.append({"type": "SOCIAL", "content": f"Some people seem optimistic: {', '.join(hopeful[:3])}."})

    # ── What you heard happened to people you know ──
    for conn in rels.get("connections", [])[:10]:
        cid = conn["agent_id"]
        if cid in prev_actions:
            act = prev_actions[cid]
            resp = act.get("response", {})
            for action in resp.get("chosen_actions", []):
                atype = action.get("type", "")
                desc = action.get("description", "")
                # Only share notable actions through social graph
                if atype in ("COMMITMENT", "ASSOCIATION", "SIGNAL") and atype != "INACTION":
                    trust = conn.get("trust", 0)
                    if trust > 0.7:
                        # High trust: full detail
                        msgs.append({"type": "WORD_OF_MOUTH", "content": f"You heard directly from {conn['name']} ({conn['role']}): {desc}"})
                    elif trust > 0.4:
                        # Medium trust: some detail lost (telephone effect §5.3)
                        msgs.append({"type": "WORD_OF_MOUTH", "content": f"Someone mentioned that {conn['name']} is making some kind of change — something about {desc[:50]}..."})
                    # Below 0.4: doesn't propagate at all

    # ── Transaction outcomes from last tick ──
    if prev_pad:
        outcomes_path = f"{sim}/agents/{aid}/outcomes_tick_{prev_pad}.json"
        if os.path.exists(outcomes_path):
            outcomes = json.loads(open(outcomes_path).read())
            for o in outcomes:
                msgs.append({"type": "OUTCOME", "content": o.get("narrative", "")})

    # Write inbox
    with open(f"{sim}/agents/{aid}/inbox.json", "w") as f:
        json.dump({"tick": tick, "messages": msgs}, f, indent=2)

# ─── 6. If tick 0, compute baseline market state ───────────
if tick == 0:
    car_owners = sum(1 for a in agents 
        if json.loads(open(f"{sim}/agents/{a['id']}/state.json").read())
        ["hierarchy"]["L3_CONSUME"].get("owns_car", False))
    employed = sum(1 for a in agents
        if json.loads(open(f"{sim}/agents/{a['id']}/state.json").read())
        ["hierarchy"]["L2_PARTICIPATE"]["employment_status"] == "employed")
    total_income = sum(
        json.loads(open(f"{sim}/agents/{a['id']}/state.json").read())
        ["financial"]["monthly_income"] for a in agents)
    
    baseline_market = {
        "tick": 0,
        "car_ownership": {
            "total_owners": car_owners,
            "ownership_rate": round(car_owners / len(agents), 2),
            "cars_sold_this_tick": 0,
            "robotaxi_adopters": 0,
            "robotaxi_adoption_rate": 0
        },
        "employment": {
            "employed": employed,
            "unemployed": 0,
            "seeking": 0,
            "employment_rate": 1.0,
            "layoffs_this_tick": [],
            "hirings_this_tick": [],
            "new_businesses_this_tick": []
        },
        "spending": {
            "total_consumer_spending": total_income,
            "spending_baseline": total_income,
            "spending_index": 100
        },
        "auto_sector": {
            "dealership_revenue_index": 100,
            "insurance_policies_active": car_owners,
            "mechanic_demand_index": 100,
            "gas_station_revenue_index": 100,
            "auto_lending_volume_index": 100
        },
        "community": {
            "protests": 0,
            "mutual_aid_events": 0,
            "new_organizations": 0,
            "policy_proposals": []
        },
        "computed_from": "agent_state_baseline"
    }
    with open(f"{sim}/world/market_state.json", "w") as f:
        json.dump(baseline_market, f, indent=2)
    print(f"  Baseline market: {car_owners} car owners, {employed} employed, ${total_income:,} total income")

# Ensure action dirs exist
for a in agents:
    os.makedirs(f"{sim}/agents/{a['id']}/actions", exist_ok=True)

# Update config
config = json.loads(open(f"{sim}/config/simulation.json").read())
config["current_tick"] = tick
with open(f"{sim}/config/simulation.json", "w") as f:
    json.dump(config, f, indent=2)

print(f"\n  ✓ World state ready. Inboxes populated.")
print(f"  → Delegate to agent-worker for each agent's decision.")
print(f"  → Then run: bash post_tick.sh {tick}")
PYEOF
