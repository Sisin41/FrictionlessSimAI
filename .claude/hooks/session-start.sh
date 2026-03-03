#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code on the web environment
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "Setting up Frictionless Sim AI environment..."

# Python3 is the only runtime dependency — verify it's available
if ! command -v python3 &>/dev/null; then
  echo "ERROR: python3 not found"
  exit 1
fi

echo "python3: $(python3 --version)"

# Ensure the frictionless-sim agents index exists (idempotent check)
PROJ_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
SIM_DIR="$PROJ_DIR/frictionless-sim"
if [ ! -f "$SIM_DIR/agents/index.json" ]; then
  echo "Generating agents..."
  cd "$SIM_DIR" && python3 generate_agents.py
fi

if [ ! -d "$SIM_DIR/.claude/agents" ] || [ -z "$(ls -A "$SIM_DIR/.claude/agents" 2>/dev/null)" ]; then
  echo "Generating subagents..."
  cd "$SIM_DIR" && python3 generate_subagents.py
fi

echo "Environment ready."
