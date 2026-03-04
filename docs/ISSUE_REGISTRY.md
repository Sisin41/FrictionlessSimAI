# Issue Registry — Frictionless Sim AI Visualization

> Generated 2026-03-04. Comprehensive audit of `viz/` codebase.
> 63 issues total: 7 P0, 16 P1, 20 P2, 20 P3.

---

## P0 — Broken / Produces Wrong Output

### P0-1: `getAgentAtTick()` returns stale state for all ticks
- **File**: `viz/src/store/simStore.ts:329-341`
- **Symptom**: User scrubs to tick 3 but sees tick-14 grief_stage, agency, runway_months, threat_level. Only employment_status and savings change per tick.
- **Root cause**: Function spreads root-level agent fields (which are tick-14 values) instead of reading them from `agent.history[tick]`.
- **Impact**: Every UI panel (AgentCard, SpeechBubble, ScrubBar tooltip) shows wrong psychological/financial state for any tick except the last.

### P0-2: Informal market stalls render 6 rows from building
- **File**: `viz/src/pixi/WorldRenderer.ts:1276`
- **Symptom**: Market stalls appear at tile `(19,15)` while the informal_market building renders at override tile `(19,9)`.
- **Root cause**: `fireInformalMarket()` uses hardcoded `isoToScreen(19, 15)` instead of reading from `BUILDING_TILE_OVERRIDES`.
- **Impact**: Market stalls float in the residential area, detached from the building they belong to.

### P0-3: Screenshot spending_index multiplied by 100
- **File**: `viz/src/components/ScreenshotButton.tsx:53`
- **Symptom**: Screenshot overlay shows "Spend: 8300" instead of "Spend: 83".
- **Root cause**: `spending_index` is already on a 0-100 scale but code does `spending_index * 100`.
- **Impact**: Screenshot output contains nonsensical stat value.

### P0-4: Tile color blending produces corrupt colors for ~50% of tiles
- **File**: `viz/src/pixi/WorldRenderer.ts:411`
- **Symptom**: Random tiles flicker or show wrong hue on the grid.
- **Root cause**: `brightness` ranges 0.92-1.08. `blendColor(base, dark, 1 - brightness)` yields negative `t` when `brightness > 1.0`, which produces negative color channel values that corrupt after bit-shifting.
- **Impact**: Roughly half of all ground tiles have corrupted colors.

### P0-5: FOR LEASE text animation uses orphaned references
- **File**: `viz/src/pixi/WorldRenderer.ts:821-833, 1537-1543`
- **Symptom**: FOR LEASE signs appear but never animate (no slide-in or pulse).
- **Root cause**: Each frame creates a new `Text` object for the sign, but `forLeaseAnimations` map retains a reference to the previous frame's Text (which was destroyed by `removeChildren()`). The animation updates the orphaned text, not the visible one.
- **Impact**: FOR LEASE animation is completely broken.

### P0-6: Overlay animations persist when scrubbing backward
- **File**: `viz/src/pixi/WorldRenderer.ts:1332, 1395, 1429`
- **Symptom**: Protest crowd, market stalls, and pulse rings remain visible when user scrubs from tick 10 back to tick 3.
- **Root cause**: `onTickAdvance` only fires events forward (`fromTick < N && toTick >= N`). No cleanup logic exists for backward scrubbing. Elements are added to `overlayContainer` and never removed.
- **Impact**: Visual clutter from future events persists at past ticks.

### P0-7: Left wall mortar line math is wrong
- **File**: `viz/src/pixi/WorldRenderer.ts:645-650`
- **Symptom**: Mortar/brick lines on building left walls fan out from a point near screen origin instead of running horizontally along the isometric wall.
- **Root cause**: `lx0 = x + (0 - x) * (1 - t)` simplifies to `lx0 = x * t`, interpolating from screen origin `(0)` to building center `(x)`. Should interpolate between the two vertical edges of the left wall face.
- **Impact**: Left wall texture is visually broken on every building.

---

## P1 — Major Visual / Functional

### P1-8: Decoration container breaks isometric depth sorting
- **File**: `viz/src/pixi/WorldRenderer.ts:206-208`
- **Symptom**: Trees, bushes, lamps always render on top of all buildings and agents.
- **Root cause**: `decorationContainer` is added to `app.stage` above `worldContainer`, not depth-sorted with world renderables.
- **Impact**: Decorations at far rows visually overlap agents/buildings at near rows, breaking isometric depth.

### P1-9: World-positioned overlays don't follow camera
- **File**: `viz/src/pixi/WorldRenderer.ts:1332, 1395, 1429`
- **Symptom**: Protests, market stalls, and pulse rings stay fixed on screen while camera pans in follow-agent mode.
- **Root cause**: These elements use `isoToScreen()` world coordinates but are added to `overlayContainer`, which is not panned by the camera.
- **Impact**: Visual elements appear at wrong positions during follow mode.

### P1-10: Agent interpolation uses tick-14 psychology for all ticks
- **File**: `viz/src/pixi/WorldRenderer.ts:896-917`
- **Symptom**: Agent at tick 3 shows depression-based positioning even though they weren't depressed until tick 10.
- **Root cause**: `getAgentLocation()` reads `agent.grief_stage`, `agent.agency`, `agent.runway_months` from root-level fields (tick-14 values), not per-tick snapshots.
- **Impact**: Agent positions/animations wrong during playback of earlier ticks.

### P1-11: Community Center light direction inverted
- **File**: `viz/src/pixi/buildingSprite.ts:94-103`
- **Symptom**: Community Center dims with town instead of brightening as counterpoint.
- **Root cause**: Comment says "brightens as town darkens" but `lightAlpha: Math.min(1.0, health / 100)` makes it dim when health drops — same behavior as every other building.
- **Impact**: Narrative intent of the Community Center as a beacon of hope is lost.

### P1-12: 70% of transactions have empty initiator
- **File**: `viz-data/transactions.json`
- **Symptom**: Transaction flow arcs show only target glow, no source. Building/story panels under-count transactions.
- **Root cause**: 118/168 transactions have `initiator: ""` and `initiator_name: ""`.
- **Impact**: Transaction flow layer is largely broken; bilateral relationship visual is lost.

### P1-13: `agent.stress` not at root level in data
- **File**: `viz/src/store/simStore.ts:37`, `viz/src/pixi/LayerRenderer.ts:495`
- **Symptom**: Stress topology layer shows flat zero for all agents.
- **Root cause**: `Agent` interface declares `stress: number` at root but data only has `stress` inside `history[tick].stress`. Code reads `agent.stress ?? 0` which is always 0.
- **Impact**: Entire stress topology visualization layer is non-functional.

### P1-14: AgentCard CSS class is literal string, not template literal
- **File**: `viz/src/components/AgentCard.tsx:47`
- **Symptom**: Agent sprite placeholder always has class `tier-{agent.tier}` literally.
- **Root cause**: `className="agent-sprite-placeholder tier-{agent.tier}"` — plain string, not backtick template.
- **Impact**: Tier-specific styling never applies; all agents look the same in the card.

### P1-15: Full scene rebuild every frame (~60fps)
- **File**: `viz/src/pixi/WorldRenderer.ts:240`
- **Symptom**: Potential frame drops and GC pressure during playback.
- **Root cause**: `worldContainer.removeChildren()` destroys all building/agent containers every frame. Hundreds of `new Graphics()`, `new Text()`, `new Sprite()`, `new Container()` calls per frame, none pooled.
- **Impact**: Major performance bottleneck.

### P1-16: Transition dt hardcoded to 1/60
- **File**: `viz/src/pixi/WorldRenderer.ts:259`
- **Symptom**: Building transitions too fast on 30fps displays, too slow on 144fps.
- **Root cause**: `this.btm.update(1/60)` ignores actual frame time.
- **Impact**: Transitions play at wrong speed on non-60fps displays.

### P1-17: Smoke spawning is frame-rate dependent
- **File**: `viz/src/pixi/WorldRenderer.ts:1471`
- **Symptom**: Smoke density varies wildly between 30fps and 144fps machines.
- **Root cause**: `Date.now() % 500 < 20` relies on frame timing hitting a 20ms window.
- **Impact**: Visual inconsistency across devices.

### P1-18: Follow-agent scale distorts position
- **File**: `viz/src/pixi/WorldRenderer.ts:964-966`
- **Symptom**: Followed agent appears to jump when 1.3x scale is applied.
- **Root cause**: `container.scale.set(1.3)` scales around container origin `(0,0)`, not agent's visual center. Agent is drawn at absolute coords inside the container.
- **Impact**: Followed agent renders at wrong screen position.

### P1-19: `crowdLevel` and `signVisible` never rendered
- **File**: `viz/src/pixi/buildingSprite.ts`, `viz/src/pixi/WorldRenderer.ts`
- **Symptom**: Buildings never show crowd silhouettes in windows or OPEN signs.
- **Root cause**: `BuildingVisual.crowdLevel` and `signVisible` are computed and interpolated but no rendering code draws them.
- **Impact**: Two visual features are dead — computed data is wasted.

### P1-20: Decorations at scale=1, agents at scale=2
- **File**: `viz/src/pixi/WorldRenderer.ts:493`
- **Symptom**: Trees are 8x10px, agents are 24x32px — people are 3x taller than trees.
- **Root cause**: Decorations use `addDecoSprite(..., 1)` while agents use `SPRITE_SCALE = 2`.
- **Impact**: Scale mismatch breaks spatial believability.

### P1-21: Decoration sprite offsets don't match geometry
- **File**: `viz/src/pixi/WorldRenderer.ts:493, 495, 516`
- **Symptom**: Trees shifted fully left of tile, lamps float above tile.
- **Root cause**: Tree offset `x-8` should be `x-4` (half of 8px width). Lamp `y-10` exceeds sprite height (8px), causing float.
- **Impact**: Decorations misaligned from their tiles.

### P1-22: No windows on left wall
- **File**: `viz/src/pixi/WorldRenderer.ts:664-706`
- **Symptom**: Left wall of every building is a featureless solid slab.
- **Root cause**: Window drawing code only targets the right wall.
- **Impact**: Buildings look asymmetric and unfinished.

### P1-23: Heatmap uses original tiles, not override tiles
- **File**: `viz/src/pixi/LayerRenderer.ts:219-223`
- **Symptom**: Building health attributed to wrong zone in heatmap.
- **Root cause**: `const [col, row] = b.tile` uses original position, not `getBuildingDisplayTile()`.
- **Impact**: Zone health values can be wrong if overrides moved buildings across zone boundaries.

---

## P2 — Moderate Visual / UX

### P2-24: Sitting agent floats above ground
- **File**: `viz/src/pixi/pixelSprites.ts:173-181`
- **Symptom**: Agents in sitting animation hover 6px above the ground.
- **Root cause**: AGENT_SIT sprite has 3 empty rows at bottom. Anchor at `(0.5, 1.0)` pushes visible content up.
- **Impact**: Sitting agents look detached from the surface.

### P2-25: Slumping agent misaligned with shadow
- **File**: `viz/src/pixi/pixelSprites.ts:185-202`
- **Symptom**: Slumping agent shifted right relative to their shadow ellipse.
- **Root cause**: AGENT_SLUMP sprite head starts at column 5 vs column 4 for standing sprites.
- **Impact**: Minor sprite misalignment.

### P2-26: Celebration burst wrong position in follow mode
- **File**: `viz/src/pixi/WorldRenderer.ts:1230, 1578`
- **Symptom**: Celebration particles appear at wrong screen position when following an agent.
- **Root cause**: Position computed as `screen/2 - worldContainer.offset`, but `particleGraphics` also has `worldContainer.offset` applied — double compensation.
- **Impact**: Celebration visual misaligned during follow mode.

### P2-27: Camera lerp never reaches zero
- **File**: `viz/src/pixi/WorldRenderer.ts:313-315`
- **Symptom**: Sub-pixel jitter after unfollowing an agent.
- **Root cause**: Exponential decay `+= (0 - x) * 0.15` never reaches exactly 0 due to floating point.
- **Impact**: Indefinite micro-jitter on unfollowed camera.

### P2-28: Transitions only trigger on tint change
- **File**: `viz/src/pixi/WorldRenderer.ts:553`
- **Symptom**: `signVisible`, `boardedUp`, `lightAlpha` changes snap instantly instead of smooth transition.
- **Root cause**: Transition only starts when `prevVisual.tint !== newVisual.tint`. Other property changes without tint change are ignored.
- **Impact**: Non-tint visual state changes look jarring.

### P2-29: Thriving building tint too garish
- **File**: `viz/src/pixi/buildingSprite.ts`
- **Symptom**: Thriving buildings appear jaundice-yellow, visually dominating the scene.
- **Root cause**: `tint: 0xffd700` (bright gold) blended onto walls.
- **Impact**: Thriving buildings look unhealthy instead of prosperous.

### P2-30: Closed buildings nearly invisible
- **File**: `viz/src/pixi/buildingSprite.ts`
- **Symptom**: Closed buildings almost invisible against dark background.
- **Root cause**: `tint: 0x444444` blended toward black yields ~`0x1e1e1e`, nearly matching the `0x1a202c` background.
- **Impact**: Users can't see closed buildings.

### P2-31: Residential zone label mispositioned
- **File**: `viz/src/pixi/WorldRenderer.ts:55`
- **Symptom**: "RESIDENTIAL" label sits in t1/t2 area, not centered over the larger t4 band (rows 14-19).
- **Root cause**: Hardcoded `col: 10, row: 12`.
- **Impact**: Zone label doesn't visually cover the main residential area.

### P2-32: Road markings only on one row
- **File**: `viz/src/pixi/WorldRenderer.ts:435`
- **Symptom**: Single-row dots on row 2 don't read as a road.
- **Root cause**: Condition `zone === 'auto_row' && row === 2` only marks one row.
- **Impact**: Auto row lacks a visible road feature.

### P2-33: Panel area wastes 340px when empty
- **File**: `viz/src/styles.css:66-72`
- **Symptom**: Blank 340px column on screen when nothing selected.
- **Root cause**: `.panel-area` always rendered with fixed width.
- **Impact**: Canvas has less space than necessary.

### P2-34: Playback useEffect race condition
- **File**: `viz/src/hooks/usePlayback.ts:56`
- **Symptom**: Possible tick skipping during playback.
- **Root cause**: `currentTick` in useEffect deps causes re-registration every tick, resetting time reference. Closure captures stale tick value.
- **Impact**: Subtle tick-skip race condition.

### P2-35: Walk animation speed ignores playback speed
- **File**: `viz/src/pixi/WorldRenderer.ts:173-174`
- **Symptom**: Agents walk at same visual cadence at 0.1x and 5x playback.
- **Root cause**: `walkFrame`/`walkTimer` driven by 60fps ticker, not scaled by `playSpeed`.
- **Impact**: Walk animation doesn't feel connected to simulation speed.

### P2-36: Non-functional stub buttons
- **File**: `viz/src/components/AgentCard.tsx:197-198`, `viz/src/components/BuildingCard.tsx:116-117`
- **Symptom**: "All Reflections", "Transactions", "Sector View" buttons do nothing.
- **Root cause**: No `onClick` handlers.
- **Impact**: User confusion — buttons look interactive but are dead.

### P2-37: Agent labels overlap when clustered
- **File**: `viz/src/pixi/WorldRenderer.ts:1136-1147`
- **Symptom**: 5+ agents on one tile make names unreadable.
- **Root cause**: Jitter is only 8px horizontal / 6px vertical, and name labels at `ay + 3` overlap adjacent agents.
- **Impact**: Crowded tiles are unreadable.

### P2-38: Building hit area too large
- **File**: `viz/src/pixi/WorldRenderer.ts:601-603`
- **Symptom**: Clicking whitespace between buildings triggers a building click.
- **Root cause**: Container includes label, health bar, and sign — hit area extends beyond visible building.
- **Impact**: Accidental building selections.

### P2-39: No hover feedback on buildings
- **File**: `viz/src/pixi/WorldRenderer.ts:603`
- **Symptom**: No visual indication which building you're about to click.
- **Root cause**: Buildings have `pointerdown` but no `pointerover`/`pointerout` handlers.
- **Impact**: Poor discoverability — unclear which building will be selected.

### P2-40: `has_active_tx` always false
- **File**: `viz/src/pixi/WorldRenderer.ts:903, 914`
- **Symptom**: Agents never move to transit location during active transactions.
- **Root cause**: Hardcoded `has_active_tx: false` in both current and next-tick location computations.
- **Impact**: Transit animation feature is dead.

### P2-41: Hustle bounce baseY always 0
- **File**: `viz/src/pixi/WorldRenderer.ts:1012, 1453-1455`
- **Symptom**: Hustle bounce oscillates from y=-4 to y=0 instead of centered bounce.
- **Root cause**: `baseY: container.y` captured when container.y is still 0 (default).
- **Impact**: Bounce animation has constant upward offset.

### P2-42: `decliningGraphics` references detached objects
- **File**: `viz/src/pixi/WorldRenderer.ts:798, 1459`
- **Symptom**: Alpha animation on declining buildings applied to Graphics objects no longer in display tree.
- **Root cause**: `removeChildren()` destroys the containers but `decliningGraphics` array keeps stale refs. `tickAnimations` updates alpha on invisible objects.
- **Impact**: Declining building animation is wasted work; may not be visible.

### P2-43: interpolation in deps causes 60fps re-renders
- **File**: `viz/src/components/WorldCanvas.tsx:112`
- **Symptom**: React useEffect fires 60 times/sec during playback.
- **Root cause**: `interpolation` is in the dependency array and updates every animation frame via `setInterpolation`.
- **Impact**: Performance drag — full `renderSmooth` rebuild every frame through React.

---

## P3 — Minor / Polish

### P3-44: maxTick hardcoded to 14
- **File**: `viz/src/pixi/WorldRenderer.ts:892`, `viz/src/components/WorldCanvas.tsx:68,104`
- **Symptom**: Breaks if simulation ever exceeds 14 ticks.
- **Root cause**: `Math.min(tick + 1, 14)` instead of using `maxTick` from store.
- **Impact**: Future-proofing issue.

### P3-45: WELL_KNOWN_TILES duplicates BUILDING_TILE_OVERRIDES
- **File**: `viz/src/pixi/worldData.ts:112-117`
- **Symptom**: Maintenance hazard — updating one without the other causes divergence.
- **Root cause**: Same tile values hardcoded in two places.
- **Impact**: Easy to introduce bugs on future tile changes.

### P3-46: All transiting agents stack at park tile
- **File**: `viz/src/pixi/worldData.ts:146`
- **Symptom**: Multiple agents in transit cluster at a single point.
- **Root cause**: `location === 'transit'` always returns park tile.
- **Impact**: Visual stacking — can't distinguish transiting agents.

### P3-47: AGENT_W / AGENT_H dead exports
- **File**: `viz/src/pixi/iso.ts`
- **Symptom**: Dead code — values (20x28) don't match actual agent size (24x32).
- **Root cause**: Constants declared but never used; actual sizes computed from `SPRITE_SCALE`.
- **Impact**: Misleading code for future developers.

### P3-48: Large buildings have no door
- **File**: `viz/src/pixi/WorldRenderer.ts:709`
- **Symptom**: Large buildings (auto_mall, city_hall, etc.) have no visible entrance.
- **Root cause**: Door drawing condition excludes large buildings.
- **Impact**: Visual incompleteness on the most prominent structures.

### P3-49: Building shadow offset ignores size
- **File**: `viz/src/pixi/WorldRenderer.ts:612-618`
- **Symptom**: Small and large buildings cast identical shadows.
- **Root cause**: Hardcoded `+4px` offset for all sizes.
- **Impact**: Minor visual inconsistency.

### P3-50: Grass dots only on two zones
- **File**: `viz/src/pixi/WorldRenderer.ts:424-431`
- **Symptom**: Most zones (civic, services, auto_row) have no ground texture dots.
- **Root cause**: Dot placement only for `park` and `residential_t4`.
- **Impact**: Non-park/residential zones look flat and barren.

### P3-51: Building outline doesn't include roof edges
- **File**: `viz/src/pixi/WorldRenderer.ts:784-791`
- **Symptom**: Zone accent stroke only covers walls, not the roof face.
- **Root cause**: Outline polygon traces walls but not the roof top.
- **Impact**: Visual disconnect between roof and wall outline.

### P3-52: No transition-in for mid-sim buildings
- **File**: `viz/src/pixi/WorldRenderer.ts:575`
- **Symptom**: Buildings with `appears_tick > 0` (informal_market) pop in instantly.
- **Root cause**: No fade-in or construction animation.
- **Impact**: Abrupt visual appearance.

### P3-53: Dead `lerpColor` import
- **File**: `viz/src/pixi/WorldRenderer.ts:15`
- **Symptom**: Unused import — `blendColor` used instead.
- **Root cause**: Two color blending implementations exist; wrong one imported.
- **Impact**: Dead code clutter.

### P3-54: popstate doesn't restore layers
- **File**: `viz/src/hooks/useUrlState.ts:100-107`
- **Symptom**: Browser back/forward restores tick and agent but not layer state.
- **Root cause**: `onPopState` handler doesn't parse/restore `layers` param.
- **Impact**: Layer visibility lost on navigation.

### P3-55: URL tick validation hardcoded to 14
- **File**: `viz/src/hooks/useUrlState.ts:28`
- **Symptom**: URL `#t=15` rejected even if maxTick changes.
- **Root cause**: `t <= 14` hardcoded instead of using store `maxTick`.
- **Impact**: Future-proofing issue.

### P3-56: No individual fetch error handling
- **File**: `viz/src/store/simStore.ts:293-301`
- **Symptom**: One failed JSON fetch kills all data loading with generic error.
- **Root cause**: All 7 fetches in single `Promise.all` with no per-file `r.ok` check.
- **Impact**: Hard to debug which file failed; no graceful degradation.

### P3-57: EconomicDash vanishes when tick data missing
- **File**: `viz/src/components/EconomicDash.tsx:14`
- **Symptom**: Dashboard strip disappears causing layout jump.
- **Root cause**: Returns `null` when timeseries data missing for current tick.
- **Impact**: UI flicker on missing data.

### P3-58: SpeechBubble position stale during camera pan
- **File**: `viz/src/components/SpeechBubble.tsx:31-35`
- **Symptom**: Bubble stays at stale position while camera moves.
- **Root cause**: Position read once per React render, not synced with PixiJS ticker.
- **Impact**: Bubble lags behind agent during follow mode.

### P3-59: Flower sprites have dead space
- **File**: `viz/src/pixi/pixelSprites.ts`
- **Symptom**: Flowers not centered in their texture.
- **Root cause**: 8-char wide sprites with only 3 columns used; 5 columns transparent padding.
- **Impact**: Minor misalignment.

### P3-60: TREE_SMALL has lopsided canopy
- **File**: `viz/src/pixi/pixelSprites.ts:300`
- **Symptom**: Tree visually tilts to one side.
- **Root cause**: Asymmetric character placement in sprite definition.
- **Impact**: Minor aesthetic issue.

### P3-61: AgentCard + AgentStoryTimeline exceed viewport
- **File**: `viz/src/components/App.tsx:110-113`
- **Symptom**: Both panels render in 340px column, requiring excessive scrolling.
- **Root cause**: Combined max-height of 80vh + 420px exceeds viewport.
- **Impact**: User must scroll to see both panels.

### P3-62: Duplicate macro stats in ScrubBar and EconomicDash
- **File**: `viz/src/components/ScrubBar.tsx`, `viz/src/components/EconomicDash.tsx`
- **Symptom**: Employment, spending, ownership shown twice on screen.
- **Root cause**: Both components independently render the same stats.
- **Impact**: Redundant screen real estate usage.

### P3-63: spriteTextureCache never clears
- **File**: `viz/src/pixi/WorldRenderer.ts:95-104`
- **Symptom**: Textures persist in memory even after renderer destroyed.
- **Root cause**: Cache grows indefinitely with no disposal in `destroy()`.
- **Impact**: Minor memory leak (bounded by ~20 unique sprite variants).
