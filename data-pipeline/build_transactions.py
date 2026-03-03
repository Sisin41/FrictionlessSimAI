"""
build_transactions.py
Packages all 168 transactions into a structured index.
- Indexed by tick
- Indexed by agent pair
- Categorized and annotated with reconstruction context from memory/inbox
"""

import json
import glob
import os
import sys

SIM_DIR = os.path.join(os.path.dirname(__file__), "../frictionless-sim")

ALL_TICKS = list(range(15))

TX_TYPE_CATEGORY = {
    "EXCHANGE":           "formal",
    "COMMITMENT":         "formal",
    "TRANSFER":           "formal",
    "SIGNAL":             "informal",
    "ASSOCIATION":        "informal",
    "TRANSFORMATION":     "self",
    "mutual_aid":         "informal",
    "gig_income":         "informal",
    "retraining_grant_application": "institutional",
    "program_confirmation":         "institutional",
    "insurance_purchase":           "formal",
    "grant_disbursement_request":   "institutional",
    "donation":           "informal",
    "mutual_aid_contribution": "informal",
    "savings_deposit":    "self",
    "credential_completion": "self",
    "unknown":            "informal",
}

def load_all_transactions():
    """Load all transaction files."""
    txns = []
    for path in sorted(glob.glob(f"{SIM_DIR}/transactions/resolved/tick_*/*.json")):
        raw = json.load(open(path))
        tick_dir = path.split("/")[-2]
        tick = int(tick_dir.replace("tick_", ""))

        tx_type = raw.get("type", "unknown")
        category = TX_TYPE_CATEGORY.get(tx_type, "informal")

        # Detect informal/mutual-aid by description
        desc = raw.get("description", "").lower()
        if any(kw in desc for kw in ["mutual aid", "donation", "informal", "barter", "swap"]):
            category = "informal"

        # Resources
        resources = raw.get("resources", {})
        amount = resources.get("amount", 0)
        resource_type = resources.get("type", "unknown")

        # Status
        status = raw.get("status", "unknown")
        is_bilateral = status not in ("no_counterparty",)

        txns.append({
            "id":            raw.get("id", os.path.basename(path).replace(".json", "")),
            "tick":          tick,
            "initiator":     raw.get("initiator", ""),
            "target":        raw.get("target", ""),
            "type":          tx_type,
            "category":      category,
            "description":   raw.get("description", raw.get("why_they_accept", ""))[:400],
            "status":        status,
            "is_bilateral":  is_bilateral,
            "amount":        amount,
            "resource_type": resource_type,
        })

    return txns

def load_agent_name_map():
    """Build id → name map."""
    agents = json.load(open(f"{SIM_DIR}/agents/index.json"))
    return {a["id"]: a["name"] for a in agents}

def build_transactions(output_path):
    """Main: package all transactions."""
    txns = load_all_transactions()
    names = load_agent_name_map()

    # Enrich with names
    for tx in txns:
        tx["initiator_name"] = names.get(tx["initiator"], tx["initiator"])
        tx["target_name"]    = names.get(tx["target"],    tx["target"])

    # Build indexes
    by_tick   = {}
    by_agent  = {}
    bilateral = [tx for tx in txns if tx["is_bilateral"]]

    for tx in txns:
        # By tick
        by_tick.setdefault(str(tx["tick"]), []).append(tx["id"])

        # By agent
        for agent_id in [tx["initiator"], tx["target"]]:
            if agent_id:
                by_agent.setdefault(agent_id, []).append(tx["id"])

    # Stats
    by_type = {}
    by_category = {}
    by_status = {}
    for tx in txns:
        by_type[tx["type"]] = by_type.get(tx["type"], 0) + 1
        by_category[tx["category"]] = by_category.get(tx["category"], 0) + 1
        by_status[tx["status"]] = by_status.get(tx["status"], 0) + 1

    result = {
        "transactions":   txns,
        "by_tick_ids":    by_tick,
        "by_agent_ids":   by_agent,
        "stats": {
            "total":               len(txns),
            "bilateral":           len(bilateral),
            "no_counterparty":     len([tx for tx in txns if not tx["is_bilateral"]]),
            "informal_count":      by_category.get("informal", 0),
            "formal_count":        by_category.get("formal", 0),
            "institutional_count": by_category.get("institutional", 0),
            "self_count":          by_category.get("self", 0),
            "by_type":             by_type,
            "by_category":         by_category,
            "by_status":           by_status,
            "ticks_with_transactions": sorted([int(t) for t in by_tick.keys()]),
        },
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✓ {len(txns)} transactions, {len(bilateral)} bilateral")
    print(f"  ✓ Wrote to {output_path}")
    return result


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "../viz-data/transactions.json"
    build_transactions(out)
