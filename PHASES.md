# FrictionlessSimAI — Development Phases
## Implementation-Complete Breakdown
### Updated: March 3, 2026 (Data-Verified)

---

## Pre-Phase: Data Pipeline ✓ COMPLETE

**Status**: Done. All scripts run, all outputs verified.

```
data-pipeline/
  bundle.py              ← master orchestrator
  world_layout.py        ← isometric grid + building/position definitions
  derive_history.py      ← reconstructs per-tick agent state from outcomes
  derive_buildings.py    ← building health 0-100 per tick from market data
  detect_phenomena.py    ← auto-detects 29 phenomena + 5 scenario events
  build_social_graph.py  ← 228 edges, 1 connected cluster
  build_transactions.py  ← 168 txns indexed by tick + agent

viz-data/
  agents.json       453KB   30 agents + history + reflections
  transactions.json 125KB   168 transactions
  social_graph.json  47KB   228 relationship edges
  buildings.json     50KB   17 buildings × 15 ticks
  phenomena.json     19KB   29 phenomena + timeseries
  world.json          4KB   grid layout
  meta.json           8KB   scenario + locality
  TOTAL:           0.69MB   (~0.10MB gzipped)
```

To regenerate after new sim ticks:
```bash
cd data-pipeline && python3 bundle.py
```

---

## Phase 1: Static World + Playback
### Estimate: 2 weeks
### Deliverable: Working app, tick scrub shows correct world state

### 1.1 PixiJS World Renderer

**File**: `viz/src/pixi/WorldRenderer.ts`

Build the `WorldRenderer` class that `WorldCanvas.tsx` instantiates.

```typescript
class WorldRenderer {
  app: Application
  tileLayer:     Container   // ground tiles
  buildingLayer: Container   // buildings, z-sorted
  agentLayer:    Container   // agent sprites, z-sorted
  uiLayer:       Container   // labels, indicators

  init(canvas: HTMLElement): Promise<void>
  renderTick(tick: number, agents: Record<string, Agent>, buildingStates: Record<string, BuildingTickState>): void
  setHighlight(agentId: string | null): void
  destroy(): void
}
```

**Tile grid** (`renderTileGrid`):
- Iterate all (col, row) in GRID_COLS × GRID_ROWS
- `isoToScreen(col, row)` → draw diamond tile
- Tile tint by zone (from world_layout.ZONES)
- Z-order: `tileDepth(col, row)` = col + row

**Building sprites** (`renderBuildings`):
- For each building in `buildings.json`:
  - `isoToScreen(tile[0], tile[1])` → screen position
  - Look up health in `buildingTicks[tick][building.id]`
  - Apply `getBuildingVisual(state)` → tint, alpha, FOR LEASE sign visible
  - Apply `applyBuildingOverrides(id, visual, health)` → special buildings
  - Render: base rectangle + roof polygon (simple box, not art yet)
  - Z-order: `tileDepth(tile[0], tile[1])`
  - Click handler → `selectBuilding(building.id)`
  - Invisible if `appears_tick > currentTick` (informal market)

**Agent sprites** (`renderAgents`):
- For each of 30 agents:
  - Get `snap = agent.history[tick]`
  - Determine location via `getAgentLocation(...)` from `agentSprite.ts`
  - Map location type to tile:
    - `workplace` → `AGENT_WORKPLACE[agent.id]` → building tile
    - `home`      → `HOME_TILES[agent.id]`
    - `park`      → park building tile
    - `community_center` → community_center tile
    - `high_school`      → high_school tile
  - `isoToScreen(col, row)` → screen position
  - Tint = `TIER_TINT[agent.tier]` overlaid with `GRIEF_TINT[agent.grief_stage]`
  - Scale × `getWalkSpeed` (no animation yet, just position)
  - Danger ring: if `runway_months < 6`, draw circle with `getRunwayRingColor`
  - Click handler → `selectAgent(agent.id)`

**Z-ordering**: Critical for isometric. All renderables sorted by `col + row` before draw.

---

### 1.2 Scrub Bar + Playback Engine

**File**: `viz/src/hooks/usePlayback.ts`

```typescript
export function usePlayback() {
  // Tick advance logic using requestAnimationFrame
  // Speed: 0.5x/1x/2x/5x/10x — advances tick every N seconds
  // At speed 1x: 1 tick per second
  // At speed 10x: 10 ticks per second
  // Interpolation: 0-1 advances continuously between tick N and N+1
}
```

Attach to `ScrubBar.tsx`. When playing, drive `setInterpolation` each frame.
Phase 1: interpolation not used in renderer yet (jumps to nearest tick).
Phase 2: renderer lerps agent positions using interpolation value.

---

### 1.3 Agent Card (Phase 1 subset)

All fields in `AgentCard.tsx` are stubbed. Phase 1 wire-up:

| UI Element | Data Source | Priority |
|-----------|------------|---------|
| Name, age, role | `agent.name/age/role` | P1 |
| Tier, archetype badge | `agent.tier/archetype` | P1 |
| Grief stage badge | `agent.grief_stage` | P1 |
| Savings (current tick) | `agent.history[tick].savings` | P1 |
| Stress bar | `agent.history[tick].stress` | P1 |
| Runway bar | `agent.runway_months` | P1 |
| Employment status | `agent.history[tick].employment_status` | P1 |
| Latest reflection | `agent.reflections[-1].text` | P1 |
| Agency bar | `agent.agency` | P2 |
| Biases | `agent.biases.*` | P2 |
| Commitments | `agent.commitments[]` | P2 |
| Inner monologue | `agent.history[tick].inner_monologue` | P2 |
| Transformations | `agent.transformations[0]` | P2 |

---

### 1.4 Economic Dashboard

`EconomicDash.tsx` is implemented. Wire to timeseries data from `phenomena.json`.

Key stats per tick (all from `viz-data/phenomena.json → timeseries`):
- `employment_rate`, `spending_index`, `car_ownership_rate`
- `robotaxi_rate`, `gini`, `protests`, `retraining_enrollments`

Color rule: field value vs baseline — green if better than baseline, red if worse.

---

### 1.5 Scrub Bar Markers

`ScrubBar.tsx` is implemented. Wire phenomena and scenario_events.

Marker types from `phenomena.json`:
- `scenario_event` (5): blue pins at ticks 0,1,3,8,14
- `employment_collapse` (2): red triangles at ticks 5, 9
- `spending_collapse` (1): orange triangle at tick 5
- `protest_wave` (4): red exclamation at ticks 4,8,9,14
- `herd_retraining` (5): yellow circles at ticks 4,5,8,10,13
- `gini_breach` (3): red diamonds at ticks 5,8,9
- `runway_crisis` (1): red pulse at tick 14
- `depression_cluster` (1): purple at tick 9
- `informal_emergence` (1): purple star at tick 0*

*Note: `informal_emergence` detected at tick 0 due to data ordering — verify correct tick.

---

### Phase 1 Definition of Done
- [ ] App loads all 7 JSON files without errors
- [ ] Isometric tile grid renders (26×20)
- [ ] 17 buildings visible at correct tiles
- [ ] Building tint changes based on health at current tick
- [ ] 30 agent sprites visible at correct positions for tick 0
- [ ] Agent positions update when tick scrubs
- [ ] FOR LEASE sign appears on Bank (tick 5+), Driving School (tick 1+)
- [ ] Community Center gets brighter as other buildings dim
- [ ] Clicking agent opens AgentCard with correct data
- [ ] Clicking building opens BuildingCard with health sparkline
- [ ] Scenario event markers on scrub bar (5 blue pins)
- [ ] Phenomena markers on scrub bar (24 colored markers)
- [ ] Economic dashboard shows correct values at each tick

---

## Phase 2: Animations + Emotional State
### Estimate: 2 weeks
### Deliverable: Agents move, express grief, buildings transition cinematically

### 2.1 Agent Movement Interpolation

Between tick N and N+1, agents animate from old position to new position.

```typescript
// In WorldRenderer.renderAgentSmooth(agent, tick, interpolation):
const fromTile = getAgentTile(agent, tick)
const toTile   = getAgentTile(agent, tick + 1)
const {x, y}   = lerpTile(fromTile, toTile, interpolation)
sprite.position.set(x, y)
```

Movement triggers:
- `employment_changed=True` at tick T: agent moves from home → workplace (or vice versa)
- Tick 1 (RoboRide announcement): agents with `normalcy_bias < 0.5` move toward City Hall
- Tick 3 (RoboRide launches): rideshare drivers start visiting park more
- Tick 5 (mass layoff): laid-off agents move home, then wander
- Tick 7 (informal market): Dorothy and Dale walk to park area

### 2.2 Sprite Animation States

Implement 6 animation states using sprite sheet or procedural animation:

| State | Visual | Trigger |
|-------|--------|---------|
| `walk_ne` | Walk cycle, forward | Employed, moving to workplace |
| `idle` | Stands, slight sway | At destination, normal |
| `sit` | Seated | Depression OR runway < 0.5 months |
| `slump` | Head down, shuffles | Stress > 0.7 |
| `hustle` | Fast walk, bouncy | Hustler archetype, high agency |
| `work` | Desk/counter pose | Inside building (employed) |

Implementation: use 32×48px pixel art sprites. 4 directional variants.
If art not ready: use colored rectangles with state-specific scaling (sit = shorter).

### 2.3 Building State Transitions

Between ticks, buildings DON'T jump state instantly.
Implement `BuildingTransitionManager`:

```typescript
class BuildingTransitionManager {
  // Crossfade tint over 0.3s when health crosses a threshold
  // Light flicker on 'declining' state: random alpha variation ±0.1
  // FOR LEASE sign: slides in from top over 0.5s
  // Closing: darkness sweeps across from top
}
```

Key transitions to animate:
- Bank going dark at tick 5 (David gets laid off)
- Driving School closing at tick 1
- Diner collapsing from 83→48 at tick 5 (most dramatic)
- Community Center brightening tick 4-9
- Informal Market materializing at tick 7 (stalls pop up one by one)

### 2.4 Scenario Event Animations

When playback reaches a scenario event tick:

| Event | Animation |
|-------|-----------|
| Tick 1: RoboRide announces | White news-flash across top. Agents check phones. |
| Tick 3: RoboRide launches | 1 robotaxi sprite appears on main road animation path. |
| Tick 8: Price drop | Robotaxi sprites multiply. Several car sprites disappear from homes. |
| Tick 14: Full coverage | 3+ robotaxis. Mass car disappearances. |

### 2.5 Phenomena Visual Events

| Phenomenon | Animation |
|-----------|-----------|
| Mass Job Loss (tick 5, 9) | Buildings flash dark simultaneously. Agents stream home. |
| Protest Wave (tick 8: 9 events) | Crowd sprite cluster forms near City Hall. |
| Informal Emergence (tick 7) | Stall sprites materialize in park one by one. |
| Depression Cluster (tick 9) | 4 agents drop to `sit` state simultaneously. Purple pulse. |
| Runway Crisis (tick 14) | 8 agent sprites pulse red rings simultaneously. |

### 2.6 RoboTaxi Sprites

- Small self-driving vehicle sprite on roads
- Quantity matches `robotaxi_adoption_rate × 28` at each tick
- Loop: spawn at edge, traverse main road path, despawn
- Speed: constant, no interaction with agents
- Appears tick 3, multiplies tick 8, at full presence tick 14

### Phase 2 Definition of Done
- [ ] Agents animate between positions as tick advances
- [ ] `grief_stage=depression` agents sit on park bench
- [ ] `runway_months < 1` agents have red pulse ring
- [ ] `stress > 0.7` agents slump/shuffle
- [ ] Bank building goes dark at tick 5 (transition animation)
- [ ] Community Center brightens over time (inverse animation)
- [ ] Informal Market stalls materialize at tick 7
- [ ] RoboTaxi sprites circulate on roads from tick 3
- [ ] Mass layoff at tick 5: buildings flash + agents move home
- [ ] Protest crowd at tick 8 near City Hall

---

## Phase 3: Documentary Layer
### Estimate: 1 week
### Deliverable: The game has a voice. Every agent has a story.

### 3.1 Reflection Caption System

When playback reaches a tick that has reflections:
- Agent sprite pulses softly
- Caption appears at bottom of canvas (like film subtitles)
- Fade in/hold 4s/fade out
- Text: `memory.reflections[n].text` (first 200 chars)
- Attribution: agent name + tick

Available reflection ticks per agent:
```
All agents have reflections at ticks 6 and 9.
Total: 30 agents × 2 = 60 reflection moments.
```

Implementation:
```typescript
// In usePlayback.ts: when tick === reflection.tick, emit 'reflection' event
// In ReflectionCaption.tsx: render bottom overlay with agent name + text
```

### 3.2 Inner Monologue Speech Bubbles

On hover/select, show agent's `inner_monologue` for current tick as speech bubble.

Source: `agent.history[tick].inner_monologue` (from `actions/tick_NNN.json`)

All 30 agents have action files for most ticks (14 ticks × 30 agents = ~420 action entries).

### 3.3 "Follow Agent" Mode

Click "Follow Agent" on AgentCard → camera tracks selected agent.
- World pans to keep agent centered
- Agent sprite slightly enlarged (1.3×)
- Other agents slightly dimmed
- Their reflection captions are prioritized

### 3.4 Outcome Narrative Tooltip

When hovering over scrub bar at a tick:
- Show `agent.history[tick].outcome_narrative` for selected agent
- "You [action]. Savings dropped by $X."
- This text exists for all 30 agents at all ticks with outcome data

### Phase 3 Definition of Done
- [ ] Reflection captions appear at tick 6 and 9 for all agents
- [ ] Hover over agent → speech bubble with inner monologue text
- [ ] "Follow Agent" button works — camera tracks agent
- [ ] Scrub bar hover shows outcome narrative for selected agent

---

## Phase 4: Information Layers
### Estimate: 1 week
### Deliverable: All 7 overlays working

### 4.1 Economic Heatmap (Layer: `economic_heatmap`)

Zone-level color overlay showing economic health.

```typescript
// Source: buildings.json — average health of buildings in each zone
// Zone boundaries from world_layout.ZONES
// Color: green(70+) → amber(50-70) → red(<50)
// Rendered: semi-transparent polygons over tile zones
```

Zone health at tick 14 (approximate):
- auto_row: ~50 (Auto Mall 68, Gas 63, Diner 24, Parts 67)
- services_row: ~60
- civic_district: ~72 (City Hall 95, Bank 25, Community 100)
- education: ~47 (High School 85, Driving School 10)
- park: 100

### 4.2 Social Network Graph (Layer: `social_graph`)

Render 228 edges from `social_graph.json`.

```typescript
// D3 force-directed layout OR just draw lines between agent sprites
// Edge rendering:
//   trust 0.21-0.40: grey dotted, alpha 0.3
//   trust 0.40-0.60: white dashed, alpha 0.5
//   trust 0.60+:     white solid, alpha 0.8, slight glow
//   type=neighbor:   amber
//   type=colleague:  teal
//   type=professional: blue
// Power arrows: for power_over relationships, directional arrow
```

Key relationships to highlight:
- Patricia → Rick (power_over, high trust 0.82) — the CEO-GM axis
- Maria → Lisa (builder alliance) — civic network
- Dorothy (hub: high degree, community connector)
- Tom Bradley's isolation (laid off tick 8, trust drops)

### 4.3 Information Flow (Layer: `info_flow`)

Animate information propagation from `agents/*/inbox.json`.

```typescript
// At each tick: particles flow between agents who share inbox messages
// CAPABILITY_FACT: sharp white particle, fast
// MARKET_DATA: blue particle, medium speed
// Word of mouth (inferred): orange, slower, degraded opacity
// Particle: arc from source to target, fade in/out
// Show information inequality: T1 agents get clean white,
//   T4 agents get orange/degraded
```

### 4.4 Grief Topology (Layer: `grief_topology`)

Color agent sprites by grief stage instead of tier.

| Stage | Color |
|-------|-------|
| none | white/neutral |
| bargaining | gold #ffd700 |
| anger | red #e53e3e |
| depression | dark grey #4a5568 |
| acceptance | green #48bb78 |
| acceptance_early | light green |

Note: grief_stage comes from `state.json` — current tick 14 only.
For historical grief topology, would need per-tick grief tracking (not currently stored).
Phase 4: use current grief state overlaid on historical positions.

### 4.5 Runway Countdown (Layer: `runway_countdown`)

For each agent's home tile: draw countdown ring.
- Ring width proportional to `runway_months`
- Color: `getRunwayRingColor(runway_months)`
- At tick 14: 8 agents with `runway_months = 0.0` → pulsing red rings
- Animation: ring depletes as ticks advance (based on reconstructed history)

### 4.6 Stress Topology (Layer: `stress_topology`)

Heatmap over residential zones based on per-agent stress.
- Source: `agent.history[tick].stress`
- Each agent's home tile radiates stress as a radial gradient
- Color: blue(0) → yellow(0.5) → red(1.0)
- Shows "stressed neighborhoods" vs calm ones

### 4.7 Transaction Flow (Layer: `transaction_flow`)

Animate transactions at the current tick.
Source: `transactions/by_tick_ids[tick]` → transaction objects.

```typescript
// For each bilateral transaction at currentTick:
//   Draw animated arc from initiator tile to target tile
//   EXCHANGE/COMMITMENT: solid gold arc with coin icon
//   SIGNAL/ASSOCIATION: dotted purple arc
//   mutual_aid: pulsing purple glow
//   no_counterparty: agent raises arm, no response (isolation visual)
// Duration: animates over 2 seconds, loops while tick is active
```

### Phase 4 Definition of Done
- [ ] Economic heatmap shows zone coloring driven by building health
- [ ] Social graph overlay shows 228 edges with trust-based styling
- [ ] Power arrows visible (Patricia→Rick, Maria→others)
- [ ] Info flow: particles appear at ticks with CAPABILITY_FACT events
- [ ] Grief topology: agents colored by grief stage
- [ ] Runway countdown rings on homes, 8 red rings at tick 14
- [ ] Stress heatmap over residential zones
- [ ] Transaction arcs visible at ticks with bilateral transactions

---

## Phase 5: Polish + Shareability
### Estimate: 1 week
### Deliverable: Ship-ready

### 5.1 URL State Sharing

Encode viewer state in URL hash:
```
#tick=9&agent=rick_tanner&layers=social_graph,grief_topology
```

Restore from URL on load. Share a specific moment.

### 5.2 Scenario Comparison (Shell)

Side-by-side layout reserved for future sim runs.
Phase 5: build the layout shell with "Add Scenario" button.
Requires second `viz-data/` directory with different sim output.

### 5.3 Screenshot / Export

"Share this moment" button:
1. Capture PixiJS canvas to PNG
2. Overlay current tick stats
3. Download or copy to clipboard

### 5.4 Keyboard Shortcuts

```
Space:        play/pause
← / →:       step ±1 tick
Shift+← / →: step ±5 ticks
1-7:          toggle layers
F:            follow selected agent
Esc:          deselect / close panels
```

### 5.5 Performance Optimization

Phase 5 profiling targets:
- 30 agents at 60fps: trivial for PixiJS
- Social graph overlay (228 edges): use PIXI.Graphics batching
- Stress heatmap: pre-render to RenderTexture, update once per tick

### 5.6 Mobile / Embed Mode

- Touch controls for scrub bar
- Condensed layout for embed (`?embed=true`)
- Presentation mode: full-screen canvas, minimal UI

### Phase 5 Definition of Done
- [ ] URL encodes tick + selected agent + active layers
- [ ] Navigate to URL → restores exact view
- [ ] Screenshot captures canvas + stats overlay
- [ ] Keyboard shortcuts work
- [ ] Comparison layout shell exists (placeholder content)
- [ ] 60fps confirmed on commodity hardware

---

## Implementation Order Summary

```
Week 1-2:  Phase 1 — Static World
Week 3-4:  Phase 2 — Animations
Week 5:    Phase 3 — Documentary
Week 6:    Phase 4 — Layers
Week 7:    Phase 5 — Polish

Total: ~7 weeks to full feature
Phase 1 alone: shippable MVP (static world + scrub + agent cards)
Phase 1+2: core experience complete
```

---

## Component Dependency Map

```
App.tsx
├── EconomicDash.tsx        ← phenomena.json → timeseries
├── WorldCanvas.tsx
│   ├── WorldRenderer.ts    ← agents + buildings + buildingTicks
│   │   ├── iso.ts          ← projection math
│   │   ├── agentSprite.ts  ← state → visual encoding
│   │   └── buildingSprite.ts ← health → visual encoding
│   └── LayerControls.tsx   ← activeLayers
├── ScrubBar.tsx            ← phenomena + scenarioEvents + timeseries
├── AgentCard.tsx           ← agents[selectedAgentId]
└── BuildingCard.tsx        ← buildings + buildingTicks + agents

store/simStore.ts           ← ALL state, single source of truth
```

---

## Known Limitations / Future Work

1. **Employment reconstruction accuracy** (28/30 agents correct)
   - Patricia Hawkins and Rick Tanner have 2 employment changes; reconstruction is approximate
   - Fix: store employment_status in per-tick outcome files in future sim runs

2. **Missing ticks 7 and 12**
   - Tick 7: no outcomes AND no market_state (completely missing)
   - Tick 12: has outcome files but no market_state
   - Fix: run `post_tick.sh` retroactively for ticks 7 and 12

3. **Grief stage is static** (tick 14 only)
   - Per-tick grief history requires storing it in outcomes
   - Fix: add `grief_delta` to outcomes in future sim runs

4. **Transaction amounts mostly 0**
   - Non-monetary exchanges (skill/service/information) have `resources.amount=0`
   - The real value is in the description text
   - Fix in viz: render description prominently, not just dollar amount

5. **Commuter agents** (James, Rachel, Nicole)
   - Work outside Millfield, no local workplace building
   - Visualize as "leaving town" animation at employed ticks
   - Their RoboRide adoption data is still valid (Rachel: no car, uses RoboRide)

6. **Social graph is static**
   - Relationships as of tick 14, not per-tick
   - Trust values may have shifted during sim
   - Fix: store relationship snapshots per tick in future runs

7. **Scenario comparison requires second sim run**
   - UBI scenario, retraining subsidy scenario not yet simulated
   - Phase 5 comparison shell works when `viz-data-b/` directory exists

---

## Quick Start (Post-Phase 1)

```bash
# 1. Generate viz data from sim
cd data-pipeline
python3 bundle.py

# 2. Install dependencies
cd ../viz
npm install

# 3. Run dev server
npm run dev
# Open http://localhost:5173

# 4. Build for deployment
npm run build
# Outputs to viz/dist/ (static, no server needed)
```
