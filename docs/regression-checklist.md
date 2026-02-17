# Mode Transition Regression Checklist

Run this after refactors that touch view modes, layout mode, hit testing, or URI state.

## Automated

1. Run `npm run check:regression`.
2. Confirm it passes build + source guards.

## Manual

1. Start app in 2D mode and create several nodes.
2. Switch to 3D mode.
3. Confirm nodes remain visible in 3D.
4. Hold Shift in 3D and confirm guide nodes appear.
5. Shift-click in 3D and confirm node activation/creation works.
6. Enter Layout mode from 2D and from 3D.
7. Confirm grid and axes are hidden in Layout mode.
8. Confirm keyboard custom-map edit is not accessible in Layout mode.
9. In Layout mode, click `Reset`.
10. Confirm it returns to a blank 2D mode (not 3D, no freeze banner).
11. Move a custom node and custom line label, then refresh the page.
12. Confirm both manual positions persist after refresh.
13. Use Save & Copy Link, open pasted URL, confirm same persisted positions.

## Optional Console Check

If behavior diverges, check for runtime errors in DevTools before deeper debugging.
