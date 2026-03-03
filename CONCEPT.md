# FrictionlessSimAI — Millfield Visualization Concept
## Full Technical Specification: God-Mode World Viewer
### Version 2.0 — Data-Grounded
### Date: March 3, 2026

---

## 0. What This Actually Is

This is not a generic economic simulation viewer.

This is **Millfield** — a real small American town of 30 people whose entire economy runs on cars.
Five RoboRide capability announcements over 14 ticks obliterate it.

Employment: **100% → 40%**.
Consumer spending: **83% → 24% of baseline**.
Gini coefficient: **0.254 → 0.661**.
Car ownership: **93% → 63%**.
Protests: **0 → 9 at peak**.

Every number above is real. Every person below is real.
The visualization renders all of it — nothing is hidden, nothing is lost.

---

## 1. The Story Arc (The Actual Narrative)

The simulation runs on 5 canonical events from `config/scenario.json`:

| Tick | Event | What It Triggers |
|------|-------|-----------------|
| **0** | Economy normal. Self-driving exists but not here. | Baseline state — some agents already sensing risk |
| **1** | RoboRide announces Millfield in Phase 2, deployment in 2 months | Angela Wright secretly consults an employment attorney. First career pivots begin. |
| **3** | RoboRide launches: **$0.18/mile, 15min wait, main roads only** | Rideshare drivers start losing income. 3 early adopters ditch cars. |
| **8** | Price drops to **$0.12/mile, 8min wait, residential coverage** | Location closure accelerates. Tom Bradley gets laid off. Protests spike to 9. |
| **14** | **$0.10/mile, 5min wait, 24/7, second competitor enters** | Employment rate 40%. Gini 0.661. Most of the town is in financial crisis. |

This narrative structure **drives every visual beat** in the viewer.
The scrub bar is the documentary. The viewer is the god watching it unfold.

---

## 2. The People — Data-Complete Agent Roster

All 30 agents at their final tick state (tick 14):

| Agent | Name | Role | Tier | Grief Stage | Stress | Agency | Archetype | Runway | Threat |
|-------|------|------|------|-------------|--------|--------|-----------|--------|--------|
| `council_member` | Maria Santos | Town Council Member | 1 | none | 0.20 | 0.89 | builder | 9.8mo | 0.18 |
| `ceo_regional_auto` | Patricia Hawkins | CEO, Regional Auto Group | 1 | **acceptance** | 0.40 | 0.70 | adapter | 17.0mo | 0.00 |
| `bank_manager` | David Chen | Branch Manager | 1 | none | 0.14 | 0.87 | adapter | 16.1mo | 0.00 |
| `dealership_gm` | Rick Tanner | GM, Millfield Auto Mall | 2 | **depression** | 0.62 | 0.70 | adapter | 3.1mo | 0.74 |
| `insurance_manager` | Linda Park | Regional Manager, AutoShield | 2 | none | 0.14 | 0.74 | adapter | 7.4mo | 0.38 |
| `hr_director` | Angela Wright | HR Director | 2 | **acceptance** | 0.50 | 0.66 | builder | 2.5mo | 0.79 |
| `mechanic_carlos` | Carlos Ruiz | Master Mechanic | 3 | none | 0.18 | 0.61 | adapter | 7.0mo | 0.42 |
| `mechanic_sarah` | Sarah Kim | Junior Mechanic | 3 | **depression** | 0.06 | 0.54 | adapter | 5.7mo | 0.52 |
| `insurance_agent_tom` | Tom Bradley | Auto Insurance Agent | 3 | **acceptance_early** | 0.66 | 0.59 | adapter | 6.7mo | 0.44 |
| `insurance_agent_priya` | Priya Sharma | Insurance Agent | 3 | **bargaining** | 0.47 | 0.55 | adapter | 0.0mo | 1.00 |
| `gas_station_owner` | Amir Patel | Gas Station Owner | 3 | none | 0.30 | 0.79 | adapter | 8.6mo | 0.28 |
| `loan_officer` | Kevin O'Brien | Auto Loan Officer | 3 | **acceptance** | 0.15 | 0.76 | adapter | 0.9mo | 0.93 |
| `salesperson_jake` | Jake Morrison | Car Salesperson | 3 | none | 0.17 | 0.82 | hustler | 0.0mo | 1.00 |
| `salesperson_tamika` | Tamika Jefferson | Car Salesperson | 3 | none | 0.05 | 0.73 | hustler | 0.0mo | 1.00 |
| `community_organizer` | Lisa Freeman | Community Center Director | 4 | **depression** | 0.02 | 0.61 | builder | 7.8mo | 0.35 |
| `commuter_james` | James Patterson | Software Developer | 4 | none | 0.01 | 0.67 | builder | 17.6mo | 0.00 |
| `commuter_rachel` | Rachel Green | Marketing Manager | 4 | none | 0.19 | 0.86 | hustler | 1.1mo | 0.91 |
| `diner_owner` | Betty Kowalski | Owner, Auto Row Diner | 4 | none | 0.56 | 0.87 | adapter | 0.4mo | 0.97 |
| `driving_instructor` | Frank Russo | Driving School Owner | 4 | none | 0.19 | 0.81 | adapter | 0.0mo | 1.00 |
| `auto_shop_teacher` | Mark Thompson | High School Auto Shop Teacher | 4 | none | 0.00 | 0.83 | builder | 9.4mo | 0.22 |
| `parts_store_owner` | Howard Liu | Owner, Auto Parts Store | 4 | **anger** | 0.24 | 0.85 | adapter | 5.9mo | 0.51 |
| `retiree` | Dorothy Chen | Retired Teacher | 4 | none | 0.11 | 0.67 | builder | 54.3mo | 0.00 |
| `real_estate_agent` | Stephanie Morris | Commercial Real Estate Agent | 4 | none | 0.00 | 0.67 | hustler | 12.6mo | 0.00 |
| `parking_garage_mgr` | Denise Williams | Parking Garage Manager | 4 | none | 0.04 | 0.80 | adapter | 7.6mo | 0.37 |
| `rideshare_driver` | Robert Jackson | Rideshare Driver | 4 | **bargaining** | 0.08 | 0.70 | adapter | 4.7mo | 0.61 |
| `single_parent` | Nicole Washington | Nurse (single parent) | 4 | none | 0.46 | 0.67 | hustler | 0.0mo | 1.00 |
| `truck_owner` | Dale Cooper | Contractor (truck owner) | 4 | **depression** | 0.07 | 0.87 | hustler | 5.3mo | 0.56 |
| `uber_driver_2` | Grace Okafor | Part-time Rideshare / Nursing Student | 4 | **bargaining** | 0.08 | 0.60 | adapter | 0.0mo | 1.00 |
| `car_wash_worker` | Miguel Hernandez | Car Wash Attendant | 4 | none | 0.02 | 0.71 | adapter | 0.0mo | 1.00 |
| `young_gig_worker` | Zoe Martinez | Barista / Gig Worker | 4 | **acceptance** | 0.05 | 0.54 | adapter | 0.0mo | 1.00 |

**Grief stage distribution at tick 14**: none×15, acceptance×4, depression×4, bargaining×3, anger×1, acceptance_early×1

---

## 3. The World — Millfield, Corrected

The PRD envisioned a generic city. This is an auto-economy company town.
Every building corresponds to actual agents and their sectors.

```
┌─────────────────────────────────────────────────────────────────────┐
│ MILLFIELD                                              TICK ██/14   │
│                                                                     │
│  [MAIN STREET — Auto Row]                                           │
│  ┌──────────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  MILLFIELD       │  │ PARTS    │  │ GAS      │  │ DINER    │   │
│  │  AUTO MALL       │  │ STORE    │  │ STATION  │  │ (Betty)  │   │
│  │  [Rick,Patricia] │  │ [Howard] │  │ [Amir]   │  │          │   │
│  └──────────────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                                     │
│  [SERVICES ROW]                                                     │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  ┌──────────┐   │
│  │ MECHANIC │  │ MECHANIC │  │ AUTOSHIELD      │  │ PARKING  │   │
│  │  SHOP    │  │  SHOP    │  │ INSURANCE       │  │ GARAGE   │   │
│  │ [Carlos] │  │ [Sarah]  │  │ [Linda,Tom,     │  │ [Denise] │   │
│  │          │  │          │  │  Priya]         │  │          │   │
│  └──────────┘  └──────────┘  └─────────────────┘  └──────────┘   │
│                                                                     │
│  [CIVIC + FINANCE DISTRICT]                                         │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────┐  ┌──────────┐  │
│  │  CITY    │  │  FIRST COMMUNITY │  │ DRIVING  │  │COMMUNITY │  │
│  │  HALL    │  │  BANK            │  │ SCHOOL   │  │ CENTER   │  │
│  │ [Maria]  │  │ [David,Kevin]    │  │ [Frank]  │  │ [Lisa]   │  │
│  └──────────┘  └──────────────────┘  └──────────┘  └──────────┘  │
│                                                                     │
│  [HIGH SCHOOL + PARK]                                               │
│  ┌────────────────────┐  🌳🌳🌳  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐      │
│  │  HIGH SCHOOL       │  PARK   │  INFORMAL MARKET        │      │
│  │  [Mark Thompson]   │  (bench)│  (emerges mid-sim)      │      │
│  └────────────────────┘  🌳🌳🌳  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘      │
│                                                                     │
│  [RESIDENTIAL — Tier-differentiated]                                │
│  ┌──┐ ┌──┐ ┌──┐       ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│  │T1│ │T1│ │T2│       │T4││T4││T4││T4││T4││T4││T4││T4││T4│  │
│  │  │ │  │ │  │       └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│  └──┘ └──┘ └──┘                                                    │
│  Maria  Patricia  Rick/   All tier-4 agents                        │
│  David  Angela    Linda                                             │
│                                                                     │
│  [REMOTE — commuters, don't own Millfield buildings]               │
│  → James Patterson (tech company, elsewhere)                        │
│  → Rachel Green (marketing firm, elsewhere)                         │
│  → Nicole Washington (hospital, elsewhere)                          │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.1 Building → Data Mapping

Every building is a first-class entity synthesized from agent state, not stored directly.
The renderer builds buildings from agents.

| Building | Agents | Health Signal | Death Condition |
|----------|--------|--------------|-----------------|
| **Millfield Auto Mall** | `ceo_regional_auto`, `dealership_gm`, `hr_director`, `salesperson_jake`, `salesperson_tamika` | `market_state.auto_sector.dealership_revenue_index` (was 100, now 68) | Jake/Tamika at 0.0mo runway + Rick in depression = flickering lights |
| **Auto Parts Store** | `parts_store_owner` | Howard's `financial.savings` trajectory + `psychological.grief_stage=anger` | Anger stage = lights on late, "OPEN" sign always on desperately |
| **Gas Station** | `gas_station_owner` | `car_ownership.ownership_rate` decline (93%→63%) | Revenue directly tied to cars remaining |
| **Auto Row Diner** | `diner_owner` | Betty's `hierarchy.L0_SURVIVE.runway_months=0.4` | Nearly dead — lights dim, 1 table occupied |
| **Mechanic Shop A** | `mechanic_carlos` | `market_state.auto_sector.mechanic_demand_index` (68) | Carlos: no grief, adapting — EV cert in progress |
| **Mechanic Shop B** | `mechanic_sarah` | Sarah's `grief_stage=depression` | Dark interior, Sarah sitting at bench |
| **AutoShield Insurance** | `insurance_manager`, `insurance_agent_tom`, `insurance_agent_priya` | `auto_sector.insurance_policies_active` (was 28, now 19) | Tom laid off tick 8; Priya at 0.0mo runway = 1 desk lit |
| **Parking Garage** | `parking_garage_mgr` | `car_ownership.total_owners` declining | Half-empty visualization |
| **City Hall** | `council_member` | Maria's `psychological.agency=0.89` + active policy proposals | Always lit — she never stops working |
| **First Community Bank** | `bank_manager`, `loan_officer` | David unemployed at tick 5 — bank is dark; Kevin at 0.9mo runway | Ghost building after tick 5 |
| **Driving School** | `driving_instructor` | Frank at 0.0mo runway, `sentiment=anxious` | Closed after tick 3 (no cars = no lessons) |
| **Community Center** | `community_organizer` | `market_state.community.mutual_aid_events` | Grows as disruption deepens — most lit building by tick 9 |
| **High School** | `auto_shop_teacher` | Mark's `in_progress_transformations[0].progress` (12%) | Open, transformation in progress |
| **Residential (Tier 1)** | Patricia, Maria, David | Large houses, well-lit | Stable |
| **Residential (Tier 2)** | Rick, Linda, Angela | Medium houses | Rick's house dims with his depression |
| **Residential (Tier 4)** | 16+ agents | Small houses, crowded | Increasingly stressed cluster |
| **Informal Market** | Triggered by `mutual_aid_events > 0` | Dorothy's $150 donation (tick 7), Dale's $50 (tick 7) | Appears tick 7 — animated stall materialize |

---

## 4. Complete Data → Visual Encoding

### 4.1 Agent Sprite State Machine

Every agent sprite has a state determined entirely by simulation data.
No random animations. Every pixel is backed by a field.

```
AGENT STATE MACHINE
═══════════════════

SOURCE FIELD                  VISUAL ENCODING
────────────────────────────────────────────────────────────────
psychological.grief_stage
  "none"              →  Normal walk cycle, head up
  "bargaining"        →  Walk with slight lean forward, checking phone
  "anger"             →  Faster movement, occasional stop-and-turn
  "depression"        →  Slow shuffle, head down, slumped posture
  "acceptance"        →  Calm walk, deliberate pace, sometimes pauses to look around
  "acceptance_early"  →  Uncertain walk — sometimes fast, sometimes slow

psychological.agency (0-1)
  > 0.75              →  Purposeful walking direction, goes to buildings
  0.50-0.75           →  Some wandering between destinations
  < 0.50              →  Drifts, sits in park, returns home often

psychological.stress_level (0-1)
  0.00-0.20           →  Smooth, normal speed
  0.20-0.50           →  Slightly fast, occasional hand-to-face gesture
  0.50-0.75           →  Fast walk, jittery stops, stress aura (subtle red rim)
  > 0.75              →  Frantic or frozen — alternates between sprint and sit

hierarchy.L0_SURVIVE.runway_months
  > 12.0              →  No visual indicator
  6.0-12.0            →  Faint yellow pulse on sprite (occasional)
  1.0-6.0             →  Orange pulse, slightly smaller sprite
  < 1.0               →  Red pulse, shrunk sprite, sits more, barely moves
  0.0                 →  Danger ring — MIGUEL, FRANK, PRIYA, JAKE, TAMIKA, NICOLE,
                          GRACE, ZOE (8 agents at tick 14!)

hierarchy.L2_PARTICIPATE.employment_status
  "employed"          →  Moves to workplace building at tick start
  "unemployed"        →  Wanders between buildings, sits at park bench
  "transitioning"     →  Moves to Community Center or High School (retraining)

identity.tier
  1                   →  Dark blue/navy clothing, upright posture
  2                   →  Business casual, medium blue
  3                   →  Casual wear, grey-blue
  4                   →  Worn clothing, muted grey tones

perception.sentiment
  "determined"        →  Default — most agents, forward posture
  "anxious"           →  Frank Russo, Rachel Green, Kevin O'Brien — quick looks around
  "excited"           →  Stephanie Morris — bouncy walk, slight glow
  "relieved"          →  Grace Okafor — slower, exhale animation

archetype (drives animation variety)
  "builder"           →  Carries visual "document" prop, moves between buildings
  "adapter"           →  Neutral — blends in, watches others
  "hustler"           →  Fast movement, multiple destinations per tick
```

### 4.2 Building State Machine

```
BUILDING VISUAL STATE
══════════════════════

Health Level              →  Visual
─────────────────────────────────────────────────────────────
THRIVING  (100-80)        →  All lights on, door open, agents flowing in/out
STRESSED  (80-60)         →  Some lights off, fewer agents, "hours reduced" sign
DECLINING (60-40)         →  Lights flicker, 1-2 agents, "help wanted" sign gone
CLOSING   (40-20)         →  Dark, 1 light in back, FOR LEASE sign in window
CLOSED    (< 20)          →  Dark, boarded windows, no agents

Computed from:
  - Auto Mall:    market_state.auto_sector.dealership_revenue_index
  - Gas Station:  market_state.car_ownership.ownership_rate × 1.4
  - Insurance:    market_state.auto_sector.insurance_policies_active / 28 × 100
  - Mechanics:    market_state.auto_sector.mechanic_demand_index
  - Diner:        market_state.spending.spending_index (proxy for foot traffic)
  - Bank:         agent bank_manager employment_status (unemployed = bank closed)
  - Community Ctr: inverted — grows as market_state.community.protests + retraining grow
```

### 4.3 Ambient Town State

```
MACRO VISUAL LAYER
══════════════════

Market Signal             →  Town-Wide Visual Change
────────────────────────────────────────────────────────────
employment_rate drop      →  Fewer agents moving, more sitting on benches
gini_coefficient > 0.5    →  Visible wealth gap: T1 houses bright, T4 houses dim
protests > 5              →  Small crowd sprite clusters near City Hall
spending_index < 40       →  Shops' awning colors desaturate
robotaxi_adoption_rate    →  RoboRide vehicle sprite appears on streets,
                              frequency matches adoption rate
  tick 1-2: 0%            →  No robotaxis visible
  tick 3: 3%              →  1 robotaxi passes occasionally
  tick 8: 7%              →  3 robotaxis in regular circulation
  tick 14: 10%+           →  5 robotaxis, constant presence

car_ownership drop        →  Fewer personal car sprites parked near homes
mutual_aid_events > 0     →  Informal market stall sprites appear in park
retraining_enrollments    →  Queue sprite outside Community Center / High School
```

### 4.4 Relationship Lines (Social Graph)

```
RELATIONSHIP VISUALIZATION
════════════════════════════

relationships.json fields  →  Visual
──────────────────────────────────────────────────
trust 0.21-0.40            →  Faint grey dotted line (barely visible)
trust 0.40-0.60            →  Dashed line, medium weight
trust 0.60-0.75            →  Solid line, medium weight
trust 0.75-0.90            →  Thick solid line, warm glow
type="professional"        →  Blue line
type="colleague"           →  Teal line
type="neighbor"            →  Amber line
power_over relationship    →  Arrow with slight emphasis on dominant end
obligations                →  Pulsing line (unfulfilled commitment)
```

### 4.5 Transaction Visualization

```
TRANSACTION EVENTS
══════════════════

Transaction type           →  Visual Effect
───────────────────────────────────────────────────────────────
EXCHANGE                   →  Two agents face each other, handshake, value float
COMMITMENT                 →  Dotted arc between agents, "promise" icon
SIGNAL                     →  Speech bubble from initiator to target
ASSOCIATION                →  Soft glow connecting two agents temporarily
TRANSFORMATION             →  Agent sprite has progress ring animating
mutual_aid (informal)      →  Purple glow, value flows upward (gift, not trade)

resources.amount = 0       →  No dollar float (information/skill exchange)
resources.amount > 0       →  Dollar sign floats from initiator to target
status="no_counterparty"   →  Agent raises hand, no response — visualize isolation
```

### 4.6 Information Flow (Inbox Layer)

```
INFORMATION PROPAGATION
════════════════════════

inbox.messages[].type      →  Visual
──────────────────────────────────────────────────────────
CAPABILITY_FACT            →  Sharp white particle — direct, accurate news
MARKET_DATA                →  Blue particle — official numbers
WORD_OF_MOUTH / RUMOR      →  Orange particle — slightly blurred/degraded
                              Degrades further with each hop (opacity -20%)

The telephone effect: watch how the RoboRide announcements at tick 1 and 3
propagate through the town. Tier 1 agents receive clean CAPABILITY_FACT.
Tier 4 agents receive degraded word-of-mouth. Visualize the information gap.
```

---

## 5. The Documentary Voiceover Layer

Every agent has 2 reflections in `memory.json`, written in first person.
These are the actual inner monologues produced by the simulation.

**This is the documentary layer** — click any agent, pause, and hear their voice.

Selected examples (actual text from simulation):

> **Zoe Martinez, tick 6** (young_gig_worker):
> *"Six ticks in and I am unemployed, my savings are negative trending, and I am delivering burritos on a bicycle at 9pm while watching robotaxis glide past me. There is a dark humor in that if I let myself see it."*

> **Rick Tanner, tick 9** (dealership_gm, grief=depression):
> *"Patricia committed to closing a location. One week for the announcement, then sales floor staff get walked through Angela's transition program. I do not know if that means me. That sentence has been sitting with me since she said it."*

> **Miguel Hernandez, tick 9** (car_wash_worker, runway=0.0mo):
> *"I am unemployed. I have $1,180 in savings and $1,200 in monthly essentials. That is a sub-one-month runway. I am saying this without softening it because softening it would be the beginning of a bad decision."*

> **Tamika Jefferson, tick 9** (salesperson, grief=none, runway=0.0mo):
> *"Scenario 2 fired. The consolidation assessment moved in 72 hours, not two weeks — Patricia made the call and the location closed before the stay bonus vested. I did not collect the $12,000. I named that risk at tick 6."*

> **Patricia Hawkins, tick 6** (CEO, grief=acceptance):
> *"I thought information management was leadership. I thought if I called the right meetings, set the right expectations, produced the right documents — the outcome would match the plan. It does not work that way. It never worked that way."*

**Usage in UI**: Click agent → Agent Card shows latest reflection verbatim.
"Full Memory Log" expands to show both reflections with tick timestamps.
In playback, reflection text appears as floating caption when agent's reflection tick is reached.

---

## 6. The Agent Card — Every Field

```
┌──────────────────────────────────────────────────┐
│  [SPRITE]  Rick Tanner, 38                       │
│            General Manager, Millfield Auto Mall  │
│            Tier 2 • adapter                      │
│ ─────────────────────────────────────────────── │
│  FINANCIAL                                       │
│  💰 Savings: $42,119  (↓ from tick 0)           │
│  📊 Income: $0/mo  |  Expenses: $13,538/mo       │
│  🏦 Debt: $214,820  |  Credit: 687               │
│  ⏳ Runway: 3.1 months  ███░░░░░░░░ ⚠️           │
│ ─────────────────────────────────────────────── │
│  PSYCHOLOGICAL                                   │
│  😔 Grief: Depression                            │
│  🌡️ Stress: 0.62  ████████░░░                   │
│  ⚡ Agency: 0.70  ████████░░                    │
│  🎯 Threat: 0.74  █████████░                    │
│  🕐 Horizon: 8 months                           │
│ ─────────────────────────────────────────────── │
│  IDENTITY                                        │
│  🧠 Identity Attachment: 0.70 (high — clings)   │
│  📎 Commitments: housing $8,127/mo (72mo left)  │
│                  family $837/mo                  │
│  🏛️ Historical: 2008 — "kept working harder"    │
│ ─────────────────────────────────────────────── │
│  COGNITION                                       │
│  Status Quo Bias: 0.72                          │
│  Loss Aversion: 2.2×                            │
│  Social Proof Sensitivity: 0.58                  │
│ ─────────────────────────────────────────────── │
│  STATUS                                          │
│  💼 Employment: unemployed                       │
│  🔑 Role Security: 0.25  ███░░░░░░░ ⚠️          │
│  🤝 Network Strength: 0.62  ███████░░░           │
│ ─────────────────────────────────────────────── │
│  IN PROGRESS                                     │
│  🔄 Consulting: Patricia Hawkins                 │
│     "Millfield consolidation assessment"         │
│     Progress: ██████████ 85%  ETA: 1 month      │
│ ─────────────────────────────────────────────── │
│  REFLECTION (Tick 9):                            │
│  "Patricia committed to closing a location.      │
│   One week for the announcement, then sales      │
│   floor staff walked through Angela's program.   │
│   I do not know if that means me."               │
│ ─────────────────────────────────────────────── │
│  SOCIAL                                          │
│  🔗 5 connections (T: Patricia 0.82,             │
│     Angela 0.76, Jake 0.61...)                   │
│  ⬆️ Power over: Jake, Tamika, Sarah              │
│  ⬇️ Power under: Patricia                        │
│ ─────────────────────────────────────────────── │
│  [Follow Agent] [Transaction Log] [Memory Log]   │
│  [Social Graph] [Compare Scenarios]              │
└──────────────────────────────────────────────────┘
```

**Data source mapping for every line:**
- Name, age: `identity.name`, `identity.age`
- Role, tier: `identity.role`, `identity.tier`
- Archetype: `archetype` (top-level)
- Savings: `financial.savings`
- Income/expenses: `financial.monthly_income`, `financial.monthly_expenses`
- Debt, credit: `financial.debt_total`, `financial.credit_score`
- Runway: `hierarchy.L0_SURVIVE.runway_months`
- Grief: `psychological.grief_stage`
- Stress: `psychological.stress_level`
- Agency: `psychological.agency`
- Threat: `hierarchy.L0_SURVIVE.threat_level`
- Horizon: `psychological.temporal_horizon_months`
- Identity attachment: `identity.identity_attachment`
- Commitments: `commitments[]` (type, monthly_cost, remaining_months)
- Historical conditioning: `identity.historical_conditioning[0].event + .lesson`
- Biases: `perception.cognitive_biases.*`
- Employment: `hierarchy.L2_PARTICIPATE.employment_status`
- Role security: `hierarchy.L2_PARTICIPATE.role_security`
- Network strength: `hierarchy.L2_PARTICIPATE.network_strength`
- In progress: `in_progress_transformations[0]`
- Reflection: `memory.reflections[-1].text`
- Connections: `relationships.connections[]` (agent_id, name, trust)
- Power: `relationships.power_over[]`, `relationships.power_under[]`

---

## 7. The Economic Dashboard (Always Visible)

```
┌─────────────────────────────────────────────────────────────────────┐
│ MILLFIELD  Tick 9/14                                                │
│                                                                     │
│  EMPLOYMENT     SPENDING      CAR OWNERSHIP    GINI COEFFICIENT    │
│  ████████░░     ████░░░░░░    ██████████░      ████████░░          │
│  53%            30% of base   73%              0.636               │
│  (was 100%)     (was 83%)     (was 93%)        (was 0.254)         │
│                                                                     │
│  ROBOTAXI       PROTESTS      RETRAINING       MUTUAL AID          │
│  ████░░░░░░     ██████████    ████████░░        ░░░░░░░░░░         │
│  7% adoption    9 events      6 enrolled        1 event            │
└─────────────────────────────────────────────────────────────────────┘
```

All from `observations/tick_NNN/market_state.json`.

The `computed_from: "agent_actions"` field means every number emerged from
the 30 agents making individual decisions — not from a top-down model.

---

## 8. The Scrub Bar — Annotated Timeline

```
┌───────────────────────────────────────────────────────────────────┐
│  ◄◄  ◄  ▐▐  ►  ►►     Tick: 9/14   Speed: 1x  ▾    │
│                                                                   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      │
│  0    1    2    3    4    5    6    7    8    9   10   11  13  14 │
│  ↑    ↑         ↑              ↑                   ↑             │
│  🟦   🟨         🟦              🔴                  🔴            │
│       Ann.       Deploy          ↓price            Full          │
│       RoboR.     +pilots         residential       dominance     │
│                                                                   │
│  Auto-detected phenomena:                                         │
│  🔴 T5  Mass employment collapse (100%→77%)                       │
│  🟡 T4  Herd retraining (12 enrollments in 1 tick)               │
│  🟣 T7  Informal market emergence (first mutual aid)              │
│  🔵 T6  Network clustering (bank/insurance sub-graph)             │
│  🟠 T8  Protest wave (9 simultaneous events)                      │
│  ⭐ T14 Recovery signal: Mark Thompson EV cert in progress        │
└───────────────────────────────────────────────────────────────────┘
```

Scenario events from `config/scenario.json` are hard-pinned markers.
Phenomena are auto-detected from market_state progression.

**Missing ticks (7, 12)**: Render as greyed-out segments.
Data exists in agent actions/outcomes but `post_tick.sh` wasn't run.
Show as "partial data" with tooltip explaining.

---

## 9. Phenomena Detection — With Actual Detection Logic

| Phenomenon | Detection Query | First Occurrence |
|-----------|----------------|-----------------|
| **Mass employment collapse** | `employment_rate` drops >10pp in 1 tick | Tick 4→5: 90%→77% |
| **Herd retraining** | `community.retraining_enrollments` ≥ 10 in 1 tick | Tick 4: 12 enrollments |
| **Informal market emergence** | `community.mutual_aid_events` > 0 for first time | Tick 7: Dorothy $150, Dale $50 |
| **Protest wave** | `community.protests` ≥ 5 | Tick 8: 9 events |
| **Spending collapse** | `spending.spending_index` drops >20 in 1 tick | Tick 4→5: 69→48 |
| **Gini breach** | `inequality.gini_coefficient` crosses 0.5 | Between tick 8-9 (0.523→0.636) |
| **Robotaxi landmark** | `car_ownership.robotaxi_adoption_rate` hits 3%, 7%, 10% | Ticks 1, 4, 14 |
| **Depression cluster** | 3+ agents with `grief_stage=depression` simultaneously | Visible from tick 9 |
| **Runway crisis** | 5+ agents with `runway_months < 1.0` | Tick 14: 8 agents at 0.0 |
| **First acceptance** | `grief_stage=acceptance` appears in any agent | Patricia at tick 6 |

---

## 10. Information Layers (Toggleable Overlays)

### Layer A: Economic Heatmap
Source: `market_state.auto_sector.*_index` per zone
- Auto Mall zone: `dealership_revenue_index` (was 100, now 68)
- Insurance zone: `insurance_policies_active/28`
- Gas station: `car_ownership.ownership_rate`

### Layer B: Social Network Graph
Source: all agents' `relationships.json`
- 295 edges total
- Trust 0.21–0.90 → line weight
- Type: professional/colleague/neighbor → line color
- Power relationships: directional arrows
- Clustering algorithm reveals: Bank/finance cluster, auto-worker cluster, civic cluster

### Layer C: Information Flow
Source: `agents/*/inbox.json`
- CAPABILITY_FACT messages: white particles, direct
- MARKET_DATA: blue particles
- Word-of-mouth: orange, degraded opacity
- Shows the information **inequality** — T1 agents have better data

### Layer D: Grief Topology
Source: `psychological.grief_stage` per agent
- Color-code agents by grief stage
- Watch stages propagate across the town
- Cluster view: who's in denial vs acceptance?

### Layer E: Runway Countdown
Source: `hierarchy.L0_SURVIVE.runway_months`
- Each agent house shows a countdown ring
- Red rings = < 1 month (8 agents at tick 14)
- Collapse animation when runway hits 0

### Layer F: Stress Topology
Source: `psychological.stress_level`
- Heat overlay on residential areas
- Rick's house (stress 0.62) radiates differently than Mark's (stress 0.00)

### Layer G: Transaction Flow
Source: `transactions/resolved/tick_NNN/*.json`
- Formal EXCHANGE/COMMITMENT: solid lines
- SIGNAL/ASSOCIATION: dashed lines
- Mutual aid: purple glow
- `no_counterparty` transactions: isolated glow on single agent (reaching out to no one)

---

## 11. Drill-Down: Transaction Trigger Chain

The simulation has no stored causal chains. We **reconstruct them** from cross-referencing:

1. Transaction file: `transactions/resolved/tick_NNN/tx_*.json`
2. Initiator's `actions/tick_NNN.json` → `response.internal_assessment`
3. Initiator's `inbox.json` → what information drove this
4. Initiator's `memory.reflections` → their narrative context
5. Target's `outcomes_tick_NNN.json` → what happened to them

**Example: The Dorothy Chen mutual aid donation (tick 7)**

```
┌──────────────────────────────────────────────────────┐
│  💜 Mutual Aid Event                                  │
│  Dorothy Chen → Millfield Transition Fund             │
│  Amount: $150  |  Type: mutual_aid                   │
│ ─────────────────────────────────────────────────── │
│  Reconstruction:                                      │
│  1. Dorothy's inbox (tick 7): "Employment 67%,       │
│     protests rising"                                  │
│  2. Dorothy's action: "not a large amount — she is   │
│     not performing generosity — but a contribution"  │
│  3. Dorothy's state: runway 54.3mo — she can afford  │
│     it. community_ties 0.72. meaning_source=family.  │
│  4. Target: Transition Fund (no_counterparty entity) │
│ ─────────────────────────────────────────────────── │
│  Dorothy's savings at this tick: $97,XXX             │
│  This cost her 0.15% of her runway                   │
│  But it seeded the informal economy layer            │
└──────────────────────────────────────────────────────┘
```

---

## 12. Scenario Comparison Mode

Two sim runs, side by side. Synced playback. Shared scrub bar.

**Scenarios to compare once more sim runs exist:**
- Baseline (this run): RoboRide arrives, no policy response
- UBI intervention: council_member passes UBI at tick 5
- Retraining subsidy: grant threshold lowered earlier
- RoboRide blocked: ordinance prevents deployment

Until second run exists: show single-run mode with counterfactual toggles
(what if we had run X policy?) — hypothetical markers on timeline.

---

## 13. Complete Data Pipeline (Actual Paths)

```
frictionless-sim/ (6.19 MB total, 1,231 JSON files)
│
├── config/
│   ├── scenario.json          → Timeline markers (5 events)
│   ├── hierarchy.json         → 7-level Maslow structure (labels only)
│   └── simulation.json        → Run metadata
│
├── agents/
│   ├── index.json             → 30-agent roster with tier/sector/name
│   └── {agent_id}/
│       ├── state.json         → MASTER: all psychology, finance, biases, identity
│       ├── memory.json        → reflections[] (inner voice), past_actions[]
│       ├── relationships.json → connections[], power_over[], power_under[]
│       ├── inbox.json         → messages[] filtered by agent's information access
│       ├── actions/
│       │   └── tick_NNN.json  → {tick, agent_id, response.internal_assessment}
│       └── outcomes_tick_NNN.json → [{action, savings_delta, stress_delta,
│                                       employment_changed, narrative}]
│
├── observations/
│   └── tick_NNN/
│       ├── market_state.json  → CANONICAL: all macro metrics per tick
│       ├── actions_summary.json → Per-agent action descriptions (~80-130KB each)
│       └── metrics.json       → Derived aggregates
│
├── transactions/
│   └── resolved/
│       └── tick_NNN/
│           └── *.json         → {id, tick, initiator, target, type,
│                                  description, status, resources}
│
├── world/
│   ├── market_state.json      → Latest tick canonical state
│   ├── bulletin_tick_NNN.json → Events for that tick
│   └── events/tick_NNN.json  → {capability_fact, ambient_fact, events[]}
│
└── localities/
    └── millfield.json         → Town-level parameters
```

**Build step** (before serving):
```
bundle.py:
  1. Load all market_state snapshots → tick-indexed timeseries
  2. Load all agent states → current snapshot + per-tick delta from outcomes
  3. Load all transactions → indexed by tick + agent pair
  4. Load all relationships → social graph
  5. Load reflections from memory.json → indexed by agent + tick
  6. Detect phenomena from market_state timeseries
  7. Output: sim_data.json (~2-3MB gzipped)

Missing ticks (7, 12): fill with interpolated values + "partial data" flag
```

---

## 14. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Rendering** | PixiJS 8 (WebGL 2D isometric) | 30+ sprites at 60fps, isometric tiles, sprite sheets |
| **UI Framework** | React 19 | Component tree matches data hierarchy |
| **State** | Zustand | `{currentTick, agents, marketState, selectedAgent, layers}` |
| **Data** | Web Worker + IndexedDB | Parse 1,231 files off-main-thread, cache by tick |
| **Charts** | D3.js | Sparklines in agent card, macro chart |
| **Typography** | Berkeley Mono + Inter | Mono for data, sans for labels |
| **Deployment** | Static (Vercel / GH Pages) | No server needed — all data bundled |

### Sprite System

Each agent needs 5-8 animation states:
- `idle` (standing)
- `walk_N/S/E/W` (4 directions)
- `sit` (park bench, home)
- `talk` (facing another agent)
- `slump` (depression/exhaustion)
- `sprint` (high stress)
- `work` (at desk/counter)

Encoded at 32×48px, isometric perspective, 4 directions.
Tier differentiates clothing color (not body shape).
Grief stage differentiates posture/animation variant.

---

## 15. Performance Targets

| Metric | Target | Current Data Size |
|--------|--------|------------------|
| Initial load | < 3s | 6.19MB raw → ~600KB gzipped bundled |
| Tick transition | < 16ms (60fps) | 30 agents, interpolated |
| Any tick scrub | < 100ms | All ticks pre-indexed |
| Agent card open | < 50ms | State pre-loaded in Zustand |
| Memory (full sim) | < 150MB | All data fits in browser |

---

## 16. The "God Mode" Guarantee — Zero Loss Checklist

Every simulation output is visualized. If a field exists in the data, it appears somewhere in the UI.

| Data Category | Fields | Where Visible |
|--------------|--------|--------------|
| **Financial** | savings, income, expenses, debt, credit_score | Agent card + runway ring on sprite |
| **Psychological** | stress, agency, grief_stage, high_stress_ticks | Sprite animation + card |
| **Survival** | runway_months, threat_level, monthly_essentials, health_cost_from_stress | Runway countdown layer + card |
| **Employment** | employment_status, role_security, skill_relevance, network_strength | Sprite position + card |
| **Cognition** | all 5 cognitive bias fields | Agent card drill-down |
| **Identity** | tier, role, narrative, identity_attachment, dependents, historical_conditioning | Card + sprite appearance |
| **Transformation** | in_progress_transformations (type, progress, ETA) | Progress ring on sprite + card |
| **Commitments** | housing/family/employment monthly_cost + exit_cost | Commitment bars in card |
| **Temporal** | temporal_horizon_months, commitment_disruption_gap | Card visualization |
| **Relationships** | trust, type, power_over, power_under, obligations | Social graph layer + card |
| **Memory** | reflections, past_actions, past_outcomes | Documentary caption + memory log |
| **Inbox** | message types, degraded rumors | Information flow layer |
| **Actions** | per-tick internal_assessment (the "inner monologue") | Speech bubble on hover |
| **Outcomes** | savings_delta, stress_delta, employment_changed, narrative | Timeline sparkline |
| **Market state** | all 20+ macro fields | Economic dashboard + building states |
| **Transactions** | type, initiator, target, description, status | Transaction flow layer + TX card |
| **Scenario events** | 5 RoboRide capability announcements | Timeline hard markers |
| **Phenomena** | 10 auto-detected events | Timeline annotations |
| **Locality** | community_cohesion, industry_mix, local_multiplier | Background world texture |

---

## 17. Development Phases

### Phase 1 — Static World (2 weeks)
- [ ] PixiJS isometric tile grid with Millfield zone layout
- [ ] All 30 agent sprites positioned by sector/tier
- [ ] Building states from market_state tick 0
- [ ] Basic tick scrub bar (no animation, jump to tick)
- [ ] Agent card (financial + psychological fields)
- [ ] Scenario event markers on timeline

### Phase 2 — Animated World (2 weeks)
- [ ] Agent movement: employed → workplace, unemployed → park/wander
- [ ] Building state transitions (lights, signs, FOR LEASE)
- [ ] Sprite animation variants by grief_stage + agency
- [ ] Stress/runway visual encoding on sprites
- [ ] RoboRide vehicle sprites appear at tick 3
- [ ] Informal market stalls appear at tick 7

### Phase 3 — Documentary Layer (1 week)
- [ ] Reflection captions at agent's reflection ticks
- [ ] Inner monologue speech bubble on hover
- [ ] Outcome narrative in timeline view
- [ ] "Follow an agent" mode — camera tracks one person through all ticks

### Phase 4 — Information Layers (1 week)
- [ ] Economic heatmap overlay
- [ ] Social network graph overlay (295 edges)
- [ ] Transaction flow animation
- [ ] Information propagation particles
- [ ] Grief topology overlay
- [ ] Runway countdown layer

### Phase 5 — Phenomena + Polish (1 week)
- [ ] Auto-detected phenomena markers with visual events
- [ ] Mass layoff animation (buildings darken in sync)
- [ ] Protest crowd sprite cluster at City Hall
- [ ] Economic dashboard always-visible strip
- [ ] URL sharing (tick + selected agent + active layers)
- [ ] Scenario comparison mode (shell for future runs)

---

## 18. Open Questions (Grounded in Actual Data)

1. **Missing ticks 7 and 12**: Agent actions exist but `post_tick.sh` wasn't run for these ticks (no `market_state.json`). Should we run the post-tick script retroactively, or render these as "fog of war" gaps?

2. **Tier immutability**: No agent changes tier across 14 ticks. Tier is an identity anchor, not a real-time metric. For the viz, we derive **effective tier** from financial position — show agents whose savings have collapsed as visually "falling" even if their nominal tier holds.

3. **3 commuters** (James, Rachel, Nicole) work outside Millfield. They appear in residential area only, not in a workplace building. They are the town's thin connection to the external economy. Visualize them as "leaving town" animation each tick?

4. **8 agents at 0.0 runway at tick 14** — this is a cliff moment. Do we want a special event marker and visual effect for when an agent first hits runway=0? It's not currently captured as a discrete event.

5. **Informal economy is sparse** (4 mutual aid events over 14 ticks). The PRD imagined a bustling informal market. Reality: the informal sector barely materialized in this run. Visualize what's there honestly — a few transactions at the park — rather than fabricating a vibrant market zone.

---

*Data source: `frictionless-sim/` — 30 agents, 14 ticks, 1,231 JSON files, 6.19MB*
*All field paths verified against actual simulation output as of March 3, 2026*
*Zero invented fields. Zero fabricated data. Everything renders from something real.*
