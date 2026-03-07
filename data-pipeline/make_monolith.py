#!/usr/bin/env python3
"""
make_monolith.py
Compile every byte of FrictionlessSimAI data into one zero-loss Markdown document.
Temporal dimension: tick-by-tick, agent-by-agent, nothing omitted.
"""

import json
import os
import glob
from pathlib import Path
from typing import Any

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT    = Path(__file__).parent.parent
SIM     = ROOT / "frictionless-sim"
AGENTS  = SIM / "agents"
CONFIG  = SIM / "config"
WORLD   = SIM / "world"
OBS     = SIM / "observations"
TXN     = SIM / "transactions"
VIZDATA = ROOT / "viz-data"
OUT     = ROOT / "MONOLITH.md"

TICKS = list(range(15))  # 0-14

# ─── Helpers ──────────────────────────────────────────────────────────────────

def load(path: Path) -> Any:
    """Load JSON file; return None if missing."""
    try:
        return json.loads(path.read_text())
    except Exception:
        return None

def j(obj, indent=2) -> str:
    """Pretty-print JSON."""
    return json.dumps(obj, indent=indent, ensure_ascii=False)

def h1(t): return f"\n\n# {t}\n"
def h2(t): return f"\n\n## {t}\n"
def h3(t): return f"\n\n### {t}\n"
def h4(t): return f"\n\n#### {t}\n"
def h5(t): return f"\n\n##### {t}\n"
def hr():  return "\n\n---\n"
def code(text, lang=""):
    return f"\n```{lang}\n{text}\n```\n"
def blockquote(text):
    if not isinstance(text, str):
        text = j(text) if isinstance(text, (dict, list)) else str(text)
    lines = text.strip().splitlines()
    return "\n" + "\n".join(f"> {l}" for l in lines) + "\n"

def agent_dirs():
    return sorted([d for d in AGENTS.iterdir()
                   if d.is_dir() and (d / "state.json").exists()])

def agent_ids():
    return [d.name for d in agent_dirs()]

def tick_str(t: int) -> str:
    return f"tick_{t:03d}"

# ─── Section builders ─────────────────────────────────────────────────────────

def build_preamble(lines):
    lines.append(h1("MILLFIELD: A FRICTIONLESS ECONOMY SIMULATION"))
    lines.append("""**Complete Temporal Record — All Ticks · All Agents · All Data**

This document is the **full source of truth** for the Millfield autonomous-transport
disruption simulation. It contains every agent decision, every inner monologue,
every outcome, every bilateral transaction, every market datapoint, and every
community bulletin across all 15 simulated months (ticks 0–14).

Nothing is omitted. Everything that existed in the raw simulation files is here.

**Structure:**
1. World Configuration (scenario, locality, hierarchy, world layout)
2. Agent Profiles — Initial State (tick 0)
3. Tick-by-Tick Record (ticks 0–14)
   - Scenario event · Market state · Bulletin · Agent actions + inner lives · Outcomes · Transactions · Building states
4. Social Graph (228 relationships)
5. Phenomena Detected (29 patterns + 5 scenario events)
6. Final State (tick 14 snapshot)
""")
    lines.append(hr())


def build_world_config(lines):
    lines.append(h1("PART I — WORLD CONFIGURATION"))

    # Simulation params
    sim = load(CONFIG / "simulation.json")
    if sim:
        lines.append(h2("Simulation Parameters"))
        lines.append(f"""
| Parameter | Value |
|-----------|-------|
| Name | {sim.get('simulation_name','—')} |
| Description | {sim.get('description','—')} |
| Tick unit | {sim.get('tick_unit','—')} |
| Max ticks | {sim.get('max_ticks','—')} |
| Current tick (sim end) | {sim.get('current_tick','—')} |
| Agent model | `{sim.get('model','—')}` |
| Observer model | `{sim.get('observer_model','—')}` |
| Parallel batch size | {sim.get('parallel_batch_size','—')} |
| Seed money supply | ${sim.get('seed_money_supply',0):,} |
| Max tokens/agent | {sim.get('max_tokens_agent','—')} |
| Reflection interval | every {sim.get('reflection_interval','—')} ticks |
""")

    # Scenario
    scenario = load(CONFIG / "scenario.json")
    if scenario:
        lines.append(h2("Scenario: Autonomous Transport"))
        lines.append(f"**{scenario.get('description','')}**\n")
        lines.append(h3("Scenario Events (Capability Facts)"))
        lines.append("| Tick | Type | Fact |")
        lines.append("|------|------|------|")
        for ev in scenario.get("events", []):
            fact = ev.get("fact","").replace("|","\\|")
            lines.append(f"| {ev.get('tick','?')} | `{ev.get('type','')}` | {fact} |")

    # Locality
    loc = load(SIM / "localities" / "millfield.json")
    if loc:
        lines.append(h2("Locality: Millfield"))
        lines.append(f"""
| Field | Value |
|-------|-------|
| Population (simulated) | {loc.get('population','—')} agents |
| Cost of living index | {loc.get('cost_of_living_index','—')} |
| Community cohesion | {loc.get('community_cohesion','—')} |
| Initial unemployment rate | {loc.get('unemployment_rate','—')} |
| Avg monthly income | ${loc.get('avg_monthly_income',0):,} |
| Local multiplier | {loc.get('local_multiplier','—')} |
| Gini coefficient | {loc.get('gini_coefficient','—')} |
| Total income | ${loc.get('total_income',0):,} |
| Disrupted agent count | {loc.get('disrupted_agent_count','—')} |
""")
        lines.append(h3("Industry Mix"))
        lines.append("| Sector | Share |")
        lines.append("|--------|-------|")
        for k, v in loc.get("industry_mix", {}).items():
            lines.append(f"| {k} | {v:.0%} |")
        lines.append(h3("Policy Environment"))
        pe = loc.get("policy_environment", {})
        lines.append(f"""
| Policy | Status |
|--------|--------|
| Retraining programs | {'✓ Active' if pe.get('retraining_programs') else '✗ None'} |
| Transition fund | {'✓ Active' if pe.get('transition_fund_available') else '✗ None'} |
| Monthly transition funding | ${pe.get('transition_fund_monthly',0):,} |
| Tax incentives | {'✓ Active' if pe.get('tax_incentives') else '✗ None'} |
""")

    # Hierarchy
    hier = load(CONFIG / "hierarchy.json")
    if hier:
        lines.append(h2("Agent Optimization Protocol (Maslow-style Hierarchy)"))
        lines.append(f"*{hier.get('optimization_protocol','')}*\n")
        for lv in hier.get("levels", []):
            lines.append(f"\n**L{lv['level']} — {lv['name']}**: {lv['description']}  ")
            lines.append(f"Variables: `{'`, `'.join(lv.get('variables',[]))}`  ")
            lines.append(f"*When threatened: {lv.get('behavior_when_threatened','')}*")

    # World layout
    wld = load(VIZDATA / "world.json")
    if wld:
        lines.append(h2("World Layout"))
        g = wld.get("grid", {})
        lines.append(f"Grid: **{g.get('cols','?')}×{g.get('rows','?')} tiles** · "
                     f"Tile {g.get('tile_w','?')}×{g.get('tile_h','?')}px · "
                     f"Origin ({g.get('origin',['?','?'])[0]}, {g.get('origin',['?','?'])[1]})\n")
        lines.append(h3("Home Tiles"))
        lines.append("| Agent ID | Tile (col, row) |")
        lines.append("|----------|-----------------|")
        for aid, tile in wld.get("home_tiles", {}).items():
            lines.append(f"| `{aid}` | ({tile[0]}, {tile[1]}) |")
        lines.append(h3("Agent Workplaces"))
        lines.append("| Agent ID | Workplace Building |")
        lines.append("|----------|--------------------|")
        for aid, wp in wld.get("agent_workplaces", {}).items():
            lines.append(f"| `{aid}` | {wp or '*(none / commuter)*'} |")
        lines.append(h3("Zones"))
        zones = wld.get("zones", {})
        if isinstance(zones, dict):
            zone_items = zones.items()
        else:
            zone_items = [(z.get("id", str(i)), z) for i, z in enumerate(zones)]
        for zid, zone in zone_items:
            if isinstance(zone, dict):
                label = zone.get("label", zone.get("name", zid))
                color = zone.get("color", zone.get("tint",""))
                cols  = zone.get("cols", [])
                rows  = zone.get("rows", [])
                lines.append(f"\n**{label}** (`{zid}`) — cols {cols} rows {rows}  ")
                lines.append(f"Color: `{color}`")
            else:
                lines.append(f"\n**{zid}**: {zone}")

    # Buildings
    bdata = load(VIZDATA / "buildings.json")
    if bdata:
        lines.append(h2("Buildings (17)"))
        lines.append("| ID | Label | Zone | Tile | Size | Sector | Appears Tick |")
        lines.append("|----|-------|------|------|------|--------|--------------|")
        for b in bdata.get("buildings", []):
            tile = b.get("tile", ["-","-"])
            lines.append(f"| `{b['id']}` | {b.get('label','?')} | {b.get('zone','?')} | "
                         f"({tile[0]},{tile[1]}) | {b.get('size','?')} | "
                         f"{b.get('sector','?')} | {b.get('appears_tick',0)} |")
    lines.append(hr())


def build_agent_profiles(lines):
    lines.append(h1("PART II — AGENT PROFILES (Initial State)"))
    lines.append("> *All 30 agents as they entered tick 0. "
                 "Full psychology, finances, biases, commitments, relationships.*\n")

    for adir in agent_dirs():
        aid = adir.name
        state = load(adir / "state.json")
        rels  = load(adir / "relationships.json")
        mem   = load(adir / "memory.json")
        inbox = load(adir / "inbox.json")
        if not state:
            continue

        ident = state.get("identity", {})
        hier  = state.get("hierarchy", {})
        psych = state.get("psychological", state.get("psychology", {}))
        fin   = state.get("financial", state.get("finances", {}))
        biases = psych.get("biases", {})
        comms  = state.get("commitments", fin.get("commitments", []))
        skills = ident.get("skills", [])
        trans  = state.get("in_progress_transformations", state.get("transformations_in_progress", []))
        grief  = psych.get("grief_stage", "none")
        archetype = state.get("archetype", psych.get("archetype", "?"))

        lines.append(h2(f"{ident.get('name','?')}  ·  `{aid}`"))
        lines.append(f"**{ident.get('role','?')}**  ·  "
                     f"Age {ident.get('age','?')}  ·  "
                     f"Tier {ident.get('tier','?')}  ·  "
                     f"Sector: {ident.get('sector','?')}  ·  "
                     f"Archetype: **{archetype}**\n")
        lines.append(f"*\"{ident.get('narrative','')}\"*\n")

        # Identity
        lines.append(h3("Identity & Psychology"))
        mob = state.get("mobility", {})
        lines.append(f"""
| Attribute | Value |
|-----------|-------|
| Identity attachment | {ident.get('identity_attachment','?')} |
| Dependents | {ident.get('dependents','?')} |
| Skill relevance | {ident.get('skill_relevance','?')} |
| Skills | {', '.join(skills)} |
| Grief stage | **{grief}** |
| Agency | {psych.get('agency','?')} |
| Stress level | {psych.get('stress_level','?')} |
| Temporal horizon | {psych.get('temporal_horizon_months','?')} months |
| Meaning source | {ident.get('meaning_source', psych.get('meaning_source','?'))} |
| Owns car | {'✓' if mob.get('owns_car') else '✗'} |
| Uses RoboTaxi | {'✓' if mob.get('uses_robotaxi') else '✗'} |
""")

        # Historical conditioning
        hc = ident.get("historical_conditioning", [])
        if hc:
            lines.append(h4("Historical Conditioning"))
            for h_ in hc:
                lines.append(f"- **{h_.get('event','')}**: {h_.get('response_pattern','')} — "
                             f"*\"{h_.get('lesson','')}\"*")

        # Biases
        if biases:
            lines.append(h4("Cognitive Biases"))
            lines.append("| Bias | Value |")
            lines.append("|------|-------|")
            for k, v in biases.items():
                lines.append(f"| {k.replace('_',' ').title()} | {v} |")

        # Finances
        l0 = hier.get("L0_SURVIVE", {})
        l1 = hier.get("L1_STABILIZE", {})
        l3 = hier.get("L3_CONSUME", {})
        l4 = hier.get("L4_SIGNAL", {})
        l5 = hier.get("L5_BUILD", {})

        lines.append(h3("Finances (Tick 0 Baseline)"))
        lines.append(f"""
| Metric | Value |
|--------|-------|
| Savings | ${fin.get('savings', l1.get('savings_buffer',0)):,} |
| Monthly income | ${fin.get('monthly_income',0):,} |
| Monthly expenses | ${fin.get('monthly_expenses', l0.get('monthly_essentials',0)):,} |
| Debt total | ${fin.get('debt_total',0):,} |
| Credit score | {fin.get('credit_score','—')} |
| Runway months | **{l0.get('runway_months','—')}** |
| Threat level | {l0.get('threat_level','—')} |
| Status anxiety | {l4.get('status_anxiety','—')} |
| Reference group | {l4.get('reference_group','—')} |
| Entrepreneurial drive | {l5.get('entrepreneurial_drive','—')} |
| Future orientation | {l5.get('future_orientation','—')} |
""")

        # Commitments
        if comms:
            lines.append(h4("Monthly Commitments"))
            lines.append("| Type | Monthly Cost | Remaining Months |")
            lines.append("|------|-------------|------------------|")
            for c in comms:
                rm = c.get('remaining_months')
                lines.append(f"| {c.get('type','')} | ${c.get('monthly_cost',0):,} | "
                             f"{'∞' if rm is None else rm} |")
            total = fin.get("total_committed_monthly", 0)
            lines.append(f"\n**Total committed monthly: ${total:,}**")

        # Hierarchy status
        lines.append(h3("Hierarchy Level Status (Tick 0)"))
        for lname, ldata in hier.items():
            if not isinstance(ldata, dict): continue
            lines.append(f"\n**{lname}**")
            for k, v in ldata.items():
                if isinstance(v, (str, int, float, bool)):
                    lines.append(f"  - {k}: `{v}`")

        # Transformations
        if trans:
            lines.append(h4("Active Transformations"))
            for t in trans:
                lines.append(f"\n**{t.get('type','')}** — {t.get('description','')}  ")
                lines.append(f"Progress: {t.get('progress',0):.0%} · "
                             f"ETA: {t.get('completion_eta_months','?')} months · "
                             f"Started: tick {t.get('started_tick','?')}")

        # Relationships
        if rels:
            lines.append(h3("Relationships"))
            conns = rels.get("connections", rels) if isinstance(rels, dict) else rels
            if isinstance(conns, list) and conns:
                lines.append("| Agent | Name | Role | Trust | Type |")
                lines.append("|-------|------|------|-------|------|")
                for r in conns:
                    lines.append(f"| `{r.get('agent_id','')}` | {r.get('name','')} | "
                                 f"{r.get('role','')} | {r.get('trust','?')} | {r.get('type','')} |")

        # Inbox summary
        if inbox:
            msgs = inbox if isinstance(inbox, list) else inbox.get("messages", [])
            if msgs:
                lines.append(h4(f"Inbox ({len(msgs)} messages)"))
                for msg in msgs[:20]:  # cap at 20 for readability but include all
                    if isinstance(msg, dict):
                        lines.append(f"- **[{msg.get('type','MSG')}]** "
                                     f"From `{msg.get('from_agent','?')}` "
                                     f"(tick {msg.get('tick','?')}): "
                                     f"{str(msg.get('content', msg.get('message',''))).replace(chr(10),' ')[:300]}")
                if len(msgs) > 20:
                    lines.append(f"\n*...{len(msgs)-20} additional messages not shown.*")

        # Memory (past actions summary)
        if mem:
            past = mem.get("past_actions", mem.get("memories", []))
            if past:
                lines.append(h3("Memory — Past Action Summaries"))
                for pa in past:
                    tick_n = pa.get('tick', '?')
                    summary = pa.get('summary', pa.get('action', ''))
                    emotion = pa.get('emotional_state','')
                    lines.append(f"\n**Tick {tick_n}** *(emotional state: {emotion})*  ")
                    lines.append(blockquote(summary))

        lines.append(hr())


def extract_action_universal(action: dict, aid: str):
    """
    Universal action extractor — handles every schema variant found in the sim.

    Returns: (name, emotion, archetype, monologue, assessment, chosen_actions_list, econ)

    Known schemas:
      Standard:   {agent_name, response:{chosen_actions, inner_monologue, internal_assessment, emotional_state}, economic_effects}
      TypeA:      {agent_name, current_state_summary, threat_assessment, hierarchy_priority, chosen_actions, emotional_state, ...}
      TypeB:      {agent_id, psychological_state, chosen_actions, internal_monologue}  (tick 7 some agents)
      TypeC:      {emotional_state, primary_action, secondary_actions/secondary_action, internal_state}
      TypeD:      {action_type, description, targets/target_agents, emotional_state}  (tick 7 some)
      TypeE:      {emotional_state, reasoning, primary_action, ...}  (tick 9 bank_manager)
      TypeF:      {hierarchy_level, emotional_state, archetype, actions:[...]}  (tick 11)
      TypeG:      {emotional_state, actions:[...]}  (tick 12)
      TypeH:      {action_type, primary_action, secondary_action, ...}  (tick 6 various)
    """
    name = action.get("agent_name", action.get("agent_id", aid))
    econ = action.get("economic_effects", {})
    archetype = "?"

    # ── Standard schema (has "response" wrapper) ────────────────────────────
    if "response" in action:
        resp = action["response"]
        emotion   = resp.get("emotional_state", action.get("emotional_state", "?"))
        archetype = resp.get("archetype_self_assessment", "?")
        monologue = resp.get("inner_monologue", "")
        assessment = resp.get("internal_assessment", "")
        chosen    = resp.get("chosen_actions", [])
        return name, emotion, archetype, monologue, assessment, chosen, econ

    # ── TypeF/G — {actions: [...], emotional_state} ─────────────────────────
    if "actions" in action and isinstance(action["actions"], list):
        emotion   = action.get("emotional_state", "?")
        archetype = action.get("archetype", "?")
        monologue = action.get("internal_monologue", action.get("inner_monologue", ""))
        assessment = action.get("reasoning", action.get("internal_state", ""))
        # hierarchy_level note
        hl = action.get("hierarchy_level", "")
        if hl:
            assessment = (f"[Hierarchy: {hl}] " + assessment).strip()
        chosen = action["actions"]
        return name, emotion, archetype, monologue, assessment, chosen, econ

    # ── TypeB — {psychological_state, chosen_actions, internal_monologue} ───
    if "chosen_actions" in action:
        ps = action.get("psychological_state", {})
        emotion   = ps.get("sentiment", action.get("emotional_state", "?"))
        monologue = action.get("internal_monologue", action.get("inner_monologue", ""))
        assessment = str(ps) if ps else ""
        chosen = action["chosen_actions"]
        return name, emotion, archetype, monologue, assessment, chosen, econ

    # ── TypeA — {current_state_summary, threat_assessment, hierarchy_priority} ──
    if "current_state_summary" in action:
        emotion    = action.get("emotional_state", "?")
        css        = action.get("current_state_summary", {})
        ta         = action.get("threat_assessment", {})
        hp         = action.get("hierarchy_priority", {})
        assessment = (
            f"State: {j(css, 0)[:400]}\n"
            f"Threat: {j(ta, 0)[:400]}\n"
            f"Priority: {j(hp, 0)[:300]}"
        )
        # Chosen actions in various sub-keys
        raw_chosen = (action.get("chosen_actions") or
                      action.get("actions") or
                      action.get("decisions") or [])
        # Some TypeA files have action text under different keys
        if not raw_chosen:
            raw_chosen = []
            for k in ["primary_action", "secondary_action", "action", "description"]:
                if action.get(k):
                    raw_chosen.append(action[k])
        monologue  = action.get("inner_monologue", action.get("internal_monologue", ""))
        return name, emotion, archetype, monologue, assessment, raw_chosen, econ

    # ── TypeC — {primary_action, secondary_actions/secondary_action} ─────────
    if "primary_action" in action:
        emotion   = action.get("emotional_state", "?")
        monologue = action.get("internal_state",
                    action.get("inner_monologue",
                    action.get("internal_monologue", "")))
        assessment = action.get("reasoning", action.get("rationale", ""))
        chosen = []
        pa = action.get("primary_action")
        if pa:
            chosen.append(pa)
        for k in ["secondary_action", "secondary_actions", "tertiary_action",
                  "financial_action", "financial_decision", "resource_allocation"]:
            v = action.get(k)
            if v:
                if isinstance(v, list):
                    chosen.extend(v)
                else:
                    chosen.append(v)
        return name, emotion, archetype, monologue, assessment, chosen, econ

    # ── TypeD — {action_type, description, targets} ──────────────────────────
    if "action_type" in action or "description" in action:
        emotion   = action.get("emotional_state", "?")
        monologue = action.get("internal_monologue", action.get("inner_monologue", ""))
        assessment = action.get("rationale", action.get("reasoning", ""))
        desc = action.get("description", "")
        atype = action.get("action_type", "action")
        targets = action.get("targets", action.get("target_agents", []))
        chosen = [{
            "type": atype,
            "description": desc,
            "target_agent": ", ".join(str(t) if not isinstance(t, dict) else t.get("agent_id", str(t)) for t in targets) if isinstance(targets, list) else str(targets),
        }]
        # Also grab any extra sub-actions
        for k in ["secondary_action", "financial_action"]:
            v = action.get(k)
            if v:
                chosen.append(v if isinstance(v, dict) else {"type": k, "description": str(v)})
        return name, emotion, archetype, monologue, assessment, chosen, econ

    # ── TypeE — {reasoning, primary_action} (tick 9 bank_manager) ───────────
    if "reasoning" in action:
        emotion    = action.get("emotional_state", "?")
        monologue  = action.get("inner_monologue", "")
        assessment = action.get("reasoning", "")
        pa = action.get("primary_action")
        chosen = [pa] if pa else []
        return name, emotion, archetype, monologue, assessment, chosen, econ

    # ── Fallback — dump everything as raw JSON so nothing is lost ────────────
    emotion = action.get("emotional_state", "?")
    monologue = ""
    assessment = f"[Raw — schema unrecognized]\n{j(action)[:2000]}"
    chosen = []
    return name, emotion, archetype, monologue, assessment, chosen, econ


def build_tick_record(lines):
    lines.append(h1("PART III — TICK-BY-TICK RECORD"))
    lines.append("> *Every month, fully documented. Inner lives, decisions, outcomes, transactions.*\n")

    # Load viz building ticks for health data
    bdata = load(VIZDATA / "buildings.json")
    building_ticks = bdata.get("ticks", {}) if bdata else {}
    building_list  = bdata.get("buildings", []) if bdata else []

    # Load viz agents for history (has per-tick savings/stress data)
    agdata = load(VIZDATA / "agents.json")
    viz_agents = agdata if agdata else {}

    # Load scenario events
    scenario = load(CONFIG / "scenario.json")
    scenario_events = {ev["tick"]: ev for ev in scenario.get("events", [])} if scenario else {}

    # Load phenomena for tick markers
    phen_data = load(VIZDATA / "phenomena.json")
    phen_by_tick: dict = {}
    if phen_data:
        for p in phen_data.get("phenomena", []) + phen_data.get("scenario_events", []):
            phen_by_tick.setdefault(p["tick"], []).append(p)

    for tick in TICKS:
        ts = tick_str(tick)
        lines.append(h2(f"TICK {tick:02d} — Month {tick}"))

        # Scenario event for this tick
        if tick in scenario_events:
            ev = scenario_events[tick]
            lines.append(f"\n🚨 **SCENARIO EVENT — `{ev['type'].upper()}`**\n")
            lines.append(blockquote(ev["fact"]))

        # World events file
        wev_path = WORLD / "events" / f"tick_{tick:03d}.json"
        wev = load(wev_path)
        if wev:
            cf = wev.get("capability_fact")
            af = wev.get("ambient_fact")
            if cf:
                lines.append(f"\n**Active Capability Fact:** {cf}\n")
            if af and isinstance(af, dict):
                lines.append(f"\n**Ambient Context** (from tick {af.get('tick','?')}): {af.get('fact','')}\n")

        # Phenomena markers this tick
        if tick in phen_by_tick:
            lines.append(h3("Detected Phenomena This Tick"))
            for p in phen_by_tick[tick]:
                lines.append(f"- **{p.get('label','')}** [{p.get('type','')}] "
                             f"Severity {p.get('severity','?')}/3 — {p.get('description','')}")

        # Observation tick data
        obs_dir = OBS / ts
        obs_market = load(obs_dir / "market_state.json") if obs_dir.exists() else None
        obs_metrics = load(obs_dir / "metrics.json") if obs_dir.exists() else None
        obs_summary = load(obs_dir / "actions_summary.json") if obs_dir.exists() else None

        # Timeseries data
        ts_data = {}
        if phen_data and "timeseries" in phen_data:
            ts_data = phen_data["timeseries"].get(str(tick), {})

        lines.append(h3("World Market State"))
        if obs_market:
            emp = obs_market.get("employment", {})
            spend = obs_market.get("spending", {})
            auto = obs_market.get("auto_sector", {})
            comm = obs_market.get("community", {})
            cars = obs_market.get("car_ownership", {})
            lines.append(f"""
| Metric | Value |
|--------|-------|
| Employed | {emp.get('employed','—')} / 30 |
| Unemployed | {emp.get('unemployed','—')} |
| Employment rate | {emp.get('employment_rate', ts_data.get('employment_rate','—'))} |
| Total consumer spending | ${spend.get('total_consumer_spending',0):,} |
| Spending baseline | ${spend.get('spending_baseline',0):,} |
| Spending index | {spend.get('spending_index', ts_data.get('spending_index','—'))} |
| Car owners | {cars.get('total_owners','—')} / {cars.get('baseline_owners','—')} baseline |
| Car ownership rate | {cars.get('ownership_rate','—')} |
| Cars ditched this tick | {cars.get('cars_ditched_this_tick',0)} |
| RoboTaxi adopters | {cars.get('robotaxi_adopters','—')} |
| RoboTaxi adoption rate | {cars.get('robotaxi_adoption_rate', ts_data.get('robotaxi_rate','—'))} |
| Dealership revenue index | {auto.get('dealership_revenue_index','—')} |
| Insurance policies active | {auto.get('insurance_policies_active', ts_data.get('insurance_policies','—'))} |
| Mechanic demand index | {auto.get('mechanic_demand_index', ts_data.get('mechanic_index','—'))} |
| Gas station revenue index | {auto.get('gas_station_revenue_index','—')} |
| Protests | {comm.get('protests', ts_data.get('protests','—'))} |
| Mutual aid events | {comm.get('mutual_aid_events','—')} |
| New organizations | {comm.get('new_organizations',0)} |
| Retraining enrollments | {comm.get('retraining_enrollments', ts_data.get('retraining_enrollments','—'))} |
""")
            # Gini
            gini = ts_data.get('gini') or obs_metrics.get('gini') if obs_metrics else None
            if gini:
                lines.append(f"**Gini coefficient:** {gini}\n")

            # Layoffs/hirings
            layoffs = emp.get("layoffs_this_tick", [])
            if layoffs:
                lines.append(h4(f"Layoffs This Tick ({len(layoffs)})"))
                for l_ in layoffs:
                    if isinstance(l_, str):
                        lines.append(f"- {l_[:500]}")
                    elif isinstance(l_, dict):
                        lines.append(f"- **{l_.get('agent','?')}**: {l_.get('description','')}")
            hirings = emp.get("hirings_this_tick", [])
            if hirings:
                lines.append(h4(f"Hirings This Tick ({len(hirings)})"))
                for h_ in hirings:
                    lines.append(f"- {h_}" if isinstance(h_, str) else f"- {j(h_)}")
            new_biz = emp.get("new_businesses_this_tick", [])
            if new_biz:
                lines.append(h4("New Businesses"))
                for nb in new_biz:
                    lines.append(f"- {nb}")
            policy = comm.get("policy_proposals", [])
            if policy:
                lines.append(h4("Policy Proposals Active"))
                for p in policy:
                    lines.append(blockquote(p[:600]))
        elif ts_data:
            lines.append(f"\n*Market data interpolated from phenomena timeseries:*\n")
            lines.append(f"Employment rate: {ts_data.get('employment_rate','—')} · "
                         f"Spending index: {ts_data.get('spending_index','—')} · "
                         f"Gini: {ts_data.get('gini','—')} · "
                         f"Protests: {ts_data.get('protests','—')} · "
                         f"RoboTaxi rate: {ts_data.get('robotaxi_rate','—')}\n")
        else:
            lines.append(f"\n*(No market state data for tick {tick} — missing simulation file)*\n")

        # Bulletin
        MISSING_BULLETINS = {7, 12}
        bulletin_path = WORLD / f"bulletin_{ts}.json"
        bulletin = load(bulletin_path)
        if bulletin:
            lines.append(h3("Community Bulletin Board"))
            for ev in bulletin.get("events", []):
                src = ev.get("source_agent","?")
                etype = ev.get("type","?")
                vis = ev.get("visibility","")
                desc = ev.get("description","")
                lines.append(f"\n**[{etype.upper()}]** `{src}` *(visibility: {vis})*\n")
                lines.append(blockquote(desc))
        elif tick in MISSING_BULLETINS:
            lines.append(h3("Community Bulletin Board"))
            lines.append(f"\n> **Known gap:** The world bulletin for tick {tick} "
                         f"was not generated by the observer agent during this sim run. "
                         f"Individual agent actions still took place (see Agent Actions above).\n")

        # Building health
        tick_bstates = building_ticks.get(str(tick), {})
        if tick_bstates and building_list:
            lines.append(h3("Building States"))
            lines.append("| Building | Label | Health | Visual State | Visible |")
            lines.append("|----------|-------|--------|--------------|---------|")
            for b in building_list:
                bid = b["id"]
                bs  = tick_bstates.get(bid, {})
                health = bs.get("health", "—")
                vs     = bs.get("visual_state", "—")
                vis    = "✓" if bs.get("visible", True) else "✗"
                health_bar = ""
                if isinstance(health, (int, float)):
                    filled = int(health / 10)
                    health_bar = f" {'█'*filled}{'░'*(10-filled)}"
                lines.append(f"| `{bid}` | {b.get('label','')} | {health}{health_bar} | `{vs}` | {vis} |")

        # ── Agent actions and inner lives ──────────────────────────────────
        lines.append(h3(f"Agent Actions — Tick {tick:02d}"))

        for adir in agent_dirs():
            aid = adir.name
            action_path = adir / "actions" / f"tick_{tick:03d}.json"
            action = load(action_path)
            if not action:
                # Try to get from obs summary
                if obs_summary and aid in obs_summary:
                    s = obs_summary[aid]
                    lines.append(h4(f"{s.get('name', aid)}  ·  `{aid}`"))
                    lines.append(f"*Emotion: {s.get('emotion','?')} · Archetype: {s.get('archetype','?')}*\n")
                    if s.get("inner_monologue"):
                        lines.append("**Inner Monologue:**")
                        lines.append(blockquote(s["inner_monologue"]))
                    for act in s.get("actions", []):
                        lines.append(f"\n- {act[:600]}")
                continue

            # Universal schema extractor — handles 7+ different sim formats
            name, emotion, archetype, monologue, assessment, chosen, econ = \
                extract_action_universal(action, aid)

            lines.append(h4(f"{name}  ·  `{aid}`"))
            lines.append(f"*Emotion: **{emotion}** · Archetype: {archetype}*\n")

            if assessment:
                lines.append("**Internal Assessment:**")
                lines.append(blockquote(assessment))

            if monologue:
                lines.append("**Inner Monologue:**")
                lines.append(blockquote(monologue))

            if chosen:
                lines.append(f"\n**Chosen Actions ({len(chosen)}):**")
                for i, act in enumerate(chosen, 1):
                    if isinstance(act, str):
                        lines.append(f"\n**Action {i}**")
                        lines.append(blockquote(act))
                        continue
                    atype  = act.get("type", act.get("action_type", "?"))
                    desc   = act.get("description", act.get("summary", act.get("action", "")))
                    target = act.get("target_agent", act.get("to_agent"))
                    res    = act.get("resources_involved", "")
                    reason = act.get("reasoning", act.get("rationale", ""))
                    lines.append(f"\n**Action {i} — `{atype}`**"
                                 + (f" → `{target}`" if target else ""))
                    if desc:
                        lines.append(blockquote(str(desc)))
                    if res:
                        lines.append(f"*Resources: {res}*\n")
                    if reason:
                        lines.append(f"*Reasoning: {reason}*\n")

            if econ:
                non_zero = {k: v for k, v in econ.items() if v and v not in [0, "none", False, []]}
                if non_zero:
                    lines.append("\n**Economic Effects:**")
                    for k, v in non_zero.items():
                        if isinstance(v, list):
                            lines.append(f"  - {k}: {', '.join(str(x) for x in v)}")
                        else:
                            lines.append(f"  - {k}: `{v}`")

        # ── Outcomes ──────────────────────────────────────────────────────
        lines.append(h3(f"Outcomes — Tick {tick:02d}"))
        any_outcomes = False
        for adir in agent_dirs():
            aid = adir.name
            out_path = adir / f"outcomes_tick_{tick:03d}.json"
            outcomes = load(out_path)
            if not outcomes:
                continue
            if isinstance(outcomes, dict):
                outcomes = [outcomes]
            if not outcomes:
                continue
            any_outcomes = True

            # Get agent name from state
            state = load(adir / "state.json")
            aname = state["identity"]["name"] if state else aid

            lines.append(h4(f"{aname}  ·  `{aid}`"))
            for out in outcomes:
                action_text = out.get("action", "")
                narrative   = out.get("narrative", "")
                sav_d = out.get("savings_delta", 0)
                str_d = out.get("stress_delta", 0)
                emp_c = out.get("employment_changed", False)

                if action_text:
                    lines.append(f"**Action:** {action_text[:400]}\n")
                lines.append(f"**Outcome:** savings Δ `${sav_d:+,}` · stress Δ `{str_d:+.2f}` · "
                             f"employment changed: `{'YES' if emp_c else 'no'}`\n")
                if narrative:
                    lines.append(blockquote(narrative[:600]))

            # Show tick savings/stress from viz-data if available
            va = viz_agents.get(aid)
            if va:
                snap = va.get("history", {}).get(str(tick), {})
                if snap:
                    lines.append(f"*End-of-tick state: savings ${snap.get('savings',0):,} · "
                                 f"stress {snap.get('stress','?')} · "
                                 f"employment: {snap.get('employment_status','?')}*\n")

        if not any_outcomes:
            if tick == 7:
                lines.append(f"\n> **Known gap:** Tick 7 outcome files were never generated "
                             f"(`post_tick.sh` was not run for this month). Actions exist "
                             f"but economic consequences were not computed by the sim engine.\n")
            else:
                lines.append(f"\n*(No outcome files for tick {tick} — check sim run logs)*\n")

        # ── Transactions ──────────────────────────────────────────────────
        lines.append(h3(f"Transactions — Tick {tick:02d}"))
        txn_tick_dir = TXN / "resolved" / ts
        txns_found = []
        if txn_tick_dir.exists():
            for txf in sorted(txn_tick_dir.glob("*.json")):
                td = load(txf)
                if td:
                    txns_found.append(td)

        # Ticks with no transaction files (structurally absent from sim)
        NO_TXN_TICKS = {0,1,2,3,7,9}  # ticks where sim never generated txn files
        if txns_found:
            lines.append(f"*{len(txns_found)} agent transaction files this tick.*\n")
            for td in txns_found:
                from_n  = td.get("from_name", td.get("from_agent","?"))
                status  = td.get("status","?")
                txlist  = td.get("transactions", [])
                if not txlist:
                    continue
                lines.append(f"\n**From {from_n}** *(status: {status})*")
                for tx in txlist:
                    ttype = tx.get("type","?")
                    to_n  = tx.get("to_name", tx.get("to_agent","?"))
                    desc  = tx.get("description","")
                    res   = tx.get("resources", {})
                    exp   = tx.get("expected_outcome","")
                    lines.append(f"\n  - **[{ttype}]** → {to_n}:  ")
                    lines.append(f"    {desc[:400]}  ")
                    if res:
                        rtype = res.get("type","?")
                        rdir  = res.get("direction","?")
                        ramt  = res.get("amount","?")
                        lines.append(f"    *Resources: {rtype} · {rdir} · amt={ramt}*  ")
                    if exp:
                        exp_str = j(exp) if not isinstance(exp, str) else exp
                        lines.append(f"    *Expected: {exp_str[:300]}*")
        elif tick in NO_TXN_TICKS:
            lines.append(f"\n> **Known gap:** Transaction files were not generated "
                         f"for tick {tick} by the sim engine (early ticks used a different "
                         f"run format). Bilateral exchanges happened but were not recorded "
                         f"in the transactions ledger.\n")
        else:
            lines.append(f"\n*(No resolved transaction files for tick {tick})*\n")

        lines.append(hr())


def build_social_graph(lines):
    lines.append(h1("PART IV — SOCIAL GRAPH"))
    sg = load(VIZDATA / "social_graph.json")
    if not sg:
        lines.append("*(social_graph.json not found)*\n")
        return

    nodes = sg.get("nodes", [])
    edges = sg.get("edges", [])
    lines.append(f"**{len(nodes)} agents · {len(edges)} relationships**\n")

    lines.append(h2("Network Nodes (Agents by Degree)"))
    lines.append("| Agent ID | Degree | Avg Trust | Cluster |")
    lines.append("|----------|--------|-----------|---------|")
    for n in sorted(nodes, key=lambda x: x.get("degree", 0), reverse=True):
        lines.append(f"| `{n.get('id','')}` | {n.get('degree','?')} | "
                     f"{n.get('avg_trust','?')} | {n.get('cluster','?')} |")

    lines.append(h2("All Relationships (228 edges)"))
    lines.append("| Source | Target | Trust | Type | Power? |")
    lines.append("|--------|--------|-------|------|--------|")
    for e in sorted(edges, key=lambda x: x.get("trust", 0), reverse=True):
        power = "⚡ power_over" if e.get("power_over") else ""
        lines.append(f"| `{e.get('source','')}` | `{e.get('target','')}` | "
                     f"{e.get('trust','?')} | {e.get('type','')} | {power} |")

    # Key relationship clusters
    lines.append(h2("Key Relationship Clusters"))
    power_edges = [e for e in edges if e.get("power_over")]
    if power_edges:
        lines.append(h3("Power Relationships"))
        for e in power_edges:
            lines.append(f"- `{e['source']}` → `{e['target']}` (trust {e.get('trust','?')})")

    high_trust = [e for e in edges if (e.get("trust",0) or 0) >= 0.7]
    if high_trust:
        lines.append(h3("High-Trust Bonds (≥0.70)"))
        for e in sorted(high_trust, key=lambda x: x.get("trust",0), reverse=True):
            lines.append(f"- `{e['source']}` ↔ `{e['target']}`: {e.get('trust','?')} [{e.get('type','')}]")

    low_trust = [e for e in edges if 0 < (e.get("trust",0) or 0) <= 0.25]
    if low_trust:
        lines.append(h3("Weak / Strained Bonds (≤0.25)"))
        for e in sorted(low_trust, key=lambda x: x.get("trust",0)):
            lines.append(f"- `{e['source']}` ↔ `{e['target']}`: {e.get('trust','?')} [{e.get('type','')}]")

    lines.append(hr())


def build_phenomena(lines):
    lines.append(h1("PART V — DETECTED PHENOMENA"))
    phen = load(VIZDATA / "phenomena.json")
    if not phen:
        lines.append("*(phenomena.json not found)*\n")
        return

    lines.append(h2("Scenario Events (5)"))
    lines.append("| Tick | Label | Description |")
    lines.append("|------|-------|-------------|")
    for p in phen.get("scenario_events", []):
        lines.append(f"| {p.get('tick','?')} | **{p.get('label','')}** | {p.get('description','')} |")

    lines.append(h2("Economic & Social Phenomena (29)"))
    lines.append("| Tick | Type | Severity | Label | Description |")
    lines.append("|------|------|----------|-------|-------------|")
    for p in sorted(phen.get("phenomena", []), key=lambda x: (x.get("tick",0), x.get("type",""))):
        lines.append(f"| {p.get('tick','?')} | `{p.get('type','')}` | "
                     f"{'🔴'*p.get('severity',1)} | {p.get('label','')} | "
                     f"{p.get('description','')[:200]} |")

    lines.append(h2("Timeseries — All Metrics by Tick"))
    ts_map = phen.get("timeseries", {})
    # Header
    headers = ["tick","employment_rate","spending_index","car_ownership_rate",
               "robotaxi_rate","gini","protests","retraining_enrollments",
               "mutual_aid_events","dealership_index","insurance_policies","mechanic_index"]
    lines.append("| " + " | ".join(h.replace("_"," ") for h in headers) + " |")
    lines.append("| " + " | ".join(["---"]*len(headers)) + " |")
    for tick in TICKS:
        td = ts_map.get(str(tick), {})
        if not td:
            continue
        row = [str(tick)]
        for h_ in headers[1:]:
            v = td.get(h_, "—")
            if isinstance(v, float):
                v = f"{v:.3f}" if v < 1 else f"{v:.1f}"
            elif v is None:
                v = "—"
            row.append(str(v))
        lines.append("| " + " | ".join(row) + " |")

    lines.append(hr())


def build_final_state(lines):
    lines.append(h1("PART VI — FINAL STATE (Tick 14)"))

    # World final market state
    wms = load(WORLD / "market_state.json")
    wstate = load(WORLD / "state.json")

    if wms:
        lines.append(h2("Final World Market State"))
        lines.append(code(j(wms), "json"))

    if wstate:
        lines.append(h2("World State Object"))
        lines.append(code(j(wstate), "json"))

    # Agent end states (from viz-data agents.json — full final state)
    agdata = load(VIZDATA / "agents.json")
    if agdata:
        lines.append(h2("Agent Final States — Summary Table"))
        lines.append("| Agent | Name | Tier | Employment | Savings | Stress | "
                     "Runway | Grief | Archetype | Owns Car |")
        lines.append("|-------|------|------|-----------|---------|--------|"
                     "--------|-------|-----------|----------|")
        for aid, ag in sorted(agdata.items(), key=lambda x: (x[1].get('tier',9), x[0])):
            h14 = ag.get("history", {}).get("14", {})
            lines.append(
                f"| `{aid}` | {ag.get('name','')} | T{ag.get('tier','?')} | "
                f"{h14.get('employment_status', ag.get('history',{}).get('0',{}).get('employment_status','?'))} | "
                f"${h14.get('savings', ag.get('savings',0)):,} | "
                f"{h14.get('stress', ag.get('stress','?'))} | "
                f"{ag.get('runway_months','?')}mo | "
                f"{ag.get('grief_stage','?')} | "
                f"{ag.get('archetype','?')} | "
                f"{'✓' if ag.get('owns_car') else '✗'} |"
            )

    lines.append(h2("Agent Final Reflections"))
    lines.append("> *Each agent's final reflection — written at the end of the simulation.*\n")
    agdata2 = load(VIZDATA / "agents.json")
    if agdata2:
        for aid, ag in sorted(agdata2.items(), key=lambda x: (x[1].get('tier',9), x[0])):
            refs = ag.get("reflections", [])
            last = refs[-1] if refs else None
            if last:
                lines.append(h4(f"{ag.get('name',aid)}  ·  `{aid}`  ·  Tier {ag.get('tier','?')}"))
                lines.append(f"*Tick {last.get('tick','?')} reflection:*\n")
                lines.append(blockquote(last.get("text", "")))

    lines.append(h2("Final Agent Deep Profiles"))
    lines.append("> *Full final state for every agent — all fields from state.json at tick 14.*\n")
    for adir in agent_dirs():
        aid = adir.name
        state = load(adir / "state.json")
        if state:
            ident = state.get("identity", {})
            lines.append(h4(f"{ident.get('name', aid)}  ·  `{aid}`"))
            lines.append(code(j(state), "json"))

    lines.append(hr())
    lines.append(h1("END OF MONOLITH"))
    lines.append("""
*This document was auto-generated from the raw FrictionlessSimAI simulation files.*
*Total simulation: 30 agents × 15 ticks × full psychology = the complete record of Millfield.*

> "We simulate not to predict the future, but to understand the present."
""")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("Building MONOLITH.md — full temporal record of Millfield...")
    lines = []

    build_preamble(lines)
    print("  [1/6] Preamble done")

    build_world_config(lines)
    print("  [2/6] World config done")

    build_agent_profiles(lines)
    print("  [3/6] Agent profiles done")

    build_tick_record(lines)
    print("  [4/6] Tick records done")

    build_social_graph(lines)
    print("  [5/6] Social graph done")

    build_phenomena(lines)
    build_final_state(lines)
    print("  [6/6] Phenomena + final state done")

    content = "\n".join(lines)
    OUT.write_text(content, encoding="utf-8")

    size_mb = OUT.stat().st_size / 1_048_576
    word_count = len(content.split())
    char_count = len(content)
    print(f"\nDone! Written to: {OUT}")
    print(f"  Size:   {size_mb:.2f} MB")
    print(f"  Words:  {word_count:,}")
    print(f"  Chars:  {char_count:,}")
    print(f"  Lines:  {content.count(chr(10)):,}")

if __name__ == "__main__":
    main()
