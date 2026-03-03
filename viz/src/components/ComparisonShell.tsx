/**
 * ComparisonShell.tsx
 * Side-by-side layout shell for future scenario comparisons.
 * Phase 5: placeholder with "Add Scenario" button.
 */

import { useState } from 'react'

interface Props {
  onClose: () => void
}

export default function ComparisonShell({ onClose }: Props) {
  const [hasSecond, setHasSecond] = useState(false)

  return (
    <div className="comparison-shell">
      <div className="comparison-header">
        <h2>Scenario Comparison</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="comparison-body">
        <div className="comparison-pane">
          <div className="comparison-pane-header">
            <span className="pane-label">Baseline</span>
            <span className="pane-scenario">Millfield — RoboRide Disruption</span>
          </div>
          <div className="comparison-placeholder">
            Current scenario active in main view
          </div>
        </div>

        {hasSecond ? (
          <div className="comparison-pane">
            <div className="comparison-pane-header">
              <span className="pane-label">Alternative</span>
              <span className="pane-scenario">Not loaded</span>
            </div>
            <div className="comparison-placeholder">
              Requires <code>viz-data-b/</code> directory with alternative sim output.
              Run a second simulation with different parameters (e.g., UBI policy,
              retraining subsidy) and place the output in <code>viz-data-b/</code>.
            </div>
          </div>
        ) : (
          <div className="comparison-pane comparison-add">
            <button className="add-scenario-btn" onClick={() => setHasSecond(true)}>
              + Add Scenario
            </button>
            <p className="add-scenario-hint">
              Compare baseline against a policy intervention (UBI, retraining subsidy, etc.)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
