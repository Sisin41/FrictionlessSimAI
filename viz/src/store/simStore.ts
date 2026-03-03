/**
 * simStore.ts
 * Central Zustand store for all simulation state.
 * Single source of truth for what the renderer sees.
 */

import { create } from 'zustand'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TickSnapshot {
  savings:           number
  stress:            number
  employment_status: 'employed' | 'unemployed' | 'transitioning'
  inner_monologue?:  string
  outcome_narrative?: string
  employment_changed?: boolean
}

export interface AgentReflection {
  tick: number | string
  text: string
}

export interface Agent {
  id:                  string
  name:                string
  age:                 number
  role:                string
  tier:                1 | 2 | 3 | 4
  sector:              string
  archetype:           'builder' | 'adapter' | 'hustler'

  // Psychology (current tick 14)
  grief_stage:         'none' | 'bargaining' | 'anger' | 'depression' | 'acceptance' | 'acceptance_early'
  agency:              number  // 0-1
  stress:              number  // from history
  sentiment:           string

  // Financial (current tick 14)
  savings:             number
  monthly_income:      number
  monthly_expenses:    number
  debt_total:          number
  credit_score:        number
  runway_months:       number
  threat_level:        number

  // Identity
  narrative:           string
  identity_attachment: number
  dependents:          number
  skills:              string[]
  skill_relevance:     number
  historical_conditioning: Array<{event: string, response_pattern: string, lesson: string}>

  // Biases
  biases: {
    status_quo_bias:            number
    normalcy_bias:              number
    loss_aversion_multiplier:   number
    availability_heuristic:     number
    social_proof_sensitivity:   number
  }

  // Commitments
  commitments:              Array<{type: string, monthly_cost: number, remaining_months: number | null}>
  total_committed_monthly:  number

  // Transformations in progress
  transformations: Array<{
    type: string
    description: string
    progress: number
    completion_eta_months: number
    started_tick: number
  }>

  // Hierarchy fields
  owns_car:          boolean
  uses_robotaxi:     boolean
  status_anxiety:    number
  future_orientation: number
  entrepreneurial_drive: number
  community_ties:    number
  purpose_stability: number
  meaning_source:    string

  // Per-tick history
  history: Record<string, TickSnapshot>

  // Documentary layer
  reflections: AgentReflection[]
}

export interface Building {
  id:            string
  label:         string
  zone:          string
  tile:          [number, number]
  size:          'small' | 'medium' | 'large'
  sector:        string
  occupants:     string[]
  appears_tick:  number
}

export interface BuildingTickState {
  health:         number  // 0-100
  visual_state:   'thriving' | 'stressed' | 'declining' | 'closing' | 'closed' | 'hidden'
  visible:        boolean
  agents_present: string[]
}

export interface Transaction {
  id:             string
  tick:           number
  initiator:      string
  initiator_name: string
  target:         string
  target_name:    string
  type:           string
  category:       'formal' | 'informal' | 'institutional' | 'self'
  description:    string
  status:         string
  is_bilateral:   boolean
  amount:         number
  resource_type:  string
}

export interface Phenomenon {
  tick:         number
  type:         string
  label:        string
  description:  string
  color:        string
  marker_shape: string
  severity:     1 | 2 | 3
}

export interface TickData {
  employment_rate:    number | null
  employed_count:     number | null
  spending_index:     number | null
  car_ownership_rate: number | null
  total_cars:         number | null
  robotaxi_rate:      number | null
  gini:               number | null
  protests:           number
  retraining_enrollments: number
  mutual_aid_events:  number
  dealership_index:   number | null
  insurance_policies: number | null
  mechanic_index:     number | null
  has_data:           boolean
  interpolated:       boolean
}

export interface SocialEdge {
  source:  string
  target:  string
  trust:   number
  type:    'professional' | 'colleague' | 'neighbor'
}

// ─── Active Layers ────────────────────────────────────────────────────────────

export type LayerId =
  | 'economic_heatmap'
  | 'social_graph'
  | 'info_flow'
  | 'grief_topology'
  | 'runway_countdown'
  | 'stress_topology'
  | 'transaction_flow'

// ─── Store ────────────────────────────────────────────────────────────────────

interface SimState {
  // Playback
  currentTick:     number
  maxTick:         number
  isPlaying:       boolean
  playSpeed:       0.5 | 1 | 2 | 5 | 10
  interpolation:   number   // 0-1 between currentTick and currentTick+1

  // Selection
  selectedAgentId:  string | null
  selectedBuildingId: string | null
  selectedTxId:     string | null

  // Active overlays
  activeLayers: Set<LayerId>

  // Loaded data
  agents:       Record<string, Agent>      | null
  buildings:    Building[]                 | null
  buildingTicks: Record<string, Record<string, BuildingTickState>> | null
  transactions: Transaction[]              | null
  txByTick:     Record<string, string[]>   | null
  phenomena:    Phenomenon[]               | null
  scenarioEvents: Phenomenon[]             | null
  timeseries:   Record<string, TickData>   | null
  socialEdges:  SocialEdge[]               | null
  socialNodes:  Array<{id: string, degree: number, avg_trust: number}> | null
  worldLayout:  any                        | null
  meta:         any                        | null

  // Load state
  isLoaded:     boolean
  loadError:    string | null

  // ── Actions ──────────────────────────────────────────────────────
  setTick:          (tick: number) => void
  stepTick:         (delta: number) => void
  setPlaying:       (playing: boolean) => void
  setSpeed:         (speed: SimState['playSpeed']) => void
  setInterpolation: (t: number) => void

  selectAgent:    (id: string | null) => void
  selectBuilding: (id: string | null) => void
  selectTx:       (id: string | null) => void

  toggleLayer:    (layer: LayerId) => void

  loadData:       () => Promise<void>
}

export const useSimStore = create<SimState>((set, get) => ({
  // ── Initial state ─────────────────────────────────────────────────
  currentTick:    0,
  maxTick:        14,
  isPlaying:      false,
  playSpeed:      1,
  interpolation:  0,

  selectedAgentId:    null,
  selectedBuildingId: null,
  selectedTxId:       null,

  activeLayers: new Set(),

  agents:       null,
  buildings:    null,
  buildingTicks: null,
  transactions: null,
  txByTick:     null,
  phenomena:    null,
  scenarioEvents: null,
  timeseries:   null,
  socialEdges:  null,
  socialNodes:  null,
  worldLayout:  null,
  meta:         null,

  isLoaded:  false,
  loadError: null,

  // ── Playback actions ──────────────────────────────────────────────
  setTick: (tick) => set({ currentTick: Math.max(0, Math.min(tick, get().maxTick)), interpolation: 0 }),
  stepTick: (delta) => {
    const { currentTick, maxTick } = get()
    set({ currentTick: Math.max(0, Math.min(currentTick + delta, maxTick)), interpolation: 0 })
  },
  setPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed:   (speed)   => set({ playSpeed: speed }),
  setInterpolation: (t) => set({ interpolation: t }),

  // ── Selection actions ─────────────────────────────────────────────
  selectAgent:    (id) => set({ selectedAgentId: id, selectedBuildingId: null, selectedTxId: null }),
  selectBuilding: (id) => set({ selectedBuildingId: id, selectedAgentId: null, selectedTxId: null }),
  selectTx:       (id) => set({ selectedTxId: id }),

  // ── Layer toggle ──────────────────────────────────────────────────
  toggleLayer: (layer) => {
    const layers = new Set(get().activeLayers)
    if (layers.has(layer)) layers.delete(layer)
    else layers.add(layer)
    set({ activeLayers: layers })
  },

  // ── Data loading ──────────────────────────────────────────────────
  loadData: async () => {
    const BASE = import.meta.env.DEV ? '../viz-data' : './viz-data'
    try {
      const [meta, world, phenomena, social, agents, buildings, txns] = await Promise.all([
        fetch(`${BASE}/meta.json`).then(r => r.json()),
        fetch(`${BASE}/world.json`).then(r => r.json()),
        fetch(`${BASE}/phenomena.json`).then(r => r.json()),
        fetch(`${BASE}/social_graph.json`).then(r => r.json()),
        fetch(`${BASE}/agents.json`).then(r => r.json()),
        fetch(`${BASE}/buildings.json`).then(r => r.json()),
        fetch(`${BASE}/transactions.json`).then(r => r.json()),
      ])

      set({
        meta,
        worldLayout:   world,
        phenomena:     phenomena.phenomena,
        scenarioEvents: phenomena.scenario_events,
        timeseries:    phenomena.timeseries,
        agents,
        buildings:     buildings.buildings,
        buildingTicks: buildings.ticks,
        transactions:  txns.transactions,
        txByTick:      txns.by_tick_ids,
        socialEdges:   social.edges,
        socialNodes:   social.nodes,
        maxTick:       meta.simulation.total_ticks,
        isLoaded:      true,
        loadError:     null,
      })
    } catch (err) {
      set({ loadError: String(err), isLoaded: false })
    }
  },
}))

// ─── Derived selectors ────────────────────────────────────────────────────────

/** Get an agent's state at a specific tick. */
export function getAgentAtTick(agent: Agent, tick: number): TickSnapshot & Partial<Agent> {
  const snap = agent.history[String(tick)] ?? {}
  return {
    ...snap,
    // Current-state fields that don't change in history
    grief_stage: agent.grief_stage,
    agency:      agent.agency,
    sentiment:   agent.sentiment,
    owns_car:    agent.owns_car,
    runway_months: agent.runway_months,
    threat_level:  agent.threat_level,
  }
}

/** Get building state at a specific tick. */
export function getBuildingAtTick(
  buildingTicks: Record<string, Record<string, BuildingTickState>>,
  buildingId: string,
  tick: number
): BuildingTickState | null {
  return buildingTicks[String(tick)]?.[buildingId] ?? null
}
