"""
build_social_graph.py
Builds the social graph from all agents' relationships.json files.
Deduplicates edges (A→B and B→A become one edge).
Computes graph analytics: degree, clustering, centrality.
"""

import json
import glob
import os
import sys

SIM_DIR = os.path.join(os.path.dirname(__file__), "../frictionless-sim")

def load_all_relationships():
    """Load all relationship files."""
    rels = {}
    for path in glob.glob(f"{SIM_DIR}/agents/*/relationships.json"):
        agent_id = path.split("/")[-2]
        r = json.load(open(path))
        rels[agent_id] = r
    return rels

def build_graph(rels):
    """Build deduplicated edge list."""
    edges = {}     # (a, b) -> edge data, where a < b lexically
    nodes = {}

    for agent_id, rel in rels.items():
        connections = rel.get("connections", [])
        for conn in connections:
            target = conn.get("agent_id")
            if not target:
                continue
            # Normalize edge direction
            a, b = (agent_id, target) if agent_id < target else (target, agent_id)
            key = (a, b)
            trust = conn.get("trust", 0)
            rel_type = conn.get("type", "professional")
            ctx = conn.get("context", conn.get("name", ""))

            if key not in edges:
                edges[key] = {
                    "source":      a,
                    "target":      b,
                    "trust":       trust,
                    "type":        rel_type,
                    "context":     ctx,
                }
            else:
                # Average trust from both directions
                edges[key]["trust"] = round((edges[key]["trust"] + trust) / 2, 3)

        # Power structure
        power_over  = rel.get("power_over", [])
        power_under = rel.get("power_under", [])
        obligations = rel.get("obligations", [])
        nodes[agent_id] = {
            "agent_id":    agent_id,
            "power_over":  power_over,
            "power_under": power_under,
            "obligations": obligations,
        }

    return list(edges.values()), nodes

def compute_degree(edges, all_agents):
    """Compute degree (connection count) per agent."""
    degree = {a: 0 for a in all_agents}
    for e in edges:
        degree[e["source"]] = degree.get(e["source"], 0) + 1
        degree[e["target"]] = degree.get(e["target"], 0) + 1
    return degree

def compute_avg_trust(edges, all_agents):
    """Compute average trust per agent."""
    trust_sum   = {a: 0.0 for a in all_agents}
    trust_count = {a: 0   for a in all_agents}
    for e in edges:
        trust_sum[e["source"]]   += e["trust"]
        trust_count[e["source"]] += 1
        trust_sum[e["target"]]   += e["trust"]
        trust_count[e["target"]] += 1
    return {a: round(trust_sum[a] / trust_count[a], 3) if trust_count[a] > 0 else 0
            for a in all_agents}

def identify_clusters(edges, all_agents):
    """Simple connected-component clustering (union-find)."""
    parent = {a: a for a in all_agents}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    for e in edges:
        if e["trust"] >= 0.45:   # only link on meaningful trust
            union(e["source"], e["target"])

    clusters = {}
    for a in all_agents:
        root = find(a)
        clusters.setdefault(root, []).append(a)

    return [c for c in clusters.values() if len(c) > 1]

def build_social_graph(output_path):
    """Main: build and write social graph."""
    rels = load_all_relationships()
    agent_index = json.load(open(f"{SIM_DIR}/agents/index.json"))
    all_agents = [a["id"] for a in agent_index]

    edges, power_nodes = build_graph(rels)
    degree     = compute_degree(edges, all_agents)
    avg_trust  = compute_avg_trust(edges, all_agents)
    clusters   = identify_clusters(edges, all_agents)

    # Build node list with analytics
    nodes = []
    for a in agent_index:
        aid = a["id"]
        pn  = power_nodes.get(aid, {})
        nodes.append({
            "id":          aid,
            "name":        a["name"],
            "tier":        a["tier"],
            "sector":      a["sector"],
            "degree":      degree.get(aid, 0),
            "avg_trust":   avg_trust.get(aid, 0),
            "power_over":  pn.get("power_over", []),
            "power_under": pn.get("power_under", []),
            "obligations": pn.get("obligations", []),
        })

    result = {
        "nodes":   nodes,
        "edges":   edges,
        "clusters": clusters,
        "stats": {
            "total_nodes":   len(nodes),
            "total_edges":   len(edges),
            "avg_degree":    round(sum(degree.values()) / len(degree), 2) if degree else 0,
            "trust_range":   [round(min(e["trust"] for e in edges), 2),
                              round(max(e["trust"] for e in edges), 2)] if edges else [0, 0],
            "cluster_count": len(clusters),
            "largest_cluster_size": max(len(c) for c in clusters) if clusters else 0,
        },
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✓ {len(nodes)} nodes, {len(edges)} edges, {len(clusters)} clusters")
    print(f"  ✓ Wrote to {output_path}")
    return result


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "../viz-data/social_graph.json"
    build_social_graph(out)
