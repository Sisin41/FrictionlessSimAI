# THE LAST LUNCH RUSH — GENERATION PIPELINE
### nanobanana (images) × Kling (video) — Full Prompt Bundle
**Source screenplay:** MOVIE_BETTY.md
**Characters:** Betty Kowalski, Tommy, Maria Santos, Carlos Ruiz, Lisa Freeman, Kevin O'Brien
**Scenes:** 8 scenes, 30 shots, 2 minutes

---

## NODE 1 — VISUAL IDENTITY
*Seed for all downstream prompts. Every nanobanana and Kling prompt inherits this.*

### Style Anchor
**American Realist Drama** — photographic, quiet, observational.
References: *Nomadland* (2020), *Frozen River* (2008), *Wendy and Lucy* (2008).
Not melodrama. Not nostalgia. A town in transition, seen honestly.

### Aspect Ratio
**2.39:1 anamorphic** (letterbox). Wide and a little lonely.

### Film Stock
16mm grain texture. Slightly underexposed. Real light sources only — no fill.

### Color Palette by Zone

| Zone | Primary | Secondary | Feel |
|------|---------|-----------|------|
| Diner interior (full) | Warm amber `#C8954A` | Cream `#F5EDD9`, red vinyl `#8B3A3A` | Home, ritual |
| Diner interior (empty) | Same palette, lower exposure | Cooler cast, shadows heavier | Loss, absence |
| Auto Row exterior | Flat concrete `#8A8A8A` | Overcast midwest sky `#C5CBD3` | Indifferent, wide |
| Kitchen | Fluorescent green-white `#E8F0DC` | Stainless steel | Work, truth |
| Back office | Flat cool white | One yellow desk-lamp pool | Pressure, isolation |
| Pre-dawn dining room | Near-black, one warm glow | Kitchen pass-through light only | Decision, threshold |
| The AV (RoboRide) | Stark white `#FFFFFF` | No chrome, no warmth | Alien, clean, wrong |

### Lighting Rules
- Diner full: warm practicals + window spill, f/2.0 shallow
- Diner empty: same practicals, lower output, lonelier
- Pre-dawn: single source — kitchen pass-through glow only
- Back office: harsh single overhead fluorescent, cast shadows
- AUTO ROW exterior: flat overcast, no warmth, wide depth of field

### Camera Grammar
| Shot Type | Movement | Feel |
|-----------|----------|------|
| WIDE / ESTABLISHING | Handheld, slight observational drift | Present, not directed |
| MED | Locked or very slow push (3–5 sec) | Attention, weight |
| CLOSE | Rack focus in, shallow DOF f/1.8 | Intimate, revealing |
| INSERT | Flat top-down lay OR extreme macro, fully locked | Evidence, document |
| POV | Slightly unsteady, eye height | First-person witness |
| ECU | Still, no movement | Resting on a face |

### Typography (Data Overlays)
- Font: Helvetica Neue Light, white
- Background: pure black bar, full width, bottom third
- Style: clean, minimal — the data speaks, the design doesn't

### Nanobanana Style Suffix
*Append to every image prompt:*
```
cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama,
Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field,
photographic not illustrated, quiet and observational
```

### Kling Motion Suffix
*Append to every video prompt:*
```
16mm grain, anamorphic lens, naturalistic lighting, no artificial fill,
slow deliberate pacing, 24fps, American realist drama, quiet
```

---

## NODE 2 — CHARACTER SPRITES
*nanobanana prompts — each character × 3 angles × key emotional states*

---

### SPRITE_BETTY_FRONT
**Scene:** Scenes 1, 2, 3, 5, 6 (general diner presence)
**Shot type:** MED
**Prompt:**
Betty Kowalski, white woman, 58, practical short grey hair, wire-rim glasses, worn canvas apron over cream work shirt, standing behind diner counter facing camera, neutral expression carrying quiet dignity and accumulated fatigue, hands resting on counter edge slightly apart — expressive, capable hands, no makeup, lived-in face with deep laugh lines and crow's feet, soft warm light from overhead fluorescents diffused by age, diner interior background soft focus — vinyl booth backs, laminate counter edge, old coffee station, muted amber and cream tones, window light from left side suggesting morning, shallow depth of field blurring background detail, upper body framing from mid-chest up, posture upright but not stiff — a woman at home in her space, color palette cream and warm grey, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** makeup, jewelry, styled hair, bright colors, smiling broadly, posed artificially, illustrated or painterly style, sharp busy background, overhead harsh lighting, youth, glamour, digital clean render

---

### SPRITE_BETTY_3Q
**Scene:** Scenes 1, 2, 5 (active service)
**Shot type:** MED
**Prompt:**
Betty Kowalski, white woman, 58, short grey hair, wire-rim glasses slightly askew, worn apron over light blue work shirt, three-quarter angle facing left of frame, mid-motion — coffee pot in right hand extended toward an off-frame cup, slight motion blur on hands and wrist only suggesting the practiced efficiency of ten thousand refills, weight shifted onto left foot, expression focused and elsewhere at the same time — thinking about something else while the body works, morning window light entering from frame right casting soft directional warmth across her face, diner counter in background soft focus — coffee station, ticket rail, pass-through window glow behind, muted amber and cream color palette, upper body shot from hip to crown, photographic shallow depth of field, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** posed, static, sharp background, bright colors, dramatic expression, illustrated, digital clean, smiling, young, glamorized, full stop motion

---

### SPRITE_BETTY_HANDS
**Scene:** Scenes 2, 5, 6 (decision-making, paperwork)
**Shot type:** ECU
**Prompt:**
Extreme close-up of Betty Kowalski's hands only — aged white woman's hands, 58, knuckles prominent, skin dry and capable, short unpainted nails, writing in a yellow legal pad with a ballpoint pen, pen caught mid-stroke on a line of practical handwriting — numbers, lists, something that matters, table surface visible: formica laminate, worn at edges, coffee ring stain nearby, corner of apron fabric visible at upper right edge, soft warm light from table lamp or window left casting directional shadow from pen and fingers, hand and forearm fill the frame, slight natural motion in the pen-holding fingers, ink line incomplete — caught in the act, color palette warm yellow of legal pad, grey-cream of worn table, flesh tone of hands, muted and honest, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** young hands, manicured nails, nail polish, illustrated, stylized, dramatic lighting, dark moody, medical or horror context, full face visible, props beyond pen and pad

---

### SPRITE_BETTY_DECIDING
**Scene:** Scene 6 (the decision — reading the grant folder)
**Shot type:** CLOSE
**Prompt:**
Betty Kowalski, white woman, 58, close-up face and upper shoulders, pre-dawn light — the specific blue-grey quality of 5am before sunrise, warm amber glow of the kitchen pass-through window behind and slightly left casting a thin rim of warm light along her jaw and cheekbone, her face in the cool blue of early morning, wire-rim glasses on, eyes directed slightly downward and off-frame left toward something on the table — a folder, documents, a decision that can't be unmade, expression suspended between fear and resolve, not defeated, not certain — the moment before, short grey hair catching the pass-through warm light at crown, no makeup, deep eye lines visible in the pre-dawn contrast, upper body framing cuts at collarbone, apron strings visible at shoulders, background is the soft dark blur of the empty dining room behind her — chairs on tables, darkness, the diner at its most private, color palette cool blue-grey dominant, warm amber accent from pass-through, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** bright light, daytime, dramatic tears, theatrical expression, illustrated, digital clean, sharp background, harsh shadows, horror mood, over-exposed, young

---

### SPRITE_BETTY_STANDING
**Scene:** Scene 5 (phone call, back office)
**Shot type:** MED
**Prompt:**
Betty Kowalski, white woman, 58, full figure standing at a cluttered back office desk, phone receiver held to left ear — old landline or early mobile, nothing sleek, left hand flat on open yellow legal pad, body slightly turned toward desk but face angled away in the focused posture of listening hard, wire-rim glasses on, plain cream work shirt, apron still on, sensible shoes on linoleum floor, back office environment: cork board with papers pinned, filing cabinet, a single bare bulb or fluorescent tube overhead casting flat practical light, window small and high letting in grey outside light, stacks of paper, binders, a coffee mug with old coffee in it, full figure from floor to head, expression concentrated — listening to something important, body language restrained but alert, muted grey and cream color palette, warm fluorescent overhead slightly green-shifted, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** modern smartphone, sleek office, bright colors, dramatic pose, illustrated, young, glamorized, sharp busy background in focus, smiling, performative

---

### SPRITE_TOMMY_BOOTH
**Scene:** Scene 1 (comfortable, settled)
**Shot type:** MED
**Prompt:**
Tommy, white man, early 50s, broad build, union work shirt — dark navy or grey with small logo on chest — and a worn canvas work jacket hanging open, seated comfortably in a vinyl diner booth, settled into the seat the way a man sits in a place he's sat a hundred times, window beside him showing grey morning outside — bare trees or parking lot, soft and out of focus, white ceramic coffee cup on the table in front of him, both hands around or near the cup, expression relaxed and unhurried — the face of a town that still believes in Tuesday, MED shot cutting at table level showing upper body, slight lean back against the booth, morning light from the window falling across the left side of his face and shoulder, face weathered but not worried, vinyl booth back visible behind him warm cream color, color palette grey-navy of work clothes, cream of booth, grey morning window light, muted and warm, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** dramatic expression, bright colors, illustrated, young, smiling broadly, busy sharp background, posed artificially, elegant or upscale setting, digital clean render

---

### SPRITE_TOMMY_LEAVING
**Scene:** Scene 8 (departure, absence beginning)
**Shot type:** MED
**Prompt:**
Tommy's back — white man, broad build, navy work jacket, seen from behind walking toward the diner door or just reaching it, back and shoulders filling frame left and center, the table he just left visible behind him — empty vinyl booth, white ceramic cup pushed to the side, two-dollar bill flat on the table surface, the specific smallness of a left tip, Betty visible in soft focus background center-right — behind the counter, watching or not watching, going about, the geometry of a goodbye that isn't announced, morning or midday window light, color palette muted grey and navy of Tommy's jacket dominant, warm cream of booth, Betty a blur of apron-cream and grey hair in distance, shot feels like watching something end without ceremony, MED framing shows from mid-back up to head of Tommy and full soft-focus background depth, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** face of Tommy visible, dramatic farewell, tears, bright colors, sharp busy background, illustrated, posed, digital clean, sentimental overstatement

---

### SPRITE_MARIA_COUNTER
**Scene:** Scene 3 (delivering the grant flyer)
**Shot type:** MED
**Prompt:**
Maria Santos, Latina woman, early 40s, professional blazer — charcoal or deep teal — over a practical dark top, standing at the diner counter, leaning slightly forward, right hand sliding a folded flyer across the counter toward camera — flyer partially visible, folded, color not yet readable, expression purposeful and warm but not soft — this is a woman making things happen, eyes engaged and direct, clipboard resting on the counter stool to her right, slight lean of the body conveying forward momentum even while standing still, diner counter in foreground, warm soft-focus diner interior behind her — Betty partially visible at right edge blurred, coffee station, morning light from left, color palette the charcoal and teal of her blazer against the warm cream of the diner, MED shot from counter surface to above her head, naturalistic overhead and window light, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** bureaucratic coldness, stiff pose, bright unrealistic colors, illustrated, glamorized makeup, sharp busy background, digital clean, performative smile, suited executive look

---

### SPRITE_CARLOS_TABLE
**Scene:** Scene 4 (explaining the kitchen layout)
**Shot type:** MED
**Prompt:**
Carlos Ruiz, Latino man, mid 40s, slight build, mechanic's work shirt — grey or dark green, name tag on chest reading CARLOS — seated at a laminate diner table, leaning forward over a napkin sketch he's drawn, right hand mid-gesture pointing at or tracing the sketch — work-worn hands with engine grease in the knuckle lines, a plate of eggs beside him, cold now — yolk skin beginning to form, fork resting untouched, Betty's yellow legal pad visible at the left edge of frame, expression animated and concentrated — a man who thinks in systems and is trying to make someone else see what he sees, MED shot framing from table surface to above head showing full upper body and table surface, diner window light from left, warm soft interior light, table surface laminate worn at edges, background soft focus — vinyl booths, other tables, the quiet mid-morning diner, color palette grey-green of his shirt, cream laminate, the yellow of the legal pad edge, muted naturalistic, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** clean hands, dramatic gesture, sharp focus background, bright colors, illustrated, digital clean, young, professional setting, food looking fresh and hot, posed

---

### SPRITE_LISA_ENTERING
**Scene:** Scene 4 (arriving with news)
**Shot type:** MED
**Prompt:**
Lisa Freeman, Black woman, 35, natural hair, practical jacket — olive or dark rust — mid-stride entering the diner through the front door, body caught between outside and inside, motion in her step not stopped for the camera, eyes already across the room finding Betty — the eye contact of news being delivered before a word is spoken, clipboard under left arm or held against chest, expression direct and alive — something has happened and she has come to say it, morning or afternoon light from the door behind her creating a slight backlight halo around her natural hair and shoulders, diner interior in background soft focus — booths, counter, the room opening up behind the frame, MED shot from floor to just above head showing full figure in motion, color palette the olive or rust of her jacket against the warm cream interior of the diner, natural backlight from door, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** posed static stance, dramatic burst-through-door, bright interior lighting, sharp busy background, illustrated, digital clean, performative expression, stiff or formal posture

---

### SPRITE_LISA_HOSTESS
**Scene:** Scene 8 (mutual aid operation)
**Shot type:** MED
**Prompt:**
Lisa Freeman, Black woman, 35, natural hair, practical jacket, standing at the old hostess stand near the diner entrance — the stand repurposed now, covered with papers, a delivery coordination sheet she's marking with a pen, lists of names and addresses, a quiet new purpose for an old piece of furniture, expression focused and purposeful — she has found the work and is doing it, the empty dining room extending behind her in soft focus — chairs still on tables or some pulled down, booths empty, the room holding its former life in its bones, afternoon or flat grey light, no customers, only the work, MED shot from stand surface to above head, slight angle showing both her and the sweep of the empty dining room over her shoulder, color palette muted — olive jacket, cream and wood of the hostess stand, the grey-cream empty room behind, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** busy crowd background, bright colors, illustrated, digital clean, smiling broadly, sharp background detail, performative pose, dramatic lighting

---

### INSERT_KEVIN_CARD
**Scene:** Scene 6 (the approval moment)
**Shot type:** INSERT
**Prompt:**
Extreme close-up flat lay of a single cream business card on a dark walnut wood desk surface — card stock quality, slight texture visible in the 16mm grain, front face readable: "Kevin O'Brien" in navy serif type, below it "Loan Officer" in smaller navy, below that "Community First Credit Union" in slightly smaller navy — clean, institutional, local, card flipped to show back: handwritten in blue ballpoint pen, slightly uneven baseline, the ink pressure of a man writing quickly and meaning it: "$12K — approved." — period after the word, the finality of it, one corner of the card slightly curled upward from age or being handled, a warm pool of incandescent desk lamp light falling from upper right, leaving the left edge of the card in softer shadow, dark wood grain visible in the negative space around the card, no other objects in frame, color palette cream card, navy type, blue ink, dark warm wood, amber lamp light, cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** digital mockup, bright white background, multiple cards, other objects cluttering frame, modern sleek desk, illustrated, sharp clinical lighting, credit card, plastic, glossy finish

---

## NODE 3 — ENVIRONMENT & PROP SPRITES
*nanobanana prompts — all locations, the AV, key props*

---

### ENV_DINER_EXT_DAWN
**Scene(s):** Scene 1, Scene 2
**Shot type:** WIDE / ESTABLISHING
**Prompt:**
Wide establishing shot of the Auto Row Diner at dawn, Midwest, overcast sky. The diner's neon sign — "AUTO ROW DINER" in red and warm white — flickers on, tubes just warming up, casting a faint pink-amber glow on the wet concrete sidewalk below. The building itself: a converted roadside structure, painted cream with a red stripe, a flat awning, a single window glowing warm amber from inside where kitchen prep has already started. Stretching behind and beside it down a flat midwestern commercial strip: a Ford dealership with dark flags, a transmission shop with hand-painted signage, a mechanic's bay with the roll-up door already cracked open, orange shop light spilling out, one car on a lift visible inside. A gas station at the far end of the block, its canopy fluorescent in the gray morning. Overcast flat light, color temperature cool at #C5CBD3, the sky a pale gray-blue, no direct sun, no shadows. The diner neon adds the only warm color. The street mostly empty — one pickup truck parked at the curb. The diner looks like it belongs here absolutely, rooted, unchanged. Wide frame uses the full 2.39:1 letterbox to flatten the geography. Foreground: rain-wet sidewalk with a faint neon reflection. Shot slightly underexposed, shadow values held, highlight on the neon sign the brightest element in frame. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** sunshine, golden hour, dramatic clouds, retro diner aesthetic, neon-noir oversaturation, lens flares, people in frame, illustrated or stylized look, HDR, clean or new-looking surfaces, stock photography feel

---

### ENV_DINER_EXT_DAY
**Scene(s):** Scene 3, Scene 7
**Shot type:** WIDE / ESTABLISHING
**Prompt:**
Wide shot of the Auto Row Diner, same angle as dawn establishing shot, midday, overcast Midwest light. Flat gray-white sky, no shadows, diffuse. The diner exterior unchanged — cream paint, red stripe, the neon sign off in daylight. The window shows the dining room lit inside with warm amber practicals. But the street has changed. The Auto Row commercial strip: fewer cars at the dealership lot, one of the mechanic bay roll-up doors now closed, a sense of reduced activity without explicit signage of it. On the road in the midground: a white autonomous RoboRide vehicle gliding from right to left, perfectly smooth motion, stark white with no chrome, no driver visible behind the windshield. It is clean and incongruous on this working-class commercial street. Behind it: the same flat overcast Midwest sky, the diner unchanged, the buildings unchanged. The contrast is quiet — the street is different, but the diner doesn't know it yet. Full 2.39:1 wide frame. Underexposed midday — overcast holds the exposure down, no specular highlights, matte surfaces. The white of the AV is the cleanest white in frame, which is wrong. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** sunshine or direct sun, dramatic sky, AV with chrome or color detail, driver visible, busy street, retro diner aesthetic, illustrated look, lens flare, HDR, stock photography

---

### ENV_DINER_INT_FULL
**Scene(s):** Scene 1, Scene 2 (peak lunch)
**Shot type:** WIDE / INTERIOR
**Prompt:**
Wide interior shot of the Auto Row Diner at peak lunch service. Every booth occupied, the lunch counter lined with men and women in work shirts, Carhartt jackets, steel-toed boots — auto workers, mechanics, local tradespeople, a few office workers. Red vinyl booth seats worn smooth, cracked at the seams, patched with electrical tape on one. Chrome trim on the counter edge, a row of swivel stools, formica countertop with coffee rings and the ghost of decades of use. The space worn and real, not retro-dressed — Americana that came naturally. Warm amber light from practical pendant lights overhead (#C8954A) and window spill from large front windows, overcast daylight cool and soft from outside cutting against the warm practicals. Two things happening at once: a waitress's arm at frame edge delivering plates, a coffee cup mid-pour. The noise implied in the motion — silverware catching light, mouths open mid-conversation, a hand gesturing. Shallow depth of field: the foreground booth sharp, mid-ground faces soft, background counter soft. Color: warm amber dominant, cream walls, red vinyl, chrome glints. Shot slightly underexposed. No empty seats. The diner full to its bones. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** retro kitsch, clean or new vinyl, modern decor, overhead fluorescent color, tourists or casual diners, illustrated look, stock photography warmth, staged costuming, HDR, lens flare, empty seats

---

### ENV_DINER_INT_HALF
**Scene(s):** Scene 3, Scene 4
**Shot type:** WIDE / INTERIOR
**Prompt:**
Wide interior of the Auto Row Diner, same angle as the full lunch shot, same time of day, same overcast daylight from the windows, same practical amber pendants overhead. But half the booths are empty. The occupied booths cluster toward the window side — four people at the counter, one couple in a middle booth, one man alone near the back. The empty booths in the foreground and mid-ground: place settings cleared, vinyl seats empty, chrome and formica reflecting the amber overhead light into quiet nothing. Peak hour by the clock on the wall — wrong. The empty seats dominate the frame, more present than the filled ones. Lower exposure than the full version — the same practicals but metered down, as if the light source is the same but the room absorbs it differently now. Shadows heavier in the empty booths. Color palette unchanged but cooler in the empty zones, warm where people are. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** empty diner at night, dramatic or obvious sadness, illustrated look, retro kitsch, HDR, lens flare, stock photography, staged emptiness, closed signs, any text or signage in frame

---

### ENV_DINER_INT_EMPTY
**Scene(s):** Scene 6, Scene 8
**Shot type:** WIDE / INTERIOR
**Prompt:**
Wide interior of the Auto Row Diner, pre-dawn, before open. Chairs upturned on tabletops — metal chair legs pointing up, casting thin shadows. The dining room unlit, no practicals on, no window light — outside still dark. The only light source: the rectangular pass-through window at the back wall to the kitchen, warm amber-orange glow from inside the kitchen beyond, a 3-foot by 2-foot rectangle of warm light floating in the dark dining room. That window: the brightest element in frame, sharp. Everything in the dining room: near-dark, deep shadow, the upturned chairs in silhouette shapes, formica surfaces catching the faint kitchen spill at the edges. Color temperature: near-black in the dining room (#0a0806), warm orange-amber through the pass-through. No people visible. The silence is physical. Slightly underexposed even in the kitchen glow. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** neon, exterior light, dawn light from windows, people, drama or horror mood, illustrated look, HDR, surveillance-camera feel, lens flare, stock photography, clean or bright interior

---

### ENV_DINER_INT_PREDAWN_TABLE
**Scene(s):** Scene 6 (Betty's pre-dawn decision)
**Shot type:** LOW ANGLE / INTIMATE
**Prompt:**
Low angle on a single diner booth table, pre-dawn. The table surface: formica, worn, the edge of the table sharp in focus at the bottom of the frame. On the table: a manila folder open, papers inside, one yellow legal pad with handwriting visible (not readable at this angle), one ballpoint pen resting across the pad. The items lit from the far background: the kitchen pass-through glow, warm amber, far out of focus — a soft rectangle of warm light at the back of the dark dining room. The foreground table barely lit, catching just the edge of that distant kitchen light. The surrounding dining room: completely dark, chairs on tables visible in silhouette out of focus on both sides. Depth of field extremely shallow — the legal pad sharp, the folder edge soft, the kitchen glow a warm bokeh blob. Color: near-black everywhere, the warm amber-orange glow the only chromatic information. No person in frame — implied by the open folder, the pen out of its cap. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** person in frame, overhead light, bright or dramatic lighting, illustrated look, HDR, lens flare, stock photography, legible text on papers, retro styling

---

### ENV_KITCHEN_ACTIVE
**Scene(s):** Scenes 2, 4
**Shot type:** MEDIUM-WIDE / INTERIOR
**Prompt:**
Medium-wide of the Auto Row Diner kitchen during active service. Stainless steel counters, a flat-top grill with a faint heat shimmer above the surface, a smaller prep counter to the right, an overhead hood vent, industrial shelving with cans and supplies at back. The pass-through window to the dining room in the mid-ground, the dining room warm amber visible through it. Fluorescent overhead light: green-white cast (#E8F0DC), the kind that makes steel look honest and skin look tired. Busy but controlled — no chaos, the order of a working kitchen. At the left edge of frame: hands only, a woman's hands (implied Betty) — one hand on a spatula at the flat-top, the other reaching for a plate. The grill surface: active, a few items cooking, steam wisping up. Slightly underexposed. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** glamorous kitchen, chef's toque, restaurant photoshoot styling, warm light, full person in frame, illustrated look, HDR, lens flare, stock photography, new equipment

---

### ENV_KITCHEN_DELIVERY
**Scene(s):** Scenes 7, 8
**Shot type:** MEDIUM-WIDE / INTERIOR
**Prompt:**
Medium-wide of the diner kitchen, same angle as active kitchen shot, but the meal service has ended. The flat-top grill: off, its surface cooling. On the prep counter: four insulated delivery bags stacked neatly, black with silver trim, slightly worn. Beside them: a cardboard supply box torn open at the top, packing material visible. On the wall above the pass-through window: a handwritten route sheet taped crookedly with masking tape — columns of names and addresses in blue ballpoint, readable as a document but not legible at this distance. The pass-through window to the dining room: the dining room beyond is dark and empty, chairs upturned visible through the window. Fluorescent overhead light: same green-white (#E8F0DC). Dawn light from one small high window at the back wall — pale gray-blue, early, cold, entering from above at a low angle and cutting across the delivery bags. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** active cooking, people in frame, warm dining room light through pass-through, illustrated look, HDR, lens flare, stock photography, modern commercial kitchen, brand logos on bags

---

### ENV_BACK_OFFICE
**Scene(s):** Scene 5
**Shot type:** MEDIUM / INTERIOR
**Prompt:**
Small back office behind the diner kitchen. Standing desk — a repurposed shelf at standing height, no chair, the kind improvised out of necessity. The overhead light: a single fluorescent tube, flat harsh white light (#F0F0F0), the kind that casts almost no shadow and gives everything a slight institutional pallor. On the desk surface: a yellow legal pad, a telephone (landline, receiver on its cradle), a ballpoint pen, a coffee mug. The walls: bare, pale, slightly scuffed. A corkboard with a few papers pinned to it. The door to the kitchen: slightly ajar at the right edge of frame, and through the gap — a warm orange-amber bar of kitchen light bleeding into the office. That thin line of warm kitchen light is the only warmth in the frame. The room slightly claustrophobic, the ceiling low and close, the frame tight. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** comfortable office, chair, desk lamp (only fluorescent overhead), warm overall lighting, illustrated look, HDR, lens flare, stock photography, modern office furniture, plants or decoration

---

### ENV_AV_PASSING
**Scene(s):** Scene 3
**Shot type:** POV / THROUGH GLASS
**Prompt:**
Shot from inside the diner, looking out through the large front window at the street. The diner window glass in the foreground: slightly reflective, showing a ghost reflection of the dining room interior — a booth, a pendant light, vague warm amber shapes — layered over the exterior view. Through the glass: the RoboRide autonomous vehicle in motion on Auto Row, moving left to right through the mid-ground. The AV: stark white (#FFFFFF), perfectly clean, no chrome, no color detail, a smooth minimal form, the driver seat visible through its windshield and empty — no driver. Motion blur on the vehicle, slight. The street beyond: overcast Midwest flat gray-white light. The diner window reflection layered over the exterior scene creates a palimpsest — the warm diner world and the cold exterior world occupying the same plane of glass. The AV is cleanest, brightest, most wrong thing in the frame. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** dramatic lighting, chrome on AV, driver in AV, sunny exterior, illustrated look, HDR, lens flare, stock photography, sci-fi aesthetic, blue-tinted glass

---

### ENV_AV_STATIC
**Scene(s):** Scene 3 (establishing)
**Shot type:** THREE-QUARTER FRONT / EXTERIOR
**Prompt:**
Three-quarter front angle on the RoboRide autonomous vehicle, parked or moving very slowly on Auto Row. The AV: stark white, completely clean, the design minimal and slightly wrong — too smooth, too sealed, no chrome trim, no color accents, no warmth anywhere in the object. The windshield: dark, the interior barely visible, no driver. The overall form: a medium-sized sedan shape but slightly too clean, the proportions slightly off, as if designed by someone who had only read about cars. Auto Row behind it: the transmission shop across the street, a dealership flag limp in still air, a telephone pole, flat gray overcast sky (#C5CBD3). The overcast Midwest flat light removes all shadows from the AV's surface — it is perfectly evenly lit, which makes it look wrong. The car feels like a mistake in the frame. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** sci-fi styling, chrome, color accents on AV, driver visible, dramatic or golden light, illustrated look, HDR, lens flare, stock photography, futuristic background, brand logos

---

### INSERT_TOMMYS_TIP
**Scene(s):** Scene 2
**Shot type:** INSERT / FLAT LAY
**Prompt:**
Extreme close-up, top-down flat lay. A single two-dollar bill lying flat on a cleared diner formica table. The bill: face up, slightly worn, one corner bent, real-world currency not crisp. No note. No receipt. No pen. Nothing else on the table — just the bill, alone. The formica surface: cream with a faint abstract pattern, worn smooth, bearing the ghost of the meal that was just cleared — a faint ring where a coffee cup sat, a slight moisture mark. The light: residual warm amber from the overhead practical pendant, the meal-time light still present, fading slightly as the lunch rush thins. The light source is above and slightly to the left — warm amber (#C8954A) with a gentle falloff. Shallow depth of field: the bill sharp at center, the formica surface softening slightly toward the edges. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** person in frame, receipt or note, wallet, multiple bills, illustrated look, HDR, lens flare, stock photography, crisp new bill, decorative table setting

---

### INSERT_LEGAL_PAD_BUDGETS
**Scene(s):** Scene 2 (late night, two-column budgets)
**Shot type:** INSERT / TOP-DOWN FLAT LAY
**Prompt:**
Top-down flat lay, slightly off-perpendicular angle, close-up on a yellow legal pad. The pad: college-rule, yellow, well-used. On the current page: two handwritten columns in blue ballpoint pen, slightly hurried but legible. Left column header: "−30% traffic" with a column of figures running down below — dollar figures, arithmetic, a subtotal underlined. Right column header: "−60% traffic" with a parallel set of numbers, starker, the subtotal circled. The handwriting: a working person's handwriting — clear but not decorative. Beside the pad: a blue ballpoint pen lying at a slight diagonal, cap off. The surface beneath: a kitchen table — wood laminate, slightly sticky, a coffee mug ring stain at the upper right corner of frame. The light: late-night quality — a single overhead practical, warm but tired, casting a slight shadow from the pen across the pad. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** computer or tablet, printed spreadsheet, illustrated look, HDR, lens flare, stock photography, clean white paper, decorative stationery, bright cheerful light, typed text

---

### INSERT_LEGAL_PAD_DEADLINE
**Scene(s):** Scene 5 (the back office phone call)
**Shot type:** INSERT / TOP-DOWN FLAT LAY
**Prompt:**
Top-down flat lay on a yellow legal pad, close. The page: "RoboRide — delivery partnership" written as a header in blue ballpoint, the letters slightly compressed, written fast. Below the header: a line underlined twice in ballpoint — "written terms — end of week" — the double underline pressed hard into the paper, the indentation visible. Below that: notes and partial sentences, some crossed out. At the bottom of the visible page: a number circled in ballpoint — "$10,508" — circled once, with enough pressure that the circle slightly deforms the paper. The paper: yellow, slightly worn at the edges, a small crease where it was folded. Desk lamp light (#F5C842 lamp color) falling in from the upper-left. One edge of a telephone visible at the upper right corner of frame. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** printed contract, computer screen, illustrated look, HDR, lens flare, stock photography, bright overall lighting, decorative desk items, multiple pens, cluttered surface

---

### INSERT_LEGAL_PAD_FINAL
**Scene(s):** Scene 6 (Betty's decision)
**Shot type:** INSERT / TOP-DOWN FLAT LAY
**Prompt:**
Top-down close on the bottom third of a yellow legal pad page. The upper portion of the page, visible at the top of frame: exhausted calculations — columns of numbers, arithmetic, figures crossed out with single ballpoint lines, some circled, some scribbled over. At the bottom of the page, alone, with breathing room above it: one number, handwritten large — "$1,972" — circled once, with a slightly unsteady hand. The circle is not dramatic — it is the circle of a person who has arrived somewhere they did not want to go. Pre-dawn light quality: the light from the distant kitchen pass-through, extremely dim, just enough to read the page — warm orange-amber at extremely low exposure. The surface beneath the pad: the diner booth table formica. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** clean paper, bright light, illustrated look, HDR, lens flare, stock photography, dramatic staging, multiple colors of ink, printed anything

---

### INSERT_NAPKIN_SKETCH
**Scene(s):** Scene 4 (Carlos and Betty)
**Shot type:** INSERT / MACRO
**Prompt:**
Close-up on a white paper diner napkin, slightly unfolded, lying on a laminate table surface. On the napkin: a rough kitchen layout sketch in blue ballpoint — walls indicated by simple lines, a rectangle labeled with an arrow and the handwritten text "warmer station," a circled number in the corner (implied measurement or cost). The drawing: quick, functional, the sketch of someone making a point not making art. The ballpoint line slightly smudged in one area where a hand dragged across it while the ink was wet. At the lower right edge of frame: the edge of a plate — white ceramic, a cold fried egg, partially visible, soft focus. The laminate table surface: wood-grain laminate, slightly warm. The light: the diner's overhead practical amber, warm, low — between rushes, the kitchen quiet. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** clean unfolded napkin, printed architectural drawing, illustrated look, HDR, lens flare, stock photography, multiple items cluttering frame, bright restaurant lighting

---

### INSERT_ROUTE_SHEET
**Scene(s):** Scenes 7, 8
**Shot type:** INSERT / WALL DETAIL
**Prompt:**
Medium-close on a handwritten route sheet taped to a kitchen wall with masking tape, the tape applied slightly crooked — one corner lifted slightly. The paper: standard white printer paper, faintly warm from the kitchen fluorescent. The sheet: three columns in blue ballpoint — name, address, order notes. Three rows visible clearly: "Miguel Hernandez — 4 Sycamore Ct / D. Okafor — 18 Mill Rd / Reyes family — 7 Birch Ave" with handwritten order details beside each. The handwriting: clear, working, the hand of someone who has done this kind of list many times. The kitchen wall surface: painted cinder block or tile, slightly greasy near the grill, pale institutional color. Fluorescent overhead light: green-white (#E8F0DC), even, flat. The tape at the upper corners: masking tape, slightly yellowed at the edges. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** printed route sheet, digital display, illustrated look, HDR, lens flare, stock photography, clean sterile kitchen wall, decorative border, bright clean white paper

---

### INSERT_DELIVERY_BAGS
**Scene(s):** Scenes 7, 8
**Shot type:** INSERT / STILL LIFE
**Prompt:**
Medium-close on four insulated delivery bags stacked on a stainless steel prep counter, pre-dawn. The bags: black with silver zipper trim, slightly worn at the handles, purchased for function. Stacked in two pairs, lids zipped closed, handles aligned. Beside them at the right of frame: a cardboard supply box torn open at the top — interior packing paper visible, the box slightly collapsed. The counter surface: stainless steel, reflecting the overhead fluorescent in a long horizontal highlight. Above and to the back: one small high kitchen window — dawn light entering, pale gray-blue (#C5CBD3 cast), cold, early, falling across the bags from above at a low angle. The daylight and the fluorescent overhead create two competing color temperatures. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** branded delivery bags (no logos), bright daylight, warm light, illustrated look, HDR, lens flare, stock photography, food visible, busy kitchen background

---

### INSERT_TOMMYS_BOOTH_EMPTY
**Scene(s):** Scene 8
**Shot type:** INSERT / BOOTH DETAIL
**Prompt:**
Medium shot on Tommy's window booth, empty. The booth seat: red vinyl, worn, the window beside it showing the overcast Auto Row exterior in soft focus beyond. On the table: one upturned coffee cup — white ceramic, placed upside-down on its saucer, which is the diner convention for "not in service." The cup is the only object on the table. No place setting, no napkin, no water glass. The table: formica, cleared, wiped down. The seat: empty. Mid-afternoon light from the window: overcast exterior diffuse, flat gray-white, entering from the right, casting no strong shadows. The light on the empty vinyl seat has the quality of waiting. Depth of field: the upturned coffee cup sharp at center, the window exterior soft, the far side of the booth soft. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** person in frame, place setting, food, dramatic light, illustrated look, HDR, lens flare, stock photography, retro styling, busy background

---

### INSERT_GRANT_FLYER
**Scene(s):** Scene 3
**Shot type:** INSERT / FLAT LAY
**Prompt:**
Close-up on a community flyer lying on a diner counter formica surface, partially unfolded — one fold still creased, the paper slightly crumpled at one corner where it was carried in a pocket or bag. The flyer: standard white printer paper, slightly warm from the diner interior light. The printed text visible and legible: "SMALL BUSINESS STABILIZATION GRANT" in a header, bold institutional typeface, slightly pixelated from a low-resolution printer. Below: "$5,000" in a larger weight. Below that: "Apply by [date]" — the date field printed as a placeholder. The paper: slightly crumpled, clearly handled. The formica counter surface beneath: worn, the color cream with faint pattern. The light: the diner's warm amber overhead practical (#C8954A) falling from above and slightly to one side, giving the white paper a faint amber cast and a soft shadow from the curled crumple at the corner. cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational
**Negative prompt:** glossy brochure, full-color printing, digital screen, illustrated look, HDR, lens flare, stock photography, perfectly flat paper, bright even lighting, decorative design elements

---

## NODE 4 — SHOT FRAMES
*Combinatorics: character + environment + shot type + scene mood*
*nanobanana prompts — one per named shot in the screenplay*

---

### SHOT 1A — WIDE — Dawn on Auto Row
**Scene:** "The Anchor" [0:00–0:18]
**Sprite assets:** ENV_AUTOROW_EXT, PROP_DINER_NEON_SIGN

Exterior wide shot, dawn, 2.39:1. Auto Row stretching left to right across the full frame. Center-left: the Auto Row Diner's exterior facade, its neon sign flickering then catching — warm red-orange against a near-black pre-dawn sky. The sign reads "AUTO ROW DINER" in hand-mounted neon tubing. Behind and beyond it, the strip unfolds: a car dealership with pennant flags hanging limp, a transmission shop with bay doors shut, a mechanic's garage, a gas station canopy. No people. No cars moving. The town exists first as infrastructure. Sky is deep blue-grey, horizon just beginning to separate from the earth. Foreground: empty asphalt parking lot, a few painted lines visible, a shopping cart left at the edge of frame. Depth of field wide — everything in focus from pavement to sky. Handheld, slight observational drift left. Lighting: near-dark, only the neon and one distant streetlamp contributing warmth. Mood: quiet expectancy, the world before it starts. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 1B — WIDE — The Full House
**Scene:** "The Anchor" [0:00–0:18]
**Sprite assets:** ENV_DINER_INT_FULL, BG_EXTRAS_WORKERS

Interior wide shot, noon, 2.39:1. The diner at capacity. Every booth taken — red vinyl benches packed with workers in union shirts, mechanics in coveralls, contractors, auto-shop guys. Counter stools all occupied. Coffee cups everywhere, plates mid-meal. Warm amber light from pendant fixtures over each booth, afternoon sun cutting through the front windows in long bars across the floor. Cream-colored walls, laminate tabletops, hand-lettered specials board on the back wall. The room hums — you feel it even in a still frame. Betty is visible at mid-ground, half-turned, coffee pot in hand, but not the subject here: the room is the subject. Foreground: empty aisle, a tray rest, motion blur of a passing arm. Depth of field moderate — booth details sharp, back wall slightly soft. Handheld, slight observational drift. Mood: abundance, community, a place that holds people. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 1C — MED — Betty Knows Everyone
**Scene:** "The Anchor" [0:00–0:18]
**Sprite assets:** SPRITE_BETTY_FRONT, ENV_DINER_INT_FULL

Medium shot, diner interior, noon. Betty (58, white woman, grey hair pulled back, wire-rim glasses, worn apron over plain work shirt) mid-stride between two booths. Coffee pot in her right hand, order pad in her left, pen tucked behind her ear. She's mid-sentence, turned toward a customer we don't see — her body language is easy, practiced, unhurried despite moving constantly. Her apron is slightly stained at the pocket edge from the day's work. Background: the busy diner, soft focus, warm amber blur of full booths. Foreground: a booth edge, a customer's elbow just entering frame. Lighting: warm ambient from overhead pendants, a window light adding soft fill from the left. Shot is chest-to-knee, slightly left of center. Camera locked or imperceptibly slow push — 3 seconds. Mood: competence, warmth, someone who belongs here completely. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 1D — CLOSE — The Daily Special
**Scene:** "The Anchor" [0:00–0:18]
**Sprite assets:** SPRITE_BETTY_HANDS, PROP_CORKBOARD, PROP_LUNCH_SPECIAL_CARD

Close shot, kitchen or service area, noon. Frame fills with Betty's hands and the corkboard surface. Her right hand — short nails, age spots, a thin silver ring on her middle finger — presses a handwritten index card to the corkboard, thumb pushing a thumbtack through the upper-left corner. The card reads the day's lunch special in her looping, confident cursive: "Meatloaf Plate — $7.50 / Turkey Club — $6.25" — no cross-outs, no corrections. Other cards visible around it, slightly overlapping, a history of specials. A few thumbtacks in the corkboard edge. Lighting: warm overhead kitchen light, slight green-white cast from fluorescents catching the stainless steel edge of the pass-through behind. Depth of field very shallow — hands and card sharp, corkboard edge soft, background a warm blur. Camera: locked. Mood: precision, habit, the daily act of maintaining a world. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 1E — MED — Same as Always
**Scene:** "The Anchor" [0:00–0:18]
**Sprite assets:** SPRITE_BETTY_FRONT, SPRITE_TOMMY_BOOTH, ENV_DINER_INT_FULL, PROP_COFFEE_POT

Medium two-shot, diner interior, noon. Tommy (50s, white man, broad build, union work shirt in navy or charcoal, thick hands wrapped around a coffee cup) is seated in the window booth, right side of frame. The window behind him shows Auto Row in daylight — cars parked outside the mechanic's bay, a sign, flat midwest sky. Betty stands at left of frame, already pouring coffee into his cup, order pad open in her other hand. She's written something before he's finished speaking. Tommy is looking up at her — not expectant, just comfortable. Betty is half-smiling, not performing it. The exchange has happened a thousand times. Lighting: warm amber from the booth pendant above them, window light behind Tommy creating a slight halo on his broad shoulders, slightly underexposed per the visual style. Camera: locked or imperceptible 3-second slow push. Mood: ritual, belonging, a relationship that doesn't need to explain itself. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 2A — MED — Wrong Quiet
**Scene:** "The Tip" [0:18–0:34]
**Sprite assets:** ENV_DINER_INT_FULL, BG_EXTRAS_SPARSE

Medium shot, lunch counter, midday. Three or four counter stools visible — only one occupied. A lone customer, a middle-aged man in a work jacket, both hands around a coffee cup, not eating, not looking up. The cup has gone cold — it's full, not steaming. The counter stretches empty to the right: clean place settings, upturned cups on saucers, a napkin dispenser, a pie case at the far end. The empty stools have an accusatory quality. Ambient noon light from the front windows — should be the day's best hour — falls flat on all this emptiness. The coffee maker gurgles softly behind the counter, serving no one. Betty is not in frame. This is the room noticing its own thinning. Lighting: daylight through windows, cooler than Scene 1 — the same room, slightly lower exposure. Camera: locked, or barely perceptible hold. Mood: something is already wrong, but quietly. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 2B — CLOSE — The Two-Dollar Goodbye
**Scene:** "The Tip" [0:18–0:34]
**Sprite assets:** PROP_TWO_DOLLAR_BILL, ENV_DINER_BOOTH_TOMMY

Close shot, Tommy's booth, just after he's left. The table is cleared — no plate, no cup, no napkin crumpled. Just the laminate surface and a single two-dollar bill lying flat, undramatic, near the center of the table. The bill is face-up, slightly worn at the fold, not new. No note. No weight on it. Afternoon light from the window beside the booth cuts across the table at a low angle, catching the raised printing of the bill's surface. The red vinyl of the bench seat is visible at the bottom of frame. Depth of field: shallow — the bill sharp, the seat and window behind it soft. Camera: locked, top-down or very slight angle, not a flat lay but close to it. Mood: the bill is eloquent. Something final in its flatness, its silence. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 2C — MED — She Picks It Up
**Scene:** "The Tip" [0:18–0:34]
**Sprite assets:** SPRITE_BETTY_FRONT, SPRITE_BETTY_HANDS, PROP_TWO_DOLLAR_BILL, ENV_DINER_BOOTH_TOMMY

Medium shot, Tommy's booth, continuous from 2B. Betty stands at the table, facing the camera at a slight angle. She's reached down and picked up the two-dollar bill — it's in both her hands now, held at waist height. She's not looking at us. She's looking down at the bill. Her apron is at the edges of frame. The booth behind her: empty, window light. Her body is still — she's not putting it in her apron pocket yet, not moving on. Just holding it. Her hands are in frame — the bill between her thumbs and first fingers, loose, not gripped. Lighting: window light from the booth falls on her face and the bill, the rest of her in slightly cooler ambient. Camera: locked or imperceptible push. This is the beat before recognition. Mood: a pause. The weight gathering before it registers. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 2D — CLOSE — Recognition
**Scene:** "The Tip" [0:18–0:34]
**Sprite assets:** SPRITE_BETTY_FACE

Close shot — face only, chest-to-crown. Betty looking down, then very slowly lifting her gaze to the middle distance. Not at us. Not at anything specific. She's looking at a thought. Her expression is not panic — this is more weathered than that. Her eyes behind the wire-rim glasses are steady. A slight tightening at the jaw. Something shifts — a recognition landing, not landing hard, landing with the weight of someone who has already half-known a thing and is only now letting herself know it completely. Her grey hair at the temples. The faint lines at the corners of her eyes. The apron strap at her shoulder, slightly twisted. Lighting: window light soft on one side of her face, the other side in cooler ambient shadow. Very shallow DOF — face sharp, everything else dissolving. Camera: locked. ECU holds on her face. Mood: the moment before the decision to act. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 2E — INSERT — The Math
**Scene:** "The Tip" [0:18–0:34]
**Sprite assets:** PROP_BETTY_NOTEBOOK, PROP_KITCHEN_TABLE

Insert shot — top-down or near top-down, fully locked. Betty's notebook open on the kitchen prep table. The page shows two handwritten columns in Betty's confident but slightly hurried cursive: on the left, "−30% traffic" with a column of figures below it; on the right, "−60% traffic" with a darker, more emphatic column of figures — underlined, some circled, one crossed out and rewritten. A pen rests diagonally across the bottom of the page, not capped. The notebook spiral binding visible at the left edge. Kitchen surface beneath: stainless steel, a few flour traces from earlier prep. One corner of the page is dog-eared. Lighting: fluorescent overhead — green-white, slightly clinical, the kitchen's character. No warmth. This is the work room at night. Depth of field: flat to moderate — the notebook fills the frame, edges slightly soft. Camera: locked, flat lay. Mood: evidence. The private arithmetic of someone calculating their own survival. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 3A — WIDE — Peak Hour, Wrong
**Scene:** "First Sighting" [0:34–0:52]
**Sprite assets:** ENV_DINER_INT_FULL, BG_EXTRAS_SPARSE

Wide shot, diner interior, noon. The room at half-capacity — but this is noon on a weekday on Auto Row. Half the booths empty. Clean place settings at unused tables, silverware rolled in paper napkins, coffee cups inverted. The booths that are occupied have one or two people, not the full press of Scene 1. The counter has gaps in it. The room's architecture is the same — warm amber, red vinyl, cream walls — but the exposure is slightly lower, slightly cooler than Scene 1. The absence of people makes the furniture more visible. The specials board on the back wall. Betty moving at the far end of frame, barely a figure. Handheld, slight observational drift. Mood: the same room, diminished. The ratio of empty to full has flipped and you can feel it. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 3B — POV — The AV Passes
**Scene:** "First Sighting" [0:34–0:52]
**Sprite assets:** ENV_DINER_WINDOW_POV, PROP_AV_VEHICLE

POV shot — Betty's eye level, through the diner's front window. The window glass occupies the lower third of the frame, its edge and a smudge or two visible — we are behind it, inside the diner. Through the glass: Auto Row. Midground: the street. A white autonomous vehicle — clean, low, no visible driver, company branding in restrained sans-serif on the side panel — glides from left to right across the frame, silent. It doesn't slow. It doesn't stop. It doesn't acknowledge the diner. The dealership lot is visible behind it. No one waves. No one's inside. It passes with institutional efficiency and is gone. The street returns to its previous state. Slightly unsteady — handheld, eye height, a very small amount of body sway. The AV itself is in sharp focus as it passes, the window edge and street slightly soft. Mood: something new has entered this world and it does not belong to the people here. It is indifferent in a new way. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 3C — CLOSE — Hands Stop
**Scene:** "First Sighting" [0:34–0:52]
**Sprite assets:** SPRITE_BETTY_HANDS, PROP_DISH_TOWEL

Close shot — Betty's hands, mid-torso, chest to waist. She was drying a dish or wiping the counter with a dish towel — the motion has stopped. The towel is held loosely in both hands, slightly bunched. Her hands are still. The motion has simply ended, the way attention drains out of a body when something outside the window catches it. The towel hangs between her hands. Her apron edge is visible. Behind her: the soft amber blur of the diner interior. Depth of field shallow — hands and towel sharp, everything else dissolving. Camera: locked. The stillness of the hands is the point. Mood: the body registering something before the mind has language for it. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 3D — MED — The Grant
**Scene:** "First Sighting" [0:34–0:52]
**Sprite assets:** SPRITE_MARIA_SANTOS, SPRITE_BETTY_FRONT, ENV_DINER_CORNER_BOOTH, PROP_GRANT_FLYER

Medium shot, corner booth, midday. Maria Santos (early 40s, Latina woman, blazer over a practical blouse, clipboard tucked under her arm) seated at the corner booth. Betty stands at the edge of the table, still in working mode — one hand resting on the booth back. Maria is sliding a folded flyer across the laminate tabletop toward Betty, her hand still on it. The flyer is white, folded in thirds, official. Betty's eyes are on it — not picked up yet, not reached for yet. Maria is looking at Betty, not the flyer. The booth behind them: window light, the street outside. Lighting: warm amber booth pendant, slightly underexposed. Camera: locked, slow push 3–4 seconds. Two-shot: Maria left, Betty right, flyer between them. Mood: an offer being made carefully. Someone who knows the person she's helping. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 3E — CLOSE — Reading the Flyer
**Scene:** "First Sighting" [0:34–0:52]
**Sprite assets:** SPRITE_BETTY_HANDS, PROP_GRANT_FLYER

Close shot — the flyer in Betty's hands, with Betty's face soft above it. The flyer is unfolded, held in both hands, a slight bend where it was folded. Official text visible: "Small Business Stabilization Grant — $5,000" — header text legible, body text soft. Betty's eyes track left to right across the page. Her face above: slightly soft, reading focus, glasses helping her parse the small print. Her hands — familiar from before — steady on the paper. Lighting: warm from the booth pendant above, the white of the flyer bouncing light up onto her chin and glasses. Camera: locked. Rack focus from the flyer text (sharp) to Betty's face (soft), or hold both in moderate DOF. Mood: information arriving. The careful reading of someone who knows the weight of fine print. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 4A — WIDE — The Emptiest Noon
**Scene:** "The Mechanic's Lunch" [0:52–1:10]
**Sprite assets:** ENV_DINER_INT_FULL, BG_EXTRAS_MINIMAL

Wide shot, diner interior, midday. The room at its most depleted — two occupied tables in a room built for twenty. The occupied tables: at left, Betty and Carlos (not yet individuated at this distance). At right, a couple eating silently. Every other booth and stool: empty, clean, set and waiting. The visual rhythm of empty places — upturned cups, rolled silverware, folded napkins — becomes dominant. The room's warmth is still in the amber and vinyl and cream, but it is operating below capacity and the light seems to know it. Sun through the front windows makes hard rectangles on the floor between unoccupied booths. Handheld, slight drift right. Mood: abundance that has been withdrawn. A room set for a party that hasn't come. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 4B — MED — Eggs Going Cold
**Scene:** "The Mechanic's Lunch" [0:52–1:10]
**Sprite assets:** SPRITE_BETTY_FRONT, SPRITE_CARLOS_RUIZ, ENV_DINER_LAMINATE_TABLE, PROP_LEGAL_PAD, PROP_NAPKIN_SKETCH

Medium two-shot, laminate table, midday. Carlos Ruiz (40s, Latino man, mechanic's shirt — name patch on chest — work-worn hands, dark hair, thinker's stillness when he's talking seriously) sits across from Betty at a laminate-topped table. His plate of eggs is to one side, barely touched, going cold. Between them: Betty's legal pad, open, pen beside it. Carlos is sketching on a paper napkin — a rough diagram of a kitchen layout with directional arrows, a prep line sketch, a circled number. He's explaining as he draws. Betty watches the sketch. His work-worn hands move the pen deliberately. Lighting: overhead fluorescent — this table is in the kitchen-adjacent zone, greener, cooler than the amber booths. A window at far left, daylight flat. Camera: locked or slow push. Mood: two working people doing math on a napkin. The eggs getting cold is the cost of the conversation. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 4C — CLOSE — Fast Handwriting
**Scene:** "The Mechanic's Lunch" [0:52–1:10]
**Sprite assets:** SPRITE_BETTY_HANDS, PROP_LEGAL_PAD

Close shot — the legal pad and Betty's hand, from a slightly elevated angle. She is writing. The pen moves quickly, deliberately — not neat this time, functional. Numbers, words, a column taking shape. We can see enough to understand structure: costs, figures, something being organized under pressure of time and information. Her hand moves across the page without hesitation. The legal pad is yellow, lines, slightly curled at the corner. Her other hand steadies the pad at the top. The table surface around it: the edge of the napkin sketch Carlos made, still in the corner of the frame. Lighting: cooler fluorescent overhead — this is the work light, not the amber warmth. Camera: locked or very slight angle. Depth of field: the writing hand and current line sharp, the rest of the pad and background soft. Mood: thinking made physical. The speed of her hand means she already knows the structure — she's recording, not discovering. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 4D — MED — The Council Passed
**Scene:** "The Mechanic's Lunch" [0:52–1:10]
**Sprite assets:** SPRITE_LISA_FREEMAN, SPRITE_BETTY_FRONT, ENV_DINER_INT_FULL

Medium shot, diner interior, midday. Lisa Freeman (35, Black woman, natural hair, practical jacket, always marking or noting something) has just entered through the front door — she's mid-stride, not slowed down, still in arrival mode. Across the room, Betty is at the laminate table with Carlos. Lisa has caught Betty's eye across the empty room — the distance between the door and the table is dramatic in a half-empty diner. Lisa is in the left third of frame, door still swinging behind her. Betty visible in the right background, smaller, at the table. The empty booths between them make the room feel like a stage. Lighting: daylight burst from the door Lisa opened, cooler, behind her — she's backlit slightly — contrasting with the amber interior. Camera: locked or very slow pull back to hold both women in frame. Mood: news arriving. The room too quiet to not hear it. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 4E — CLOSE — Back to the Legal Pad
**Scene:** "The Mechanic's Lunch" [0:52–1:10]
**Sprite assets:** SPRITE_BETTY_FACE, PROP_LEGAL_PAD

Close shot — Betty's face, then the legal pad. Betty has heard Lisa's news. Her face shows it — a very small response, something moving through her eyes, not celebration, closer to a held breath releasing slightly. Then she looks back down at the legal pad. Her eyes drop and her focus re-enters the work. Her hand finds the pen. Her jaw is set. She's not done. The news is acknowledged and filed. Frame: face dominant, legal pad edge at the bottom, pen in her hand. Lighting: the mixed cool-warm of the table zone, slightly green from overhead. Camera: locked. Mood: the refusal to perform relief. The work continues. This is who she is. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 5A — MED — The Back Office Call
**Scene:** "The Deadline" [1:10–1:24]
**Sprite assets:** SPRITE_BETTY_FRONT, ENV_BACK_OFFICE, PROP_LEGAL_PAD, PROP_DESK_PHONE

Medium shot, back office, daytime. Betty stands at a small desk (she never sits here — the shot should convey this: she's too upright, too forward-leaning, a person standing at a desk she thinks of as temporary). Phone to her left ear. Legal pad open on the desk in front of her, pen in her right hand. The office: flat cool-white walls, one desk lamp (warm, low) fighting against the fluorescent overhead that has been switched off — the desk lamp is the primary source. A few papers pinned to the wall. A framed business license, slightly askew. Shelving with binders. The door behind her, slightly ajar. She is listening, not speaking. Her posture: controlled, contained — the posture of someone managing a phone call with a person who has more institutional power. Camera: locked or very slow push. Mood: a negotiation. The room has no warmth — this is PRESSURE. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 5B — CLOSE — Written Terms
**Scene:** "The Deadline" [1:10–1:24]
**Sprite assets:** PROP_LEGAL_PAD

Close shot — legal pad, insert quality. The page reads, in Betty's hand: "RoboRide — delivery partnership." Below it, underlined twice with heavy ballpoint pressure: "written terms — end of week." The double underlining is emphatic, the pen almost cutting into the paper. Around these lines: other notes, crossed-out figures, a phone number. The pad is on the desk — desk lamp light falling across it from the left, creating a warm shadow on the right half of the page. The pen is in frame, held above the underlined phrase — we're mid-note. Camera: fully locked, slightly overhead angle. The emphasis of the underlines is the emotional content of the shot. Mood: a line being drawn. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 5C — MED (THROUGH PASS-THROUGH) — The Empty Room from the Kitchen
**Scene:** "The Deadline" [1:10–1:24]
**Sprite assets:** ENV_DINER_INT_EMPTY, ENV_KITCHEN_PASS_THROUGH

Medium shot through the kitchen pass-through window — we are in the kitchen, looking out through the rectangular opening into the dining room beyond. The pass-through frame (stainless steel edge, a heat lamp unlit above it) is in the foreground, its edges bounding the view. Through it: the dining room in afternoon light. Every stool is upturned on every table. The chairs are legs-up. The amber warmth of the room is present but doing nothing — light falling on empty furniture. No one there. The afternoon sun makes long shadows from the upturned stool legs. This is what the diner looks like when it isn't serving. Camera: locked, slightly below the pass-through level looking through it. Mood: absence. What it costs to close early. What she's fighting to not lose. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 5D — CLOSE — The Demand
**Scene:** "The Deadline" [1:10–1:24]
**Sprite assets:** SPRITE_BETTY_FACE

Close shot — Betty's face, phone to ear. She has been listening. Now she speaks. Her jaw is set. Her eyes are direct, looking at a fixed point across the room — not looking at anything, looking at the conversation. Her expression: not anger, something harder and calmer than anger. Certainty. The wire-rim glasses. The grey hair. The apron strap. The desk lamp light on one side of her face, the flat white office wall behind her. Her mouth is forming the words — we should feel: "I need written terms by end of this week. That's not a request." Not a shout, not a plea. A statement by someone who has decided. Camera: locked. ECU holding on her face. Mood: the moment someone stops asking and starts requiring. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 6A — WIDE — Pre-Dawn Decision Room
**Scene:** "The Decision" [1:24–1:40]
**Sprite assets:** ENV_DINER_INT_EMPTY, ENV_KITCHEN_GLOW

Wide shot, diner interior, pre-dawn. Near-black. The dining room before sunrise — the front windows show the street in darkness. All the chairs still up on the tables. The room is a silhouette of itself. The only significant light source: the warm rectangle of the kitchen pass-through, glowing amber from the kitchen lights beyond — a hearth-like quality in the dark room. One booth is inhabited: Betty, small at a table, a folder and papers spread in front of her, backlit by her proximity to the kitchen glow. The room's architecture is visible as dark shapes: booth backs, chair legs overhead, the curve of the counter. This is the private hour. No one can see in. No one is watching. Handheld, very slight drift — observational. Mood: solitude and decision. The warm glow is the only thing keeping the dark at bay. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 6B — MED — The Folder
**Scene:** "The Decision" [1:24–1:40]
**Sprite assets:** SPRITE_BETTY_FRONT, PROP_LOAN_FOLDER, PROP_RIDERIDE_CONTRACT, PROP_BUSINESS_CARD, ENV_DINER_BOOTH

Medium shot, diner booth, pre-dawn. Betty alone at the booth table. The booth pendant light is on — a single warm circle in the dark dining room. On the table in front of her: a folder spread open. Contents fanned: loan papers (official, multi-page, small print), a RoboRide partnership agreement (clean, corporate header, several pages), a business card. Her hands are on the table but not touching the papers — they're resting, both hands flat, looking at the spread. She's been here a while. Her apron is still on. Hair slightly less collected than earlier in the film. The table surface: coffee cup ring, a pen. The chair backs of neighboring empty tables in soft background. Camera: locked or very slow push. Mood: a reckoning. All the options on the table, literally. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 6C — INSERT — The Credit Union Card
**Scene:** "The Decision" [1:24–1:40]
**Sprite assets:** PROP_BUSINESS_CARD_KEVIN

Insert shot — fully locked, close to flat-lay but at a slight angle to catch the texture of the handwriting. Kevin O'Brien's business card, face up on the table surface. Front face: navy type on cream stock — "Community First Credit Union / Kevin O'Brien" — profession below, phone number below that. The card is turned over: on the back, in blue ballpoint handwriting — slightly pressed, real handwriting — "$12K — approved." Just that. No other text. The pen stroke of the dollar sign, the dash, the word. The card sits on the folder surface, a corner of loan paper visible at the edge of frame. Booth pendant light from above, warm, slight shadow at the card's edge. Camera: locked. Mood: the lifeline. The number written in someone's hand means a human decision was made. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 6D — INSERT — The Last Number
**Scene:** "The Decision" [1:24–1:40]
**Sprite assets:** PROP_LEGAL_PAD

Insert shot — legal pad, fully locked. The bottom of a page. Above: dense columns of numbers, crossed-out figures, underlined totals — the full arithmetic of the film's middle section compressed onto this page. And then, at the bottom, separated by a gap, alone: "$1,972" — in Betty's hand, slightly larger than the surrounding figures, nothing else on that line, nothing below it. This is what's left. Or what's needed. Or what's possible. The page does not explain itself. The desk lamp catches the paper from the left. One corner of the credit union card is visible at the frame's lower right edge. Camera: locked. Mood: the final number. All roads lead here. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 6E — CLOSE — She Closes the Folder
**Scene:** "The Decision" [1:24–1:40]
**Sprite assets:** SPRITE_BETTY_HANDS, PROP_LOAN_FOLDER

Close shot — Betty's hands on the spread folder. She has made her decision. Her hands move to the edges of the folder and close it — not slamming it, not ceremonially, just closing it. The papers gather underneath. The folder becomes a folder again, closed, finished. Her hands rest a moment on the closed folder surface after — both palms flat on the cover. Then still. The table surface around: coffee ring, pen. The pendant light from above, warm, on her hands. Camera: locked. Depth of field shallow — her hands and the folder sharp, everything else soft. Mood: the decision made. Not relief — completion. Something is over, something has begun. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 6F — CLOSE — The Signature
**Scene:** "The Decision" [1:24–1:40]
**Sprite assets:** SPRITE_BETTY_HANDS, PROP_LOAN_PAPERS

Close shot — Betty's hand picking up the pen from the table, opening the folder again, and signing. We see only the hand and the signature line — the specific document is not the point; the pen meeting the paper is. Her signature: a single confident motion, two or three strokes, her name. Not slow or ceremonial — practiced, the way someone signs who has been signing their name for thirty years on this building's lease, on payroll sheets, on health inspections. The signature is made. The pen lifts. The paper. The hand. The pendant light. Camera: locked. Depth of field: the pen tip and signature line sharp, everything else dissolving. Mood: the irrevocable act. Clean, unembellished. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 7A — CLOSE — The Box
**Scene:** "First Order" [1:40–1:51]
**Sprite assets:** PROP_CARDBOARD_BOX, PROP_DELIVERY_BAGS, ENV_KITCHEN_PREP_COUNTER

Close shot — the prep counter surface. A cardboard shipping box in the process of being torn open — flaps bent back, packing tape cut, the box open and angled. Inside: folded insulated delivery bags in black, stacked neatly. Betty's hands are pulling the first bag from the box, not yet visible fully, the action caught mid-pull. The bags are new — clean, their zippers shiny, a logo on the side (generic enough to not be branded). The counter surface: stainless steel, worn in the right places. The box flaps, the cut tape, the neat stacking inside — all speak of preparation, a new chapter starting with its own new objects. Lighting: fluorescent kitchen overhead — green-white. Camera: locked or very slight overhead angle. Mood: new materials for a new operation. The tools of a pivot. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 7B — MED — The Route Sheet Goes Up
**Scene:** "First Order" [1:40–1:51]
**Sprite assets:** SPRITE_BETTY_FRONT, PROP_ROUTE_SHEET, ENV_KITCHEN_PASS_THROUGH

Medium shot, kitchen, Betty at the wall above the pass-through. She's taping a handwritten route sheet to the wall — placing it, pressing the tape at the top corner, smoothing the paper flat with her palm from top to bottom. The route sheet is white paper, handwritten, names and addresses in her clear cursive. The pass-through opening is below it, to the empty dining room beyond (dark, chairs up). The gesture: hand smoothing the page flat — the same gesture as pinning the lunch special in Shot 1D. History is visible in the repetition. Her back is slightly to us, face in three-quarter profile. Lighting: kitchen fluorescent from above. Camera: locked or very slow push. Mood: the new order. The diner's purpose reassigning itself. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 7C — INSERT — The Route Sheet
**Scene:** "First Order" [1:40–1:51]
**Sprite assets:** PROP_ROUTE_SHEET

Insert shot — the route sheet, flat on the wall, fully locked. The handwritten page fills the frame. Clear cursive in black ink, readable: "Miguel Hernandez — 4 Sycamore Ct" on the first line, "D. Okafor — 18 Mill Rd" below, "Reyes family — 7 Birch Ave" below that. Perhaps a time notation beside each. The tape at the upper corners is visible — two small rectangles of clear tape. The wall behind is the kitchen wall tile or painted surface, slightly rough. Fluorescent light from above, even, flat. Camera: locked. The names are the point — real people, real addresses, a real route. Mood: the diner's first new customer list in a different form. These are people who will be fed. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 7D — WIDE — Betty at the Prep Line, Dark Room Behind
**Scene:** "First Order" [1:40–1:51]
**Sprite assets:** SPRITE_BETTY_FRONT, ENV_KITCHEN_PREP_LINE, ENV_DINER_INT_EMPTY

Wide shot, kitchen/dining room. Betty at the prep line, front and center, working — plating, wrapping, stacking containers. Her movement is focused and economical. Behind her: the pass-through glass, and beyond it, visible through the opening and the glass, the dark still dining room — chairs up, no one there, no lights except what leaks from the kitchen. The contrast is complete: the kitchen alive, lit fluorescent, in motion; the dining room dark, still, furniture inverted. The two spaces visible in one frame. Betty is the hinge between them. Camera: handheld, slight observational drift or locked. Mood: the diner is not dead. It has changed. The work continues in the half that still functions. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 8A — ECU — The Name on the Glass
**Scene:** "Still Standing" [1:51–2:00]
**Sprite assets:** ENV_DINER_EXT_DOOR, PROP_DINER_LETTERING

Extreme close-up — exterior of the diner's front door, from outside looking in. The shot is on the painted lettering: "AUTO ROW DINER" in gold-leaf-style or hand-painted white letters on the glass, slightly worn at edges, a few chips in the paint. Through the letters and the glass, slightly distorted by it: the interior. No customers. But the kitchen lights are on in the distance — a warm glow visible through the pass-through at the far end. Movement in there: a shape, Betty, small and blurred through the glass and the letters, working. The exterior light is mid-morning or mid-afternoon — flat, overcast. The lettering is the foreground subject; the running kitchen behind is the background. Camera: locked. ECU. Mood: the place still exists. The name is still on the door. What's behind it has changed, but the name holds. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 8B — MED — Lisa at the Hostess Stand
**Scene:** "Still Standing" [1:51–2:00]
**Sprite assets:** SPRITE_LISA_FREEMAN, PROP_DELIVERY_COORDINATION_SHEET, ENV_DINER_HOSTESS_STAND

Medium shot, old hostess stand at the diner entrance. Lisa Freeman (35, Black woman, natural hair, practical jacket) stands behind the stand — but this isn't welcoming guests anymore. The hostess stand now has a delivery coordination sheet spread across its surface: a grid, names, times, addresses, a marker in her hand. Lisa marks something on the sheet, checks a line, makes a notation. Her clipboard is beside her. The stand's purpose has been repurposed without announcement. Behind her: the front windows, daylight flat through overcast. The dining room, still no guests. Lisa works with focus — not performing, just doing. Camera: locked or very slow push. Mood: adaptation. Old things given new purposes. The stand is still standing. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 8C — MED — Betty Works the Line
**Scene:** "Still Standing" [1:51–2:00]
**Sprite assets:** SPRITE_BETTY_FRONT, ENV_KITCHEN_PREP_LINE

Medium shot, kitchen prep line. Betty working alone — moving efficiently through the line, plating or packing, her body in the practiced geometry of this space. She has worked this kitchen for years: her movements are the kitchen's movements, she doesn't look for anything, her hands know where everything is. She is alone but not lonely. The kitchen hums: burners, refrigerator, exhaust. Fluorescent green-white overhead. Her apron, her sleeves pushed back, her hands the whole story. Camera: locked or very slight push. Chest-to-hip, the prep line at frame bottom. Mood: she is the kitchen. The kitchen is running. That's everything. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 8D — CLOSE — Tommy's Booth, Empty
**Scene:** "Still Standing" [1:51–2:00]
**Sprite assets:** ENV_DINER_BOOTH_TOMMY, PROP_UPTURNED_COFFEE_CUP

Close shot — Tommy's old booth, the window seat, mid-afternoon. The booth is empty. The table cleared. At the place where Tommy would sit — where his hand would be, where his coffee cup would be — there is an upturned coffee cup on a saucer. No order. No coffee. Just the cup turned over, the way the diner turns cups when a table is not in service. Mid-afternoon light from the window beside the booth: flat, coming in at a low-ish angle, catching the white ceramic of the inverted cup, the edge of the red vinyl bench. Background: the window, Auto Row outside, soft. The cup is in the center of the frame, on the table, alone. Camera: locked. Shallow DOF — the cup sharp, the bench and window soft. Mood: the absence of a specific person. Not general loss — Tommy's absence. The cup where his cup was. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

### SHOT 8E — CLOSE — Betty's Face at the End
**Scene:** "Still Standing" [1:51–2:00]
**Sprite assets:** SPRITE_BETTY_FACE

Close shot — ECU — Betty's face. The final image of the film. She is in the kitchen or at the pass-through edge, a moment of stillness in the working day. Her face: tired — genuinely so, not performed exhaustion, the tiredness of someone who has been doing real work for a long time, today and every day before it. And intact — not broken, not defeated, not triumphant. Present. Her eyes are quiet. The wire-rim glasses. The grey hair. Lines at the corners of her eyes and mouth. The apron strap. Kitchen light behind her — fluorescent, but the shot finds warmth in her face that the room doesn't offer. The camera rests on her. She doesn't know we're watching. Mood: this is what endurance looks like from the inside. Not a speech. Just a face that has kept going. `cinematic 16mm film grain, 2.39:1 anamorphic letterbox, American realist drama, Nomadland-style naturalistic lighting, muted warm palette, shallow depth of field, photographic not illustrated, quiet and observational`

---

## NODE 5 — KLING VIDEO PROMPTS
*Motion prompts built from shot frames — one per shot*
*Camera movement, subject action, duration, mood*

---

### KLING 1A — Dawn on Auto Row
**Source:** SHOT 1A | **Duration:** 4s
**Start:** Pre-dawn exterior, Auto Row fully dark. Neon sign unlit. Everything still. Asphalt catches no light.
**Action:** The neon sign clicks on — a stutter, then it holds. Warm red-orange pools across the parking lot facade. The strip behind it remains indifferent: dealership flags lift once in a small wind, then settle.
**Camera:** Very slow handheld drift leftward, barely perceptible — the camera observing without announcing itself.
**End:** Sign fully lit, the diner readable against the sky, Auto Row stretching behind it into pre-dawn grey.
**Prompt:** Pre-dawn exterior, American midwest Auto Row, wide shot. A diner neon sign flickers on in near-darkness, warm red-orange light pooling across empty asphalt. Dealerships, transmission shops, mechanic's bays visible behind it, all closed. Very slow handheld observational drift left. No people, no moving cars. Sign catches and holds. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 1B — The Full House
**Source:** SHOT 1B | **Duration:** 4s
**Start:** Full dining room, noon. Every seat taken. Warm amber light. Steam rising from coffee cups. Ambient motion — people eating, talking, reaching.
**Action:** The camera drifts slowly through the room, barely moving, observing. Workers eat. A hand reaches for a coffee cup. Someone laughs at the counter, silently. Betty moves through mid-ground, a trace of her path visible.
**Camera:** Slow handheld observational drift forward and slightly right, moving through the space at human walking pace but restrained — more drift than walk.
**End:** Frame settles on the counter — stools full, coffee cups, the everyday ritual of the lunch hour in full expression.
**Prompt:** Interior diner, full lunch rush, noon. Every booth and counter stool occupied by blue-collar workers — union shirts, coveralls, steel-toed boots. Warm amber pendant light, red vinyl booths, cream walls. Slow observational handheld drift forward through the room. Steam, coffee cups, mid-meal plates everywhere. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 1C — Betty Knows Everyone
**Source:** SHOT 1C | **Duration:** 3s
**Start:** Betty mid-frame, coffee pot in one hand, order pad in other, mid-stride between booths.
**Action:** She moves a step forward, leans slightly toward a customer off-frame right, writes something on the pad without looking down. The coffee pot stays level — second nature. She smiles briefly, turns back toward the counter.
**Camera:** Locked with an almost imperceptible 3-second slow push toward her — the camera paying attention.
**End:** Betty slightly larger in frame, turning away, already moving to the next table.
**Prompt:** Medium shot, diner interior noon, busy background soft-focus. Betty, 58, white woman, grey hair, wire-rim glasses, worn apron, moves between booths with coffee pot and order pad. She writes without looking down, speaks to off-frame customer, keeps moving. Almost imperceptible slow camera push toward her. Warm amber pendant light, red vinyl booths. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 1D — The Daily Special
**Source:** SHOT 1D | **Duration:** 2.5s
**Start:** Betty's hands holding the index card, positioned against the corkboard. The card is visible — handwritten lunch special in looping cursive.
**Action:** Her thumb pushes the thumbtack in. The card settles flush against the board. Her hand smooths the card once, then withdraws from frame.
**Camera:** Fully locked. No movement.
**End:** The pinned card alone on the corkboard, hands withdrawn, other old cards visible around it.
**Prompt:** Extreme close shot, locked camera. Aged woman's hands — short nails, silver ring — pressing a handwritten index card onto a cork bulletin board, pushing a thumbtack through. Card reads lunch specials in confident looping cursive. Hand smooths it, withdraws. Other old cards visible at edges. Warm overhead kitchen light, stainless steel edge behind. Very shallow DOF. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 1E — Same as Always
**Source:** SHOT 1E | **Duration:** 4s
**Start:** Tommy seated in window booth, hands on coffee cup. Betty standing at frame left, coffee pot ready. Both still.
**Action:** Betty pours coffee into Tommy's cup without being asked. Tommy speaks — mouth moves slightly: "Same as always, Betty." Betty writes on the order pad, doesn't look up: "I know, Tommy." The pour finishes. Betty's hand withdraws the pot.
**Camera:** Locked with an almost imperceptible slow push — the camera leaning in on the ritual.
**End:** Tommy looking down at his coffee cup, Betty already half-turned to move to the next table, pad snapping shut.
**Prompt:** Medium two-shot, diner window booth. Broad-built man in union work shirt sits with coffee cup, woman in apron and wire-rim glasses stands pouring coffee before he asks. She writes on an order pad without looking up. Both comfortable, unsurprised — this exchange has happened a thousand times. Window behind man shows Auto Row exterior. Warm amber pendant light, slight underexposure. Nearly locked camera, barely perceptible push. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 2A — Wrong Quiet
**Source:** SHOT 2A | **Duration:** 3s
**Start:** Lunch counter, midday. Most stools empty. One customer sits with a full, cold coffee cup — not drinking, not moving. Empty place settings stretch left and right.
**Action:** Nothing dramatic happens. The customer shifts his hands slightly on the cup. A coffee maker light blinks in the background. The room stays quiet. An empty stool at frame right rocks almost imperceptibly from some prior moment.
**Camera:** Locked. Holding on the emptiness.
**End:** Same frame. The customer hasn't moved. The emptiness hasn't resolved.
**Prompt:** Medium shot, diner lunch counter, midday. One customer sits alone at an otherwise empty counter, hands around a cold full coffee cup, not drinking. Empty stools, clean unused place settings. Noon light from windows, but the room feels wrong — too quiet for the hour. Coffee maker visible behind counter. Locked camera, no movement. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 2B — The Two-Dollar Goodbye
**Source:** SHOT 2B | **Duration:** 2.5s
**Start:** The two-dollar bill flat on the cleared booth table. Afternoon light from the window. Nothing else.
**Action:** Nothing moves. The light shifts almost imperceptibly as a cloud passes outside — the bill brightens slightly, then settles. That's all.
**Camera:** Locked. The camera rests on it the way the bill is resting on the table.
**End:** Same. The bill alone. The booth empty. The light unchanged.
**Prompt:** Close shot, locked camera. A single worn two-dollar bill lying flat on a cleared diner booth table. No plate, no cup, no note. Afternoon window light cuts across the laminate surface, catching the bill's raised print. Red vinyl bench visible at frame bottom. Shallow DOF. The bill is the only subject. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 2C — She Picks It Up
**Source:** SHOT 2C | **Duration:** 3.5s
**Start:** Betty standing at the cleared booth, reaching toward the table. The two-dollar bill visible on the laminate.
**Action:** She picks up the bill in both hands, holds it at waist height. Stops. Doesn't move on. Looks down at it for a held beat — two, three seconds. Her thumbs move very slightly, the bill shifting between her fingers.
**Camera:** Locked with an almost imperceptible slow push toward her hands.
**End:** Betty still holding the bill. The pause is the shot.
**Prompt:** Medium shot, diner booth. Woman in apron, 58, wire-rim glasses, stands at a cleared table holding a two-dollar bill in both hands at waist height. She has stopped moving. She looks down at the bill. Body language: still, contained. Window light falls on her hands and face. Barely perceptible slow push toward her. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 2D — Recognition
**Source:** SHOT 2D | **Duration:** 3s
**Start:** Betty's face, close. Looking down at the two-dollar bill held below frame.
**Action:** Her gaze lifts slowly to the middle distance — not at the camera, not at anything we can see. Her jaw tightens almost invisibly. Her eyes settle. Something has registered. She doesn't speak.
**Camera:** Locked. No movement. The face is everything.
**End:** Betty's face, gaze settled in the middle distance. Still. The recognition complete but unspoken.
**Prompt:** Close shot, locked camera. Woman's face, 58, wire-rim glasses, grey hair. She looks down, then slowly raises her gaze to the middle distance — not at camera. Her jaw tightens slightly. A recognition lands in her expression — not panic, something older and more settled. Soft window light on one side of her face, cool shadow on the other. Very shallow DOF. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 2E — The Math
**Source:** SHOT 2E | **Duration:** 2.5s
**Start:** Notebook open on stainless steel prep table. Two handwritten columns visible: "−30% traffic" left, "−60% traffic" right. Pen lying across the page.
**Action:** Nothing in frame moves. A fluorescent light above flickers once very slightly — imperceptible, almost subliminal — then holds. The notebook stays still. The numbers stay there.
**Camera:** Locked. Top-down. No movement.
**End:** The notebook page. The math. The pen. The flicker has passed.
**Prompt:** Insert shot, locked camera, near top-down. Open notebook on stainless steel kitchen prep table. Two handwritten columns: "−30% traffic" and "−60% traffic" with figures below, some circled, one crossed out. Pen resting diagonally across page. Fluorescent green-white overhead light. No warmth. Night in a working kitchen. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 3A — Peak Hour, Wrong
**Source:** SHOT 3A | **Duration:** 4s
**Start:** Wide diner interior, noon. Half the booths empty. A few scattered customers. Clean unused place settings.
**Action:** The camera drifts slowly left, taking in the room. A customer at one booth stirs their coffee. An empty booth at center frame stays empty. Betty passes at the far edge — small, purposeful. The room doesn't fill.
**Camera:** Slow handheld observational drift left, slight tilt down then settling.
**End:** The camera settles on the emptiest section of the dining room — an aisle of unoccupied booths in the noon light.
**Prompt:** Wide shot, diner interior, noon. Half the booths empty at peak hour. Scattered customers — one or two per occupied booth. Clean unused place settings, inverted coffee cups. Same warm amber room as before, but lower exposure, cooler. Small figure of woman in apron visible at far end. Slow handheld observational drift left. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 3B — The AV Passes
**Source:** SHOT 3B | **Duration:** 3.5s
**Start:** POV through diner front window. Auto Row street visible through smudged glass. Street empty. Dealership behind.
**Action:** A white autonomous vehicle glides smoothly from left to right across the frame — no driver visible, company logo on the side, no sound implied. It does not slow. It does not stop. It passes the diner and exits frame right. The street returns to empty.
**Camera:** Slightly unsteady handheld at eye height. A trace of body sway — someone standing still but alive, watching.
**End:** The street empty again. The AV gone. Auto Row the same as before, but something has happened.
**Prompt:** POV shot through diner window, eye height, slightly unsteady handheld. Auto Row street visible through smudged glass. A white autonomous vehicle glides silently left to right through frame — no driver, clean corporate branding, no acknowledgment. It passes the diner without slowing and exits frame. Street returns to empty. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 3C — Hands Stop
**Source:** SHOT 3C | **Duration:** 2.5s
**Start:** Betty's hands actively working — wiping or drying with a dish towel, a small motion.
**Action:** The hands stop. The motion drains out of them. The towel goes slack between her fingers. She holds it — not gripping, not releasing. Still.
**Camera:** Locked. No movement.
**End:** Hands still. Towel hanging. The pause is held.
**Prompt:** Close shot, locked camera. Woman's hands in foreground holding a dish towel that has just stopped moving. Hands still, towel loosely bunched. Apron edge visible. Warm amber diner blur behind. Shallow DOF. The cessation of movement is the event. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 3D — The Grant
**Source:** SHOT 3D | **Duration:** 4s
**Start:** Maria Santos at corner booth, flyer in hand. Betty standing at booth edge. The flyer is not yet on the table.
**Action:** Maria slides the folded flyer across the table toward Betty, hand resting on it a moment. Speaks — mouth moves slightly: "Small business stabilization grant. Five thousand. You qualify, Betty." Betty's eyes move to the flyer. She doesn't reach for it yet.
**Camera:** Locked with slow 3-second push toward the table — the flyer and the space between the two women.
**End:** The flyer on the table between them. Betty's eyes on it. Maria watching Betty.
**Prompt:** Medium two-shot, corner diner booth. Latina woman in blazer, early 40s, slides a folded white official flyer across laminate table toward older woman in apron. One hand rests on the flyer as she speaks. Older woman stands at booth edge, eyes on the flyer. Both still. Warm amber booth pendant light. Slow push toward the table. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 3E — Reading the Flyer
**Source:** SHOT 3E | **Duration:** 3s
**Start:** The grant flyer held open in Betty's hands, text visible. Betty's face above it, reading.
**Action:** Her eyes move across the page, top to bottom. She pauses on something — her eyes stop moving, her head tilts almost imperceptibly. She reads it again. Her expression doesn't change but her attention deepens.
**Camera:** Locked. Rack focus slowly from the flyer text to Betty's face over 2 seconds, then hold on her face.
**End:** Betty's face, glasses, the flyer soft below. Still reading.
**Prompt:** Close shot, locked camera with slow rack focus. A folded official flyer, unfolded, held in older woman's hands. Text reads "Small Business Stabilization Grant — $5,000." Woman's face above, reading — glasses, grey hair, wire rims. Eyes track the page, pause. Rack focus from flyer to face over 2 seconds. Warm pendant light, white paper bouncing light upward. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 4A — The Emptiest Noon
**Source:** SHOT 4A | **Duration:** 4s
**Start:** Wide diner interior at noon. Almost completely empty. Two occupied tables, rest are bare place settings.
**Action:** The camera drifts slowly right, cataloguing the empty booths and counter stools. Sunlight makes rectangles on the floor between tables. At far left, Betty and Carlos are small figures — present but not yet the subject.
**Camera:** Slow handheld observational drift right, slight tilt exploring the room.
**End:** The camera comes to rest on the empty counter, a long row of inverted cups and unoccupied stools.
**Prompt:** Wide shot, diner interior, midday. Almost empty — two occupied tables in a room built for twenty. Warm amber light, red vinyl booths, cream walls, but most seats empty. Sunlight through front windows makes floor rectangles between unoccupied booths. Slow observational handheld drift right across the empty room. Two small figures at a far table. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 4B — Eggs Going Cold
**Source:** SHOT 4B | **Duration:** 5s
**Start:** Carlos and Betty at laminate table. His eggs sit untouched. Legal pad open. He's picking up a pen.
**Action:** Carlos sketches on a napkin — quick, practiced lines. Kitchen layout, arrows, a circled number. He speaks as he draws. Betty watches the sketch building. Her hand moves to the legal pad but doesn't write yet. The eggs continue to sit untouched.
**Camera:** Locked with very slow push toward the table and the napkin sketch — 4 seconds.
**End:** The napkin sketch in foreground, sharper. Carlos's drawing hand above it. Betty watching.
**Prompt:** Medium two-shot, laminate diner table. Latino man in mechanic's shirt with name patch sketches a kitchen layout on a paper napkin — arrows, a prep line diagram, a circled number. Woman in apron across from him, legal pad open, watching the sketch. A plate of eggs sits untouched beside him. Overhead cooler light — green-white fluorescent. Very slow push toward the table. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 4C — Fast Handwriting
**Source:** SHOT 4C | **Duration:** 3s
**Start:** Legal pad on table, blank or with a line or two. Betty's hand enters frame with pen.
**Action:** She writes quickly and deliberately — numbers, headings, a column of figures. The pen doesn't hesitate. Her other hand steadies the top of the pad. At the edge of frame, Carlos's napkin sketch is visible.
**Camera:** Locked. Very slight angle from above.
**End:** A column of figures on the legal pad. The pen pausing at the bottom of a line.
**Prompt:** Close shot, locked camera, slight overhead angle. A woman's hand writing quickly on a yellow legal pad — numbers, headings, organized columns. Pen moves without hesitation. Other hand steadies pad top. Edge of a rough napkin sketch visible at frame right. Cool fluorescent overhead light. Shallow DOF, current writing line sharp. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 4D — The Council Passed
**Source:** SHOT 4D | **Duration:** 4s
**Start:** Empty diner interior. The front door opens — Lisa Freeman enters mid-stride, backlit by daylight.
**Action:** Lisa's eyes find Betty across the room. She doesn't slow down. Speaks across the space — mouth moves: "The council motion passed. Your testimony did that." Empty booths fill the space between them. Betty is still at the table, small in the background.
**Camera:** Locked on the mid-shot that holds both women in frame — door side and table side — with the empty room between them.
**End:** Lisa mid-room, Betty at the table, both still. The news has landed in the space.
**Prompt:** Medium shot, diner interior. Black woman in practical jacket enters through front door mid-stride, backlit by daylight, catches the eye of older woman in apron at a far table across a half-empty room. Distance between them dramatized by empty booths. She speaks across the space. Locked camera holding both figures. Daylight burst from door, warm amber interior. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 4E — Back to the Legal Pad
**Source:** SHOT 4E | **Duration:** 3s
**Start:** Betty's face, taking in Lisa's news. A slight shift in her expression — something released, briefly.
**Action:** She doesn't speak. She doesn't celebrate. Her eyes drop back to the legal pad. Her hand picks up the pen. Her face closes into concentration. The news is absorbed and the work resumes.
**Camera:** Locked on her face and the top edge of the legal pad.
**End:** Betty looking down at the pad, pen in hand. Working again.
**Prompt:** Close shot, locked camera. Woman's face, 58, wire-rim glasses. She absorbs good news — a very slight release in her expression — then looks back down at a legal pad, picks up her pen, returns to work. Doesn't celebrate. Face closes into focus. Cool-warm overhead light. Shallow DOF. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 5A — The Back Office Call
**Source:** SHOT 5A | **Duration:** 4s
**Start:** Betty standing at desk in back office. Phone to ear. Legal pad open. Listening.
**Action:** She makes a small mark on the legal pad. Her jaw sets. She shifts her weight from one foot to the other — not nervousness, controlled impatience. She begins to speak — her mouth moves. The words come deliberately.
**Camera:** Locked with very slow push toward her — the camera paying close attention to the phone call.
**End:** Betty mid-sentence — jaw set, eyes forward, legal pad in her right hand.
**Prompt:** Medium shot, back office. Woman, 58, stands at a desk with phone to ear and legal pad open — she doesn't sit. Posture controlled, forward-leaning. Single desk lamp warm against flat cool-white walls. Business license askew on wall behind her. She listens, then begins to speak. Very slow push toward her. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 5B — Written Terms
**Source:** SHOT 5B | **Duration:** 2.5s
**Start:** Legal pad on desk, desk lamp light. The words "RoboRide — delivery partnership" at top of page. Below: a blank line.
**Action:** Betty's hand enters frame with pen. She writes "written terms — end of week" and immediately draws one underline, then a second, pressing hard. The pen stays below the phrase.
**Camera:** Locked. Slight overhead angle. No movement.
**End:** The double-underlined phrase on the page. Pen resting below it. The emphasis visible in the pressed ink.
**Prompt:** Close shot, locked camera, slight overhead angle. Legal pad on desk, desk lamp light from left. A woman's hand enters and writes "written terms — end of week" then draws two firm underlines beneath it — second one pressing into the paper. Pen rests below. Other notes and figures visible on page. Warm desk lamp shadow on right half of page. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 5C — The Empty Room from the Kitchen
**Source:** SHOT 5C | **Duration:** 3s
**Start:** View through the kitchen pass-through opening. The empty dining room beyond — all stools upturned on tables, chairs legs-up. Afternoon sun through front windows.
**Action:** Nothing moves. The light shifts imperceptibly as the sun tracks — the shadow of an upturned stool leg moves a millimeter across a tabletop. The room stays empty.
**Camera:** Locked. Looking through the pass-through frame.
**End:** The empty dining room. The pass-through frame around it. The light unchanged.
**Prompt:** Medium shot through a kitchen pass-through window, framed by stainless steel edges. The empty diner dining room visible beyond — all stools upturned on tables, chairs legs-up, afternoon light through front windows. No people. Warm amber light on empty furniture. Long shadows from stool legs. Locked camera from kitchen side. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 5D — The Demand
**Source:** SHOT 5D | **Duration:** 3s
**Start:** Betty's face, phone to ear, listening. Jaw not yet set.
**Action:** Her jaw sets. Her eyes fix on a middle distance. Her mouth opens slightly and she speaks — deliberate, measured, no emotion on the surface: "I need written terms by end of this week. That's not a request." Her expression doesn't soften after.
**Camera:** Locked. No movement. ECU on the face.
**End:** Betty's face, post-statement. Jaw still set. Listening to the response.
**Prompt:** Close shot, locked camera. Woman's face, 58, wire-rim glasses, phone to ear. Her jaw sets and she speaks — deliberate, no performance of emotion, certain. Desk lamp light on one side of face, flat white office wall behind. The face of someone who has stopped negotiating and started requiring. Shallow DOF. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 6A — Pre-Dawn Decision Room
**Source:** SHOT 6A | **Duration:** 4s
**Start:** Empty dark diner interior, pre-dawn. Near-black. All chairs up on tables. A single warm rectangle of kitchen pass-through glow in the distance. Betty's small figure at a booth near it.
**Action:** Nothing dramatic moves. The kitchen glow holds steady. Betty shifts slightly — a page turned, barely perceptible. The dark room stays dark.
**Camera:** Very slight handheld observational drift leftward, settling.
**End:** Betty's small figure in the near-dark, the kitchen rectangle warm behind her. The rest of the room in shadow.
**Prompt:** Wide shot, empty diner interior, pre-dawn near-dark. All chairs upturned on tables. A single warm rectangle of light — kitchen pass-through — glows at the far end. Small figure of woman in apron sits alone at a booth with papers spread before her, lit from behind by the kitchen glow. The rest of the room in near-black silhouette. Very slow handheld observational drift. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 6B — The Folder
**Source:** SHOT 6B | **Duration:** 4s
**Start:** Betty seated at booth. Folder spread open on table — loan papers, partnership agreement, business card. Her hands flat on the table, not touching papers.
**Action:** She looks at the spread of papers. Her hands don't move. Her eyes move across the table slowly. She reaches, hesitates, doesn't touch. Pulls her hand back. The papers stay spread.
**Camera:** Locked with slow push toward the table.
**End:** The table in focus — the spread of papers, her hands above them. Betty's face above in soft focus.
**Prompt:** Medium shot, diner booth, pre-dawn. Woman in apron sits alone at a table with a folder spread open — loan papers, corporate partnership agreement, business card fanned out. Her hands rest flat on the table not touching the papers. She looks at the spread. One warm pendant light in a dark room. Slow push toward the table. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 6C — The Credit Union Card
**Source:** SHOT 6C | **Duration:** 2s
**Start:** Business card, back face up, resting on folder surface. "$12K — approved" visible in ballpoint handwriting.
**Action:** Nothing moves. The pendant light above holds warm. A very slight, imperceptible focus rack from the card's handwritten text to the printed front face, or the card simply sits there.
**Camera:** Fully locked. Flat-lay adjacent angle.
**End:** The card, the handwriting, the number. Still.
**Prompt:** Insert shot, locked camera, near flat-lay angle. Business card face down showing handwritten ballpoint text: "$12K — approved." Navy-on-cream printed card text partially visible at edges. Card rests on official loan paperwork. Warm pendant light from above, slight edge shadow. Shallow DOF, card sharp. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 6D — The Last Number
**Source:** SHOT 6D | **Duration:** 2s
**Start:** Legal pad bottom of page. Dense figures above. The number "$1,972" alone at the bottom.
**Action:** Nothing moves. The lamp light holds. The number sits there.
**Camera:** Locked. No movement. The camera looks at the number.
**End:** Same. The number alone at the bottom of the page.
**Prompt:** Insert shot, locked camera. Bottom of a yellow legal pad page. Dense columns of handwritten numbers and crossed-out figures fill the upper portion. At the bottom, separated by white space, alone: "$1,972" in bolder handwriting. Credit union business card edge visible at lower right. Warm desk lamp light from left. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 6E — She Closes the Folder
**Source:** SHOT 6E | **Duration:** 3s
**Start:** Betty's hands at the edges of the spread-open folder on the table.
**Action:** She draws the folder closed. The papers gather inside. The folder closes flat. Her palms rest on the cover — both flat, still. A held moment, hands on the closed folder.
**Camera:** Locked on her hands.
**End:** Both hands resting on the closed folder. Still.
**Prompt:** Close shot, locked camera. Aged woman's hands close a spread folder on a diner booth table — not dramatically, just closing it. Papers gather inside. Hands rest flat on the closed cover afterward. Still. Warm pendant light overhead. Shallow DOF, hands sharp. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 6F — The Signature
**Source:** SHOT 6F | **Duration:** 2.5s
**Start:** Betty's hand picks up the pen. The folder is open to a signature page.
**Action:** Her hand moves to the signature line. She signs — confident, a single motion. The pen lifts from the paper.
**Camera:** Locked on the signature line and her hand.
**End:** The signed document. Her hand withdrawing. The pen resting.
**Prompt:** Close shot, locked camera. Older woman's hand picks up a pen, moves to a signature line on an official document, and signs — confident, practiced, a single motion. Pen lifts from paper. The signature sits on the line. Warm pendant light. Shallow DOF, pen tip sharp. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 7A — The Box
**Source:** SHOT 7A | **Duration:** 3s
**Start:** Cardboard box on prep counter, tape just cut, flaps bent back. Insulated delivery bags stacked inside.
**Action:** Betty's hands enter frame and pull the first bag out of the box. She sets it on the counter beside the box. Pulls the second one. Stacks them. Purposeful, efficient.
**Camera:** Locked. Very slight overhead angle.
**End:** Two or three delivery bags stacked on the counter beside the open box. Her hands withdrawing.
**Prompt:** Close shot, locked camera. Cardboard box torn open on stainless steel prep counter, insulated delivery bags stacked inside. Woman's hands pull bags out one by one and stack them beside the box. Fluorescent kitchen light, green-white. New gear, new purpose. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 7B — The Route Sheet Goes Up
**Source:** SHOT 7B | **Duration:** 3s
**Start:** Betty holding a handwritten route sheet, standing at the wall above the kitchen pass-through.
**Action:** She places the sheet against the wall, presses tape at the top corners, then smooths the paper flat with her palm from top to bottom. Steps back a half-step to look at it.
**Camera:** Locked or very slow push toward her.
**End:** The route sheet taped flat on the wall above the pass-through. Betty's hand still resting on it.
**Prompt:** Medium shot, kitchen. Woman in apron tapes a handwritten route sheet to the wall above a pass-through window — pressing tape, smoothing the paper flat with her palm. Three-quarter profile, back slightly to camera. Kitchen fluorescent light. Through the pass-through, dark empty dining room visible. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 7C — The Route Sheet
**Source:** SHOT 7C | **Duration:** 2s
**Start:** The route sheet on the wall. Three names and addresses in handwritten cursive.
**Action:** Nothing moves. Fluorescent light holds. The names stay on the page.
**Camera:** Locked. No movement.
**End:** The route sheet. The names. Still.
**Prompt:** Insert shot, locked camera. Handwritten route sheet taped to a kitchen wall. Three lines of clear cursive: "Miguel Hernandez — 4 Sycamore Ct / D. Okafor — 18 Mill Rd / Reyes family — 7 Birch Ave." Clear tape at upper corners. Kitchen wall surface. Fluorescent overhead light, even and flat. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, 24fps, American realist drama, quiet.

---

### KLING 7D — Betty at the Prep Line, Dark Room Behind
**Source:** SHOT 7D | **Duration:** 4s
**Start:** Betty at prep line in kitchen, working. Behind her through the pass-through: the dark empty dining room.
**Action:** She works the prep line — plating, wrapping, efficient. The dining room behind her stays dark and still. She doesn't look back at it.
**Camera:** Locked or very slight handheld hold — observing from behind and to the side.
**End:** Betty working, the dark dining room behind her, the contrast held.
**Prompt:** Wide shot, kitchen. Woman in apron works the prep line — plating and wrapping food efficiently. Behind her, visible through the pass-through opening: the empty dark dining room, all chairs upturned. Fluorescent kitchen light forward, near-dark dining room behind. The kitchen alive, the dining room still. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 8A — The Name on the Glass
**Source:** SHOT 8A | **Duration:** 3s
**Start:** Extreme close on diner front door lettering from outside. "AUTO ROW DINER" painted on glass. No customers visible through it. Kitchen glow at far end of the dark room.
**Action:** Nothing in the lettering moves. But behind the glass, a small blurred shape — Betty — moves through the kitchen. The glow holds. The name stays on the door.
**Camera:** Locked. ECU. No movement.
**End:** The painted letters. The running kitchen behind. The name on the glass.
**Prompt:** Extreme close-up, locked camera, exterior. "AUTO ROW DINER" in hand-painted letters on glass front door, slightly worn. Through the letters and glass: empty dining room, no customers. But at the far end — visible through the pass-through — kitchen light, and a small blurred figure moving. The name on the door. The work behind it. Overcast daylight outside. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 8B — Lisa at the Hostess Stand
**Source:** SHOT 8B | **Duration:** 3s
**Start:** Lisa Freeman behind the old hostess stand. A delivery coordination sheet spread across the surface.
**Action:** She marks something with a marker, scans the sheet, makes another notation. Checks something on her clipboard. Moves efficiently through the grid. The stand doesn't know it's been repurposed.
**Camera:** Locked with very slow push.
**End:** Lisa, the sheet, the marked names. Working.
**Prompt:** Medium shot, old diner hostess stand. Black woman, 35, natural hair, practical jacket, stands behind the stand marking a delivery coordination sheet — a grid of names, times, addresses — with a marker. Clipboard beside her. Front windows behind, flat overcast light. No guests. The stand repurposed without ceremony. Very slow push. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 8C — Betty Works the Line
**Source:** SHOT 8C | **Duration:** 3s
**Start:** Betty alone at the kitchen prep line, mid-motion.
**Action:** She works through the line — picking up, plating, packing. Her movements are practiced, unhurried, precise. No hesitation, no search for tools or surfaces. She knows this space completely.
**Camera:** Locked or barely perceptible slow push.
**End:** Betty still working, the kitchen still running around her.
**Prompt:** Medium shot, kitchen prep line. Woman in apron, 58, works alone — plating, packing, moving through the prep line efficiently. Sleeves pushed back, hands practiced. Fluorescent overhead light. She doesn't look for anything — her hands know where everything is. The kitchen hums around her. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 8D — Tommy's Booth, Empty
**Source:** SHOT 8D | **Duration:** 2.5s
**Start:** Tommy's booth, empty. The upturned coffee cup at his place, mid-afternoon window light.
**Action:** Nothing moves. The light from the window is still. The cup stays upturned. Auto Row is visible and motionless beyond the glass.
**Camera:** Locked. No movement. Holding on the cup.
**End:** The upturned cup. The empty booth. The window.
**Prompt:** Close shot, locked camera. Empty diner booth — the window seat. A single white coffee cup turned upside down on a saucer at the center of the cleared table. Mid-afternoon window light. Red vinyl bench. Through the window behind: Auto Row, still. No person. Shallow DOF, cup sharp. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

### KLING 8E — Betty's Face at the End
**Source:** SHOT 8E | **Duration:** 4s
**Start:** Betty's face, close. She is mid-task, not aware of the frame. Tired.
**Action:** She pauses — a natural breath between tasks. Her gaze settles, not at the camera, at the middle distance. The tiredness is visible. The intactness is visible. She blinks once. The moment holds.
**Camera:** Locked. ECU. No movement. This is the last frame of the film.
**End:** Betty's face. Still. Tired. Intact. Fade to black.
**Prompt:** Extreme close-up, locked camera. Woman's face, 58, wire-rim glasses, grey hair. Tired — genuinely, not performed. She pauses in her work, eyes settling on a middle distance, not at camera. A single blink. Her face: intact. Not broken. Not victorious. Present. Kitchen light from behind. Warm light finding her face. Hold and fade. 16mm grain, anamorphic lens, naturalistic lighting, no artificial fill, slow deliberate pacing, 24fps, American realist drama, quiet.

---

## DAG DEPENDENCY MAP

```
NODE 1: Visual Identity
    │
    ├──→ NODE 2: Character Sprites (nanobanana)
    │        Betty × {front, 3/4, side, hands} × {neutral, working, deciding}
    │        Tommy × {front, 3/4} × {regular, silent}
    │        Maria × {front, 3/4} × {purposeful}
    │        Carlos × {front, 3/4} × {explaining, listening}
    │        Lisa × {front, 3/4} × {moving, marking}
    │        Kevin O'Brien × {card only — never seen}
    │
    ├──→ NODE 3: Environment Sprites (nanobanana)
    │        Diner exterior: dawn, day
    │        Diner interior: full, half-empty, empty, pre-dawn
    │        Kitchen: active, delivery mode
    │        Back office: phone call
    │        Auto Row: normal, AV passing
    │        The AV: passing, static
    │        Props: coffee pot, legal pad, Tommy's booth, delivery bags,
    │               route sheet, Kevin's card, $1,972 notepad
    │
    └──→ NODE 4: Shot Frames (CHARACTER × ENVIRONMENT × SHOT TYPE)
             → per shot in all 8 scenes (~30 prompts)
                    │
                    └──→ NODE 5: Kling Video Prompts
                             → per shot (~30 motion prompts)
                             camera move + action + duration
```
