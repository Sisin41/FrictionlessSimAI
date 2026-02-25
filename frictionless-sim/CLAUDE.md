# Frictionless Economy Simulation

## Architecture
Filesystem-as-world blackboard. **Every agent is a Claude Code subagent.** No SDK, no Python API calls. Claude Code IS the runtime.

- 1 **agent-worker** subagent — ephemeral, gets assigned any persona dynamically, reads that agent's files, decides, writes back, forgets
- 1 **sim-orchestrator** subagent — runs tick loop, batches agent-worker calls, verifies results
- 1 **sim-observer** subagent — post-tick analysis
- 1 **sim-analyst** subagent — cross-tick deep analysis
- `tick.sh` / `post_tick.sh` — filesystem plumbing (world setup, state updates, metrics)

## Running a Tick

### Method 1: Via Orchestrator
```
Use the sim-orchestrator to run tick 0
```

### Method 2: Manual
```bash
bash tick.sh 0                              # Set up world state + inboxes
# Delegate to each agent subagent for decisions
bash post_tick.sh 0                         # Resolve transactions, update states, metrics
# Use sim-observer for analysis
```

## Setup
```bash
python generate_agents.py      # Seed 30 agent state files
# That's it. 4 subagent .md files are already in .claude/agents/
```

## Key Files
| Path | Purpose |
|------|---------|
| `.claude/agents/agent-worker.md` | Ephemeral worker — becomes any agent |
| `.claude/agents/sim-*.md` | Orchestrator, observer, analyst |
| `config/simulation.json` | Params, current tick |
| `config/scenario.json` | World events timeline |
| `agents/{id}/state.json` | Agent state vector |
| `agents/{id}/inbox.json` | Filtered world info |
| `agents/{id}/actions/tick_NNN.json` | Decisions per tick |
| `observations/tick_NNN/` | Metrics and analysis |

## Source of Truth
`frictionless_economy_simulation_spec.docx` — 21 sections, full physics specification.
