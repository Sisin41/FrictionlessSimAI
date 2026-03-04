# Sprint Plan — Frictionless Sim AI Visualization

> 8 sprints, 63 atomic tasks. Each task is a single focused change.
> Estimated scope: ~1-2 hours per sprint at current codebase scale.

---

## Sprint 1: Critical Data Integrity
> **Goal**: Fix all cases where the app shows wrong data to the user.
> **Files**: `simStore.ts`, `ScreenshotButton.tsx`, `WorldRenderer.ts`, `buildingSprite.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 1.1 | P0-1 | `simStore.ts:329-341` | Rewrite `getAgentAtTick()` to read `grief_stage`, `agency`, `runway_months`, `threat_level`, `sentiment`, `owns_car` from `agent.history[tick]` instead of root-level fields. | AgentCard shows different grief_stage at tick 3 vs tick 14. |
| 1.2 | P0-3 | `ScreenshotButton.tsx:53` | Remove `* 100` — display `spending_index` directly. | Screenshot shows "Spend: 83" not "Spend: 8300". |
| 1.3 | P1-13 | `LayerRenderer.ts:495` | Read `stress` from `getAgentAtTick(agent, tick).stress` instead of `agent.stress`. | Stress topology layer shows non-zero values. |
| 1.4 | P1-10 | `WorldRenderer.ts:896-917` | Pass per-tick `grief_stage`, `agency`, `runway_months` to `getAgentLocation()` from tick snapshot instead of root agent. | Agents at tick 3 position based on tick-3 psychology. |
| 1.5 | P3-44 | `WorldRenderer.ts:892`, `WorldCanvas.tsx:68,104` | Replace hardcoded `14` with `maxTick` passed from store. | App works with any tick count. |
| 1.6 | P3-55 | `useUrlState.ts:28` | Replace `t <= 14` with `maxTick` from store. | URL `#t=20` accepted if maxTick >= 20. |

---

## Sprint 2: Critical Render Fixes
> **Goal**: Fix all P0 rendering bugs — broken tile colors, broken animations, broken geometry.
> **Files**: `WorldRenderer.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 2.1 | P0-4 | `WorldRenderer.ts:411` | Clamp `brightness` to `[0.0, 1.0]` range before passing to `blendColor`, or clamp blend factor `t` to `[0, 1]`. | No tiles show corrupted/flickering colors. |
| 2.2 | P0-7 | `WorldRenderer.ts:645-650` | Fix mortar line endpoints to interpolate between left wall's two vertical edges: top-left `(x, y - wallH)` to bottom-left `(x - floorHalfW, y + floorHalfH - wallH)`. | Mortar lines run parallel to wall edges, not from screen origin. |
| 2.3 | P0-5 | `WorldRenderer.ts:821-833, 1537` | Store the FOR LEASE `Text` reference at creation and update the _same_ text object in `tickAnimations`. Either (a) don't recreate Text each frame for FOR LEASE buildings, or (b) update `forLeaseAnimations` map with the new Text ref each frame. | FOR LEASE signs animate (slide/pulse) visibly. |
| 2.4 | P0-6 | `WorldRenderer.ts` | Add `clearOverlayAnimations()` method that removes protest, market stall, and pulse ring containers from `overlayContainer`. Call it from `onTickAdvance` when `toTick < fromTick`, and clear relevant containers. | Scrubbing from tick 10 to tick 3 removes protests, stalls, and pulse rings. |
| 2.5 | P0-2 | `WorldRenderer.ts:1276` | Replace `isoToScreen(19, 15)` with `isoToScreen(...BUILDING_TILE_OVERRIDES.informal_market)` (import the override). | Market stalls render at the same tile as the informal_market building. |

---

## Sprint 3: Container Architecture
> **Goal**: Fix the container hierarchy so decorations, overlays, and particles respect camera panning and depth sorting.
> **Files**: `WorldRenderer.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 3.1 | P1-8 | `WorldRenderer.ts:206-208` | Move decorations into `worldContainer` as depth-sorted renderables instead of a separate top-level container. Add each decoration with a `tileDepth()` value. | Trees behind buildings render behind them; trees in front render in front. |
| 3.2 | P1-9 | `WorldRenderer.ts:1332, 1395, 1429` | Move protest, market stall, and pulse ring containers from `overlayContainer` to `worldContainer` (or a camera-following container). | Protests/stalls/pulses move correctly during follow-agent camera pan. |
| 3.3 | P2-26 | `WorldRenderer.ts:1230, 1578` | Fix celebration burst position: either compute in screen-space directly or remove the double-offset compensation. | Celebration particles appear at center of viewport in all camera modes. |
| 3.4 | P3-58 | `SpeechBubble.tsx:31` | Update speech bubble position each animation frame (use a `requestAnimationFrame` loop or sync from PixiJS ticker callback). | Bubble tracks agent position during camera pan. |

---

## Sprint 4: Building Visuals
> **Goal**: Fix building appearance — walls, windows, doors, tints, outlines.
> **Files**: `WorldRenderer.ts`, `buildingSprite.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 4.1 | P1-22 | `WorldRenderer.ts:664-706` | Add window drawing for left wall, using isometric-projected window positions that match the left wall's perspective. | Both walls show windows. |
| 4.2 | P1-11 | `buildingSprite.ts:94-103` | Change Community Center `lightAlpha` to `Math.min(1.0, 1 - (health / 100))` so it brightens as town health drops. | Community Center glows brighter at low town health. |
| 4.3 | P2-29 | `buildingSprite.ts` | Change thriving tint from `0xffd700` (garish gold) to a subtler warm tone like `0xc8e6c9` (light green) or `0xe8d5b7` (warm beige). | Thriving buildings look healthy without visual domination. |
| 4.4 | P2-30 | `buildingSprite.ts` | Change closed building tint from `0x444444` to something visible like `0x666666` or add a subtle red-tinted outline. | Closed buildings are distinguishable from the background. |
| 4.5 | P3-48 | `WorldRenderer.ts:709` | Remove the `building.size !== 'large'` condition so large buildings also get a door (possibly wider). | Large buildings have visible entrances. |
| 4.6 | P3-49 | `WorldRenderer.ts:612-618` | Scale shadow offset proportional to building size: small +2, medium +4, large +6. | Shadow size matches building size. |
| 4.7 | P3-51 | `WorldRenderer.ts:784-791` | Extend outline polygon to trace the roof top face (the isometric diamond). | Zone accent stroke wraps the full building silhouette. |
| 4.8 | P3-52 | `WorldRenderer.ts:575` | Add a fade-in (alpha 0→1 over 0.5s) for buildings with `appears_tick > 0`. | Informal market fades in instead of popping. |
| 4.9 | P2-28 | `WorldRenderer.ts:553` | Trigger transitions when ANY visual property changes (compare full visual objects), not just when tint changes. | `boardedUp`, `lightAlpha` changes animate smoothly. |

---

## Sprint 5: Agent Rendering & Animation
> **Goal**: Fix agent sprites, positioning, and animations.
> **Files**: `WorldRenderer.ts`, `pixelSprites.ts`, `iso.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 5.1 | P2-24 | `pixelSprites.ts:173-181` | Remove 3 empty bottom rows from AGENT_SIT sprite (make it 12x13) or fill them with ground contact pixels. | Sitting agents touch the ground. |
| 5.2 | P2-25 | `pixelSprites.ts:185-202` | Shift AGENT_SLUMP sprite 1 column left to align head with standing sprites at column 4. | Slumping agent centered on shadow. |
| 5.3 | P1-18 | `WorldRenderer.ts:964-966` | Set `container.pivot` to the agent's position within the container before scaling, so scale centers on the agent. | Followed agent doesn't jump when scale is applied. |
| 5.4 | P2-41 | `WorldRenderer.ts:1012` | Capture `baseY` as the agent's drawn `ay` position, not `container.y`. Apply bounce by offsetting the sprite within the container. | Hustle bounce visually centers around the agent's resting position. |
| 5.5 | P2-42 | `WorldRenderer.ts:798, 1459` | Clear `decliningGraphics` array at the start of `renderSmooth` (alongside `removeChildren`). Re-populate during building rendering. | No alpha updates applied to detached Graphics objects. |
| 5.6 | P2-40 | `WorldRenderer.ts:903, 914` | Compute `has_active_tx` by checking if agent has any transactions at the current tick. | Agents move to transit location during active transactions. |
| 5.7 | P2-35 | `WorldRenderer.ts:173-174` | Scale `walkTimer` increment by `playSpeed`. | Walk cadence matches playback speed. |
| 5.8 | P3-47 | `iso.ts` | Remove unused `AGENT_W` and `AGENT_H` exports. | No dead code confusion. |

---

## Sprint 6: Decorations & Grid Polish
> **Goal**: Fix decoration scaling, sprite offsets, and grid visual quality.
> **Files**: `WorldRenderer.ts`, `pixelSprites.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 6.1 | P1-20 | `WorldRenderer.ts:493` | Change decoration sprite scale from `1` to `SPRITE_SCALE` (2). Adjust offsets to match new rendered size. | Trees/bushes are proportional to agents. |
| 6.2 | P1-21 | `WorldRenderer.ts:493, 495, 516` | Fix offsets: tree `x - width/2`, bush centered, lamp `y` offset to sit on tile. | Decorations centered on their tiles. |
| 6.3 | P3-59 | `pixelSprites.ts` | Trim dead space columns from FLOWER_RED and FLOWER_YELLOW sprites. | Flowers centered in texture. |
| 6.4 | P3-60 | `pixelSprites.ts:300` | Adjust TREE_SMALL canopy to be symmetric around the trunk column. | Tree looks balanced. |
| 6.5 | P2-31 | `WorldRenderer.ts:55` | Move RESIDENTIAL zone label to `col: 12, row: 16` to center over t4 band. | Label visually covers main residential area. |
| 6.6 | P2-32 | `WorldRenderer.ts:435` | Extend road markings to rows 1-3 of auto_row, or draw a thin road line along the robotaxi path. | Auto row has a visible road feature. |
| 6.7 | P3-50 | `WorldRenderer.ts:424-431` | Add subtle ground texture dots to civic, services, and auto_row zones (different density/color). | All zones have some ground texture. |

---

## Sprint 7: UI/UX Panels & Interactions
> **Goal**: Fix panel layout, broken buttons, hit areas, and data display.
> **Files**: `AgentCard.tsx`, `BuildingCard.tsx`, `EconomicDash.tsx`, `styles.css`, `WorldRenderer.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 7.1 | P1-14 | `AgentCard.tsx:47` | Change to template literal: `` className={`agent-sprite-placeholder tier-${agent.tier}`} `` | Tier CSS class applied correctly. |
| 7.2 | P2-36 | `AgentCard.tsx:197-198`, `BuildingCard.tsx:116-117` | Either add `onClick` handlers or remove the buttons / make them visually disabled. | No non-functional interactive-looking buttons. |
| 7.3 | P2-33 | `styles.css:66-72` | Collapse `.panel-area` width to 0 (or `display: none`) when no agent/building is selected. | Canvas uses full width when nothing selected. |
| 7.4 | P2-38 | `WorldRenderer.ts:601-603` | Set explicit `hitArea` on building containers matching only the building shape (wall polygon), not the full container bounds. | Clicking between buildings doesn't trigger selection. |
| 7.5 | P2-39 | `WorldRenderer.ts:603` | Add `pointerover`/`pointerout` handlers that adjust building alpha or add a highlight glow. | Buildings visually highlight on hover. |
| 7.6 | P2-37 | `WorldRenderer.ts:1136-1147` | Increase jitter spacing or use a stacked vertical layout for agent labels when > 4 agents on same tile. | Agent names readable at crowded tiles. |
| 7.7 | P3-57 | `EconomicDash.tsx:14` | Show placeholder dashes `—` instead of returning null when data is missing. | Dashboard stays visible at all ticks. |
| 7.8 | P3-61 | `App.tsx:110-113` | Cap combined panel height to viewport; use tabs or accordion instead of stacking both. | Panel content fits within viewport. |
| 7.9 | P3-62 | `ScrubBar.tsx` or `EconomicDash.tsx` | Remove duplicate stat display from one of the two components. | Each stat shown once on screen. |

---

## Sprint 8: Performance & Error Handling
> **Goal**: Reduce GC pressure, fix timing bugs, add robustness.
> **Files**: `WorldRenderer.ts`, `BuildingTransitionManager.ts`, `simStore.ts`, `usePlayback.ts`, `useUrlState.ts`

| Task | Issue | File(s) | Change | Acceptance Criteria |
|------|-------|---------|--------|---------------------|
| 8.1 | P1-16 | `WorldRenderer.ts:259` | Replace `this.btm.update(1/60)` with `this.btm.update(this.app.ticker.deltaMS / 1000)`. | Transitions run at correct speed on all refresh rates. |
| 8.2 | P1-17 | `WorldRenderer.ts:1471` | Replace frame-rate-dependent `Date.now() % 500 < 20` with an elapsed-time accumulator that spawns smoke every 500ms regardless of fps. | Smoke density consistent across devices. |
| 8.3 | P2-27 | `WorldRenderer.ts:313-315` | Snap camera to target when distance is < 0.5px: `if (Math.abs(this.worldContainer.x) < 0.5) this.worldContainer.x = 0`. | Camera settles exactly at zero, no jitter. |
| 8.4 | P2-34 | `usePlayback.ts:56` | Remove `currentTick` from useEffect deps. Read current tick via `useRef` inside the animation frame callback. | No tick-skipping during playback. |
| 8.5 | P2-43 | `WorldCanvas.tsx:112` | Move `interpolation`-driven rendering to the PixiJS ticker instead of React useEffect. Only use useEffect for tick/layer/data changes. | `renderSmooth` not driven by React re-renders during playback. |
| 8.6 | P3-56 | `simStore.ts:293-301` | Add `r.ok` check on each fetch. Wrap each in try/catch for individual error messages. | Failed file identified in error message; other files still load. |
| 8.7 | P3-54 | `useUrlState.ts:100-107` | Parse and restore `layers` param in `onPopState` handler. | Browser back/forward preserves layer state. |
| 8.8 | P3-63 | `WorldRenderer.ts:95, destroy()` | Dispose textures in `spriteTextureCache` during `destroy()`. | No texture leak after renderer teardown. |
| 8.9 | P3-53 | `WorldRenderer.ts:15` | Remove unused `lerpColor` import. | No dead imports. |
| 8.10 | P3-45 | `worldData.ts:112-117` | Derive `WELL_KNOWN_TILES` from `BUILDING_TILE_OVERRIDES` instead of duplicating values. | Single source of truth for tile positions. |

---

## Sprint Dependency Map

```
Sprint 1 (Data) ─────────────────────────┐
Sprint 2 (Critical Render) ──────────────┤
                                          ├──► Sprint 4 (Building Visuals)
Sprint 3 (Container Architecture) ───────┤    Sprint 5 (Agent Rendering)
                                          │    Sprint 6 (Decorations)
                                          │    Sprint 7 (UI/UX Panels)
                                          └──► Sprint 8 (Performance)
```

- **Sprints 1 and 2** are independent and can run in parallel.
- **Sprint 3** should run before 4-7 (container hierarchy affects where things render).
- **Sprints 4, 5, 6, 7** are independent of each other and can run in parallel.
- **Sprint 8** should run last (performance optimization after correctness).

---

## Task Execution Protocol

Each atomic task follows this workflow:

1. **Read** the target file(s) around the specified line numbers
2. **Edit** only the lines needed for the fix — no surrounding refactors
3. **Build** — run `npx tsc --noEmit` to verify no type errors
4. **Verify** — confirm the acceptance criteria
5. **Commit** — one commit per task with message: `fix(viz): <description> [P0-N]`
6. **Next** — proceed to the next task in the sprint
