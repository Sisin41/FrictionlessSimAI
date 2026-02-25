# Frictionless Economy Simulation

**30 LLM agents in a small town. Autonomous transport kills the car economy. What happens?**

No SDK. No framework. No API wrapper. Every agent is a **Claude Code subagent** that reads its own state files, makes a decision as a human persona, and writes the result back to the filesystem. The filesystem IS the world. Claude Code IS the runtime.

## How It Works

```
                    Claude Code (main session)
                           |
                    sim-orchestrator subagent
                    +------+------------------+
                    |      |                  |
              bash tick.sh N          bash post_tick.sh N
              (world setup)           (resolve + update)
                    |
        +-----------+-----------+
        v           v           v
  agent-ceo    agent-jake   agent-betty    ... x 30
   reads:        reads:       reads:
   state.json    state.json   state.json
   inbox.json    inbox.json   inbox.json
   memory.json   memory.json  memory.json
      |              |            |
   writes:        writes:     writes:
   actions/       actions/    actions/
   tick_000.json  tick_000.json tick_000.json
```

Each agent subagent runs in its own context window with its own persona. It reads its files using bash/read tools, makes a decision **in character**, and writes a JSON file. No agent sees another agent's decision until the next tick. Pure blackboard pattern.

## Quick Start

```bash
cd frictionless-sim

# 1. Generate 30 agents with full state vectors
python generate_agents.py

# 2. Generate 33 Claude Code subagent .md files
python generate_subagents.py

# 3. Start Claude Code in the project
claude

# 4. In Claude Code:
> Use the sim-orchestrator to run tick 0
```

That's it. The orchestrator will:
1. Run `bash tick.sh 0` to set up world state and populate inboxes
2. Delegate to each of the 30 agent subagents for decisions
3. Run `bash post_tick.sh 0` to resolve transactions and update states
4. Report the results

## Manual Tick (Step by Step)

```bash
# Step 1: World update
bash tick.sh 3

# Step 2: In Claude Code, delegate to agents (tier by tier)
> Use the agent-ceo_regional_auto agent to decide for tick 3 (tick pad 003)
> Use the agent-bank_manager agent to decide for tick 3 (tick pad 003)
> Use the agent-salesperson_jake agent to decide for tick 3 (tick pad 003)
# ... repeat for all 30 agents

# Step 3: Post-tick processing  
bash post_tick.sh 3

# Step 4: Analysis
> Use the sim-observer agent to analyze tick 3
```

## The Scenario

Millfield, population ~2,000. Car-dependent economy. Autonomous robotaxis arrive.

| Month | Event |
|-------|-------|
| 0 | Baseline — economy normal |
| 1 | Robotaxi company announces Millfield expansion |
| 3 | **Robotaxi launches** — $0.18/mile vs $0.55/mile |
| 5 | Used car prices drop 25%, dealership layoffs |
| 7 | **Auto Mall closes** — 45 jobs lost, cascade begins |
| 9 | State announces retraining fund |
| 12 | New businesses in old auto spaces |
| 15 | New equilibrium forming |

## The 30 Agents (by tier)

**T1 Strategic**: Patricia Hawkins (CEO), David Chen (Bank Mgr), Maria Santos (Council)
**T2 Operational**: Rick Tanner (Dealership GM), Linda Park (Insurance Mgr), Angela Wright (HR)
**T3 Directly Hit**: Jake & Tamika (salespeople), Carlos & Sarah (mechanics), Amir (gas station), Tom & Priya (insurance), Kevin (loans)
**T4 Downstream**: Betty (diner), Frank (driving school), Miguel (car wash), Denise (parking), James & Rachel (commuters), Dale (truck owner), Dorothy (retiree), Zoe (gig worker), Nicole (nurse), Howard (parts store), Robert & Grace (rideshare), Stephanie (real estate), Mark (auto shop teacher), Lisa (community organizer)

## What to Watch For

1. **Archetype transitions** — stable -> freezer -> adapter (or not)
2. **Cascade chains** — dealership -> mechanic -> diner -> community
3. **Identity grief** — Rick (90% attached) vs Tamika (30%)
4. **Informal economy emergence** — barter, coops, novel solutions
5. **Social contagion** — anxiety spreading vs hope spreading
6. **Feedback loops** — deflationary spiral or innovation cycle
7. **Tail behaviors** — hustlers and builders exploiting chaos

## Source of Truth

`frictionless_economy_simulation_spec.docx` — 21 sections, full physics. Agent state vectors, decision hierarchy, transaction primitives, temporal/spatial/psychological mechanics, feedback loops, observation framework, historical calibration, behavioral archetypes, car micro-economy case study.
