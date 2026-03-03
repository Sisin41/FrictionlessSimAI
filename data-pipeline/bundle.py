#!/usr/bin/env python3
"""
bundle.py — Master data pipeline for FrictionlessSimAI Visualization
Runs all sub-pipelines and produces viz-data/ output directory.

Output files:
  viz-data/
    agents.json        All 30 agents + per-tick history + reflections
    buildings.json     Building definitions + per-tick health states
    phenomena.json     Auto-detected events + scenario markers + timeseries
    social_graph.json  Full relationship network (nodes + edges + clusters)
    transactions.json  All 168 transactions, indexed
    world.json         Grid layout, zones, tile definitions
    meta.json          Simulation metadata, scenario summary
    manifest.json      File list, sizes, checksums

Usage:
    cd data-pipeline/
    python bundle.py
    python bundle.py --sim-dir ../frictionless-sim --out-dir ../viz-data
"""

import json
import os
import sys
import time
import hashlib
import argparse

# Local imports
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from derive_history     import derive_all_agents
from derive_buildings   import derive_buildings
from detect_phenomena   import derive_phenomena
from build_social_graph import build_social_graph
from build_transactions import build_transactions
from world_layout       import BUILDINGS, ZONES, GRID_COLS, GRID_ROWS, HOME_TILES, AGENT_WORKPLACE

def parse_args():
    p = argparse.ArgumentParser(description="Bundle sim data for visualization")
    p.add_argument("--sim-dir", default="../frictionless-sim")
    p.add_argument("--out-dir", default="../viz-data")
    p.add_argument("--step",    default="all",
                   help="Run one step: agents|buildings|phenomena|social|transactions|world|meta|all")
    return p.parse_args()

def step(name, fn, *args, **kwargs):
    print(f"\n[{name}]")
    t0 = time.time()
    result = fn(*args, **kwargs)
    print(f"  Done in {time.time()-t0:.1f}s")
    return result

def build_world_json(out_dir):
    """Write world layout (grid + zones + home tiles) for renderer."""
    world = {
        "grid": {
            "cols":    GRID_COLS,
            "rows":    GRID_ROWS,
            "tile_w":  64,   # px width of tile face
            "tile_h":  32,   # px height of tile face (isometric)
            "origin":  [GRID_COLS * 64 // 2, 80],  # screen origin (top-center)
        },
        "zones":     ZONES,
        "home_tiles": HOME_TILES,
        "agent_workplaces": AGENT_WORKPLACE,
        "informal_market_appears_tick": 7,
    }
    path = os.path.join(out_dir, "world.json")
    with open(path, "w") as f:
        json.dump(world, f, indent=2)
    print(f"  ✓ Wrote world layout to {path}")
    return world

def build_meta_json(out_dir, sim_dir):
    """Write simulation metadata."""
    scenario = json.load(open(f"{sim_dir}/config/scenario.json"))
    sim_cfg  = json.load(open(f"{sim_dir}/config/simulation.json"))
    agents   = json.load(open(f"{sim_dir}/agents/index.json"))
    locality = json.load(open(f"{sim_dir}/localities/millfield.json"))

    # Sector distribution
    sectors = {}
    for a in agents:
        s = a.get("sector", "unknown")
        sectors[s] = sectors.get(s, 0) + 1

    # Tier distribution
    tiers = {}
    for a in agents:
        t = a.get("tier", 0)
        tiers[t] = tiers.get(t, 0) + 1

    meta = {
        "simulation": {
            "name":        "Millfield Autonomous Transport Disruption",
            "locality":    "Millfield",
            "scenario":    scenario["scenario"],
            "description": scenario["description"],
            "total_ticks": 14,
            "ticks_with_data": 13,
            "missing_ticks": [7, 12],
            "agent_count": len(agents),
        },
        "scenario_events": scenario["events"],
        "locality": locality,
        "config":   sim_cfg,
        "agent_roster": [
            {
                "id":      a["id"],
                "name":    a["name"],
                "role":    a["role"],
                "tier":    a["tier"],
                "sector":  a["sector"],
            }
            for a in agents
        ],
        "sector_distribution": sectors,
        "tier_distribution":   {str(k): v for k, v in tiers.items()},
        "economic_arc": {
            "employment_start":  1.00,
            "employment_end":    0.40,
            "spending_start":    0.83,
            "spending_end":      0.24,
            "gini_start":        0.254,
            "gini_end":          0.661,
            "car_ownership_start": 0.93,
            "car_ownership_end":   0.63,
            "robotaxi_end":      0.10,
        },
    }

    path = os.path.join(out_dir, "meta.json")
    with open(path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  ✓ Wrote meta to {path}")
    return meta

def build_manifest(out_dir):
    """Write manifest.json with file list + sizes."""
    files = {}
    total = 0
    for fname in sorted(os.listdir(out_dir)):
        if fname.endswith(".json") and fname != "manifest.json":
            path = os.path.join(out_dir, fname)
            size = os.path.getsize(path)
            total += size
            with open(path, "rb") as f:
                md5 = hashlib.md5(f.read()).hexdigest()
            files[fname] = {"size_bytes": size, "md5": md5}

    manifest = {
        "generated_at":  time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_bytes":   total,
        "total_mb":      round(total / 1024 / 1024, 2),
        "files":         files,
        "load_order":    ["meta.json", "world.json", "phenomena.json",
                          "social_graph.json", "agents.json",
                          "buildings.json", "transactions.json"],
    }
    path = os.path.join(out_dir, "manifest.json")
    with open(path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n  ✓ Manifest: {len(files)} files, {manifest['total_mb']} MB total")
    return manifest

def main():
    args = parse_args()
    out_dir = os.path.join(SCRIPT_DIR, args.out_dir)
    sim_dir_abs = os.path.join(SCRIPT_DIR, args.sim_dir)
    os.makedirs(out_dir, exist_ok=True)

    print(f"FrictionlessSimAI Data Pipeline")
    print(f"  Sim:    {sim_dir_abs}")
    print(f"  Output: {out_dir}")
    print(f"  Step:   {args.step}")

    run_all = args.step == "all"

    if run_all or args.step == "agents":
        step("Derive Agent History",
             derive_all_agents,
             os.path.join(out_dir, "agents.json"))

    if run_all or args.step == "phenomena":
        step("Detect Phenomena + Timeseries",
             derive_phenomena,
             os.path.join(out_dir, "phenomena.json"))

    if run_all or args.step == "social":
        step("Build Social Graph",
             build_social_graph,
             os.path.join(out_dir, "social_graph.json"))

    if run_all or args.step == "transactions":
        step("Build Transaction Index",
             build_transactions,
             os.path.join(out_dir, "transactions.json"))

    if run_all or args.step == "buildings":
        # Buildings depend on agents.json being ready
        agents_path = os.path.join(out_dir, "agents.json")
        if not os.path.exists(agents_path):
            print("  [buildings] agents.json not found, running agents step first")
            step("Derive Agent History", derive_all_agents, agents_path)
        step("Derive Building States",
             derive_buildings,
             agents_path,
             os.path.join(out_dir, "buildings.json"))

    if run_all or args.step == "world":
        step("Build World Layout", build_world_json, out_dir)

    if run_all or args.step == "meta":
        step("Build Metadata", build_meta_json, out_dir, sim_dir_abs)

    if run_all:
        step("Build Manifest", build_manifest, out_dir)

    print("\n✓ Pipeline complete.")

if __name__ == "__main__":
    main()
