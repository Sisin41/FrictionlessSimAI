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

<!-- NODE 4 CONTENT GENERATED BY SUB-AGENT — SEE BELOW -->

---

## NODE 5 — KLING VIDEO PROMPTS
*Motion prompts built from shot frames — one per shot*
*Camera movement, subject action, duration, mood*

---

<!-- NODE 5 CONTENT GENERATED BY SUB-AGENT — SEE BELOW -->

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
