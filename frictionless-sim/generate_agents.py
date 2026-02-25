#!/usr/bin/env python3
"""
Agent Population Generator — Frictionless Economy Simulation
Source of truth: frictionless_economy_simulation_spec.docx (Sections 3, 4, 17, 18, 19)

Generates 30 agents for the Millfield car micro-economy.
Each agent has full state vector: identity, hierarchy, perception, relationships, memory.
"""
import json, os, random
random.seed(42)

SIM_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Agent Definitions ──────────────────────────────────────────────
# Per spec Section 19: car micro-economy ecosystem
# Per spec Section 6: power tiers 1-4
AGENTS = [
    # ── TIER 1: Strategic Decision Makers ──
    dict(id="ceo_regional_auto", name="Patricia Hawkins", age=54,
         role="CEO, Regional Auto Group", tier=1, sector="retail_auto",
         identity_attachment=0.85, dependents=3,
         narrative="Built this dealership group over 20 years from a single lot. My father was a car dealer. This is my legacy.",
         income=18000, savings_months=24, skills=["management","sales","negotiation","automotive_industry"], skill_relevance=0.4),

    dict(id="bank_manager", name="David Chen", age=48,
         role="Branch Manager, First Community Bank", tier=1, sector="finance",
         identity_attachment=0.6, dependents=2,
         narrative="I manage the branch that handles most auto loans in the area. My job is risk assessment and relationship banking.",
         income=9500, savings_months=18, skills=["finance","risk_assessment","lending","management"], skill_relevance=0.55),

    dict(id="council_member", name="Maria Santos", age=45,
         role="Town Council Member", tier=1, sector="policy",
         identity_attachment=0.7, dependents=2,
         narrative="Elected to serve Millfield. My constituents are worried and I need to find solutions or I'll lose my seat.",
         income=5500, savings_months=12, skills=["policy","public_speaking","negotiation","community_organizing"], skill_relevance=0.8),

    # ── TIER 2: Operational Decision Makers ──
    dict(id="dealership_gm", name="Rick Tanner", age=51,
         role="General Manager, Millfield Auto Mall", tier=2, sector="retail_auto",
         identity_attachment=0.9, dependents=4,
         narrative="Been in car sales since I was 19. Started washing cars, worked my way up to GM. This is the only life I know.",
         income=11000, savings_months=8, skills=["automotive_sales","management","customer_service"], skill_relevance=0.25),

    dict(id="insurance_manager", name="Linda Park", age=42,
         role="Regional Manager, AutoShield Insurance", tier=2, sector="insurance",
         identity_attachment=0.5, dependents=1,
         narrative="I manage auto insurance for the region. My team of 6 agents is shrinking as policies cancel.",
         income=8500, savings_months=14, skills=["insurance","risk_assessment","management","data_analysis"], skill_relevance=0.35),

    dict(id="hr_director", name="Angela Wright", age=39,
         role="HR Director, Regional Auto Group", tier=2, sector="retail_auto",
         identity_attachment=0.4, dependents=0,
         narrative="I handle hiring and firing. Right now it's mostly firing. I wonder if my own job is next.",
         income=7200, savings_months=10, skills=["human_resources","management","counseling","compliance"], skill_relevance=0.6),

    # ── TIER 3: Directly Affected Workers ──
    dict(id="salesperson_jake", name="Jake Morrison", age=34,
         role="Car Salesperson", tier=3, sector="retail_auto",
         identity_attachment=0.65, dependents=2,
         narrative="I'm a natural seller. People trust me. But nobody's walking in the door anymore.",
         income=5500, savings_months=3, skills=["sales","customer_service","negotiation"], skill_relevance=0.2),

    dict(id="salesperson_tamika", name="Tamika Jefferson", age=28,
         role="Car Salesperson", tier=3, sector="retail_auto",
         identity_attachment=0.3, dependents=0,
         narrative="This was supposed to be temporary while I figured out my life. Guess now I have to figure it out.",
         income=4200, savings_months=2, skills=["sales","social_media","customer_service"], skill_relevance=0.2),

    dict(id="mechanic_carlos", name="Carlos Ruiz", age=47,
         role="Master Mechanic", tier=3, sector="service",
         identity_attachment=0.8, dependents=3,
         narrative="I fix cars. It's who I am. My hands know engines. But these new electric AVs are completely different machines.",
         income=5800, savings_months=6, skills=["mechanical_repair","diagnostics","electrical_systems"], skill_relevance=0.5),

    dict(id="mechanic_sarah", name="Sarah Kim", age=31,
         role="Junior Mechanic", tier=3, sector="service",
         identity_attachment=0.4, dependents=0,
         narrative="I got into this because I love working with my hands. I'm also good with computers though.",
         income=3800, savings_months=4, skills=["mechanical_repair","computer_diagnostics","electrical"], skill_relevance=0.6),

    dict(id="gas_station_owner", name="Amir Patel", age=55,
         role="Gas Station Owner", tier=3, sector="fuel",
         identity_attachment=0.75, dependents=4,
         narrative="My family has owned this station for 25 years on Auto Row. If the dealers go, we go with them.",
         income=7000, savings_months=10, skills=["small_business","retail","property_management"], skill_relevance=0.3),

    dict(id="insurance_agent_tom", name="Tom Bradley", age=52,
         role="Auto Insurance Agent", tier=3, sector="insurance",
         identity_attachment=0.7, dependents=2,
         narrative="I've sold auto insurance for 28 years. My whole client book is personal auto policies. It's disappearing.",
         income=6200, savings_months=9, skills=["insurance_sales","customer_service","risk_assessment"], skill_relevance=0.15),

    dict(id="insurance_agent_priya", name="Priya Sharma", age=29,
         role="Insurance Agent", tier=3, sector="insurance",
         identity_attachment=0.25, dependents=0,
         narrative="Auto insurance was my first job out of college. I can see the writing on the wall and I'm not scared of change.",
         income=4000, savings_months=5, skills=["insurance","data_analysis","sales","tech_savvy"], skill_relevance=0.4),

    dict(id="loan_officer", name="Kevin O'Brien", age=44,
         role="Auto Loan Officer", tier=3, sector="finance",
         identity_attachment=0.5, dependents=2,
         narrative="I process auto loans. Applications have dropped 50% in three months. My pipeline is dry.",
         income=5500, savings_months=7, skills=["lending","finance","customer_service","compliance"], skill_relevance=0.35),

    # ── TIER 4: Downstream / Indirectly Affected ──
    dict(id="diner_owner", name="Betty Kowalski", age=61,
         role="Owner, Auto Row Diner", tier=4, sector="food_service",
         identity_attachment=0.85, dependents=1,
         narrative="My diner has fed Auto Row workers for 30 years. If they're gone, who's eating lunch here?",
         income=4500, savings_months=6, skills=["food_service","small_business","community_relations"], skill_relevance=0.5),

    dict(id="driving_instructor", name="Frank Russo", age=58,
         role="Driving School Owner", tier=4, sector="education",
         identity_attachment=0.8, dependents=1,
         narrative="I've taught thousands of kids to drive. If nobody needs to drive, what am I for?",
         income=4000, savings_months=8, skills=["teaching","driving","small_business"], skill_relevance=0.1),

    dict(id="car_wash_worker", name="Miguel Hernandez", age=23,
         role="Car Wash Attendant", tier=4, sector="service",
         identity_attachment=0.1, dependents=0,
         narrative="It's a job. I need it for rent. Not attached to it whatsoever.",
         income=2400, savings_months=1, skills=["manual_labor","customer_service"], skill_relevance=0.2),

    dict(id="parking_garage_mgr", name="Denise Williams", age=46,
         role="Parking Garage Manager", tier=4, sector="transport",
         identity_attachment=0.4, dependents=2,
         narrative="Downtown parking garage. If people stop owning cars, they stop parking them. Simple math.",
         income=4200, savings_months=5, skills=["operations","management","property"], skill_relevance=0.3),

    dict(id="commuter_james", name="James Patterson", age=38,
         role="Software Developer (commuter)", tier=4, sector="tech",
         identity_attachment=0.15, dependents=2,
         narrative="I drive 45 minutes to work each way. If a robotaxi is cheaper and I can code during the ride, why own a car?",
         income=8500, savings_months=12, skills=["software_development","tech","analytical"], skill_relevance=0.95),

    dict(id="commuter_rachel", name="Rachel Green", age=33,
         role="Marketing Manager (commuter)", tier=4, sector="marketing",
         identity_attachment=0.35, dependents=0,
         narrative="My car is part of how I present myself. But honestly the car payment is killing me.",
         income=6000, savings_months=4, skills=["marketing","social_media","communication"], skill_relevance=0.8),

    dict(id="truck_owner", name="Dale Cooper", age=50,
         role="Contractor (truck owner)", tier=4, sector="construction",
         identity_attachment=0.9, dependents=3,
         narrative="My truck is my identity AND my primary tool. You can pry it from my cold dead hands.",
         income=6500, savings_months=7, skills=["construction","manual_trades","driving"], skill_relevance=0.7),

    dict(id="retiree", name="Dorothy Chen", age=72,
         role="Retired Teacher", tier=4, sector="retired",
         identity_attachment=0.4, dependents=0,
         narrative="I barely drive anymore but my car is my independence. What if I need to get to the doctor at 2am?",
         income=3200, savings_months=36, skills=["teaching","community"], skill_relevance=0.3),

    dict(id="young_gig_worker", name="Zoe Martinez", age=22,
         role="Barista / Gig Worker", tier=4, sector="service",
         identity_attachment=0.05, dependents=0,
         narrative="I never wanted a car anyway. Way too expensive. Robotaxi is perfect for me.",
         income=2800, savings_months=1, skills=["service","social_media","gig_economy","tech_savvy"], skill_relevance=0.7),

    dict(id="single_parent", name="Nicole Washington", age=36,
         role="Nurse (single parent)", tier=4, sector="healthcare",
         identity_attachment=0.5, dependents=2,
         narrative="I need my car for 5am hospital shifts and picking up my kids after school. Can a robotaxi do that reliably?",
         income=5200, savings_months=3, skills=["healthcare","caregiving","time_management"], skill_relevance=0.9),

    dict(id="parts_store_owner", name="Howard Liu", age=43,
         role="Owner, Auto Parts Store", tier=4, sector="retail_auto",
         identity_attachment=0.6, dependents=2,
         narrative="I sell parts for people who fix their own cars. That DIY market is shrinking fast.",
         income=5000, savings_months=8, skills=["retail","automotive_knowledge","small_business"], skill_relevance=0.3),

    dict(id="rideshare_driver", name="Robert Jackson", age=41,
         role="Rideshare Driver", tier=4, sector="transport",
         identity_attachment=0.35, dependents=1,
         narrative="I drive for Uber and Lyft full-time. The robotaxis are my direct competition. Already seeing fewer rides.",
         income=3500, savings_months=2, skills=["driving","customer_service","navigation"], skill_relevance=0.1),

    dict(id="real_estate_agent", name="Stephanie Morris", age=40,
         role="Commercial Real Estate Agent", tier=4, sector="real_estate",
         identity_attachment=0.45, dependents=1,
         narrative="Half my listings are auto-related: dealership lots, repair shops, gas stations. Vacancy is spiking.",
         income=7500, savings_months=9, skills=["real_estate","sales","negotiation","market_analysis"], skill_relevance=0.55),

    dict(id="auto_shop_teacher", name="Mark Thompson", age=35,
         role="High School Auto Shop Teacher", tier=4, sector="education",
         identity_attachment=0.3, dependents=1,
         narrative="I teach auto shop. Enrollment is dropping. The school board might cut my program entirely.",
         income=4500, savings_months=6, skills=["teaching","automotive","youth_development"], skill_relevance=0.4),

    dict(id="community_organizer", name="Lisa Freeman", age=49,
         role="Community Center Director", tier=4, sector="community",
         identity_attachment=0.7, dependents=0,
         narrative="I see people coming in who are lost. More than usual. The community needs support right now more than ever.",
         income=4000, savings_months=5, skills=["community_organizing","counseling","program_management","fundraising"], skill_relevance=0.85),

    dict(id="uber_driver_2", name="Grace Okafor", age=30,
         role="Part-time Rideshare Driver / Nursing Student", tier=4, sector="transport",
         identity_attachment=0.1, dependents=0,
         narrative="Driving rideshare to pay for nursing school. When robotaxis take over, I'll hopefully be done with school anyway.",
         income=2200, savings_months=1, skills=["driving","healthcare_student","adaptable"], skill_relevance=0.6),
]


def _historical_conditioning(age):
    """Spec Section 17: behavioral priors from demographic experience."""
    priors = []
    if age >= 40:  # Lived through 2008
        priors.append({"event": "2008_financial_crisis", "response_pattern": "risk_aversion_spike",
                       "lesson": "Institutions can fail. Savings matter. Trust is fragile."})
    if age >= 18:  # Lived through COVID
        priors.append({"event": "covid_pandemic", "response_pattern": "rapid_adaptation_or_freeze",
                       "lesson": "Remote work is possible. Government can provide. Disruption is sudden."})
    if age >= 55:  # Remembers dot-com bust
        priors.append({"event": "dotcom_bust", "response_pattern": "tech_skepticism",
                       "lesson": "Not every tech revolution delivers on its promises immediately."})
    if not priors:
        priors.append({"event": "none", "response_pattern": "no_crisis_experience",
                       "lesson": "Has not lived through a major economic disruption. May underestimate severity."})
    return priors


def _build_commitments(a):
    """Spec Section 9: Active commitments that trap agents in pre-disruption obligations."""
    comms = []
    if a["income"] > 3000:  # Most people have a lease or mortgage
        comms.append({"type": "housing", "description": "Mortgage/rent",
                      "monthly_cost": round(a["income"] * random.uniform(0.25, 0.4)),
                      "remaining_months": random.randint(12, 240),
                      "exit_cost_months": random.randint(2, 6)})
    if a.get("sector") in ("retail_auto", "insurance", "finance", "fuel", "service"):
        comms.append({"type": "employment", "description": f"Employment at {a['role']}",
                      "monthly_income": a["income"],
                      "remaining_months": None,  # indefinite
                      "exit_cost_months": 1})
    if a["dependents"] > 0:
        comms.append({"type": "family", "description": f"{a['dependents']} dependents",
                      "monthly_cost": round(a["dependents"] * random.uniform(400, 800)),
                      "remaining_months": None,
                      "exit_cost_months": None})  # can't exit
    return comms


def build_state(a):
    """Build full agent state vector per spec Section 3."""
    inc = a["income"]
    sav = inc * a["savings_months"]
    debt = round(inc * random.uniform(2, 18))
    expenses = round(inc * random.uniform(0.7, 0.95))
    
    return {
        "agent_id": a["id"],
        "identity": {
            "name": a["name"], "age": a["age"], "role": a["role"],
            "tier": a["tier"], "sector": a["sector"],
            "narrative": a["narrative"],
            "identity_attachment": a["identity_attachment"],
            "dependents": a["dependents"],
            "skills": a["skills"], "skill_relevance": a["skill_relevance"],
            "historical_conditioning": _historical_conditioning(a["age"])
        },
        "hierarchy": {
            "L0_SURVIVE": {
                "runway_months": round(a["savings_months"], 1),
                "threat_level": round(max(0, min(1, 1 - a["savings_months"] / 12)), 2),
                "monthly_essentials": round(inc * 0.5)
            },
            "L1_STABILIZE": {
                "savings_buffer": round(sav),
                "debt_load_ratio": round(random.uniform(0.15, 0.45), 2),
                "insurance_coverage": random.choice(["full","basic","none"])
            },
            "L2_PARTICIPATE": {
                "employment_status": "employed",
                "skill_relevance": a["skill_relevance"],
                "role_security": round(random.uniform(0.3, 0.9), 2),
                "network_strength": round(random.uniform(0.3, 0.8), 2)
            },
            "L3_CONSUME": {
                "discretionary_budget": round(inc * 0.25),
                "owns_car": a["age"] > 25 or a["income"] > 4000,
                "car_payment_monthly": round(random.uniform(250, 650)) if random.random() > 0.3 else 0,
                "substitution_willingness": round(1 - a["identity_attachment"], 2)
            },
            "L4_SIGNAL": {
                "status_anxiety": round(random.uniform(0.2, 0.7), 2),
                "reference_group": a["sector"]
            },
            "L5_BUILD": {
                "future_orientation": round(random.uniform(0.3, 0.8), 2),
                "entrepreneurial_drive": round(random.uniform(0.1, 0.7), 2)
            },
            "L6_TRANSCEND": {
                "meaning_source": random.choice(["work","family","community","creativity","faith"]),
                "purpose_stability": round(random.uniform(0.4, 0.9), 2),
                "community_ties": round(random.uniform(0.3, 0.8), 2)
            }
        },
        "perception": {
            "world_state_awareness": "baseline",
            "information_sources": random.sample(
                ["local_news","social_media","professional_network","direct_experience","word_of_mouth","national_news"],
                k=random.randint(2, 4)),
            "cognitive_biases": {
                "status_quo_bias": round(random.uniform(0.3, 0.8), 2),
                "normalcy_bias": round(random.uniform(0.3, 0.8), 2),
                "loss_aversion_multiplier": 2.5,
                "availability_heuristic": round(random.uniform(0.3, 0.7), 2),
                "social_proof_sensitivity": round(random.uniform(0.3, 0.7), 2)
            },
            "sentiment": "neutral"
        },
        "psychological": {
            "stress_level": round(random.uniform(0.1, 0.3), 2),
            "agency": round(random.uniform(0.4, 0.8), 2),
            "grief_stage": "none",
            "temporal_horizon_months": 12
        },
        "financial": {
            "monthly_income": inc,
            "monthly_expenses": expenses,
            "savings": round(sav),
            "debt_total": debt,
            "credit_score": random.randint(580, 800)
        },
        "commitments": _build_commitments(a),
        "in_progress_transformations": [],
        "temporal_mismatches": {
            "commitment_disruption_gap": 0.0,
            "skill_demand_gap": round(1 - a["skill_relevance"], 2),
            "policy_reality_gap": 0.0
        },
        "mobility": {
            "moving_cost_months": round(3 + a["dependents"] * 2 + a["identity_attachment"] * 4, 1),
            "knowledge_of_other_localities": round(random.uniform(0.1, 0.5), 2),
            "willingness_to_move": round(max(0, 1 - a["identity_attachment"] - a["dependents"] * 0.15), 2)
        },
        "locality": "millfield",
        "archetype": "stable",
        "tick_updated": 0
    }


def build_relationships():
    """Build social graph with trust, power dynamics, and obligations (Spec 3.4, 12.3)."""
    rels = {}
    for a in AGENTS:
        conns = []
        power_over = []
        power_under = []
        
        for b in AGENTS:
            if a["id"] == b["id"]: continue
            connected = False
            trust = 0.3
            rtype = "acquaintance"
            
            if a["sector"] == b["sector"]:
                connected = True
                trust = round(random.uniform(0.5, 0.9), 2)
                rtype = "colleague"
            elif abs(a["tier"] - b["tier"]) <= 1 and random.random() < 0.3:
                connected = True
                trust = round(random.uniform(0.3, 0.6), 2)
                rtype = "professional"
            elif random.random() < 0.12:
                connected = True
                trust = round(random.uniform(0.2, 0.5), 2)
                rtype = "neighbor"
            
            if connected:
                conns.append({"agent_id": b["id"], "name": b["name"],
                              "role": b["role"], "trust": trust, "type": rtype})
            
            # Power relationships (Spec 12.3)
            if a["sector"] == b["sector"] and a["tier"] < b["tier"]:
                power_over.append(b["id"])
            if a["sector"] == b["sector"] and a["tier"] > b["tier"]:
                power_under.append(b["id"])
        
        rels[a["id"]] = {
            "connections": conns,
            "power_over": power_over,
            "power_under": power_under,
            "obligations": [c["type"] for c in _build_commitments(a)]
        }
    return rels


def main():
    agents_dir = os.path.join(SIM_DIR, "agents")
    all_rels = build_relationships()
    
    for a in AGENTS:
        adir = os.path.join(agents_dir, a["id"])
        os.makedirs(os.path.join(adir, "actions"), exist_ok=True)
        
        with open(os.path.join(adir, "state.json"), "w") as f:
            json.dump(build_state(a), f, indent=2)
        with open(os.path.join(adir, "memory.json"), "w") as f:
            json.dump({"past_actions": [], "past_outcomes": [], "reflections": [],
                       "regrets": [], "successes": [], "adaptation_history": []}, f, indent=2)
        with open(os.path.join(adir, "inbox.json"), "w") as f:
            json.dump({"tick": 0, "messages": []}, f, indent=2)
        with open(os.path.join(adir, "relationships.json"), "w") as f:
            json.dump(all_rels.get(a["id"], {"connections":[],"power_over":[],"power_under":[],"obligations":[]}), f, indent=2)
    
    index = [{"id": a["id"], "name": a["name"], "role": a["role"],
              "tier": a["tier"], "sector": a["sector"]} for a in AGENTS]
    with open(os.path.join(agents_dir, "index.json"), "w") as f:
        json.dump(index, f, indent=2)
    
    # Locality state
    loc_dir = os.path.join(SIM_DIR, "localities")
    os.makedirs(loc_dir, exist_ok=True)
    with open(os.path.join(loc_dir, "millfield.json"), "w") as f:
        json.dump({
            "name": "Millfield",
            "population": 30,
            "cost_of_living_index": 1.0,
            "industry_mix": {"retail_auto": 0.3, "service": 0.15, "insurance": 0.1,
                             "finance": 0.08, "fuel": 0.05, "transport": 0.1,
                             "other": 0.22},
            "community_cohesion": 0.65,
            "unemployment_rate": 0.04,
            "avg_monthly_income": 5400,
            "local_multiplier": 3.5,
            "local_cascade_sensitivity": 0.7,
            "price_index": {
                "housing": 1.0, "food": 1.0, "transport": 1.0,
                "services": 1.0, "auto_related": 1.0
            },
            "policy_environment": {
                "retraining_programs": False,
                "transition_fund_available": False,
                "transition_fund_monthly": 0,
                "tax_incentives": False
            },
            "gini_coefficient": 0.35,
            "total_income": 5400 * 30,
            "disrupted_agent_count": 0
        }, f, indent=2)
    
    print(f"✓ Generated {len(AGENTS)} agents in {agents_dir}/")
    for a in AGENTS:
        print(f"  T{a['tier']} {a['id']:25s} {a['name']:20s} {a['role']}")
    print(f"✓ Locality: millfield")
    print(f"✓ Agent index: {agents_dir}/index.json")


if __name__ == "__main__":
    main()
