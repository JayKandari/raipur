# Research & Technical Decisions: Basic Arithmetic Calculator

**Date**: 2026-10-29 | **Feature**: Basic Arithmetic Calculator | **Phase**: Phase 0

## Summary

All technical unknowns resolved. Feature uses vanilla HTML/CSS/JS with no external dependencies, deployed as static site to Netlify. Testing approach resolved in the tasks phase: `node:test` unit tests for the engine plus manual browser checks.

---

## Resolved Decisions

### 1. Framework & Bundler Choice

**Decision**: Vanilla HTML/CSS/JavaScript (no framework, no bundler)

**Rationale**: 
- Aligns with Raipur Constitution principle of Simplicity ("start minimal, no unnecessary complexity")
- Netlify deployment requires static files; vanilla JS is fastest path to deployment
- Zero dependencies reduces maintenance burden
- Simple app scope doesn't justify framework overhead

**Alternatives Considered**:
- React: Over-engineered for single calculator; adds build step and dependency management
- Vue/Svelte: Same over-engineering concern
- jQuery: Outdated; ES6 vanilla JS is simpler and more maintainable

**Decision Quality**: HIGH (strongly aligned with constitution and user's "push on demand" workflow)

---

### 2. Testing Framework

**Decision**: Node's built-in test runner (`node:test`, Node 18+), resolved in the tasks phase. No dependencies; run with `npm test`. UI is checked by hand in a browser.

**Options Under Consideration**:
- **Option A**: Jest + vanilla JS unit tests (recommended by Raipur Constitution's Testability principle)
- **Option B**: Manual browser testing only (simplest, fastest initial ship)
- **Option C**: Both Jest + manual smoke tests (comprehensive but higher effort)

**Rationale for Deferral**: User acknowledged during `/speckit-clarify` that testing rules are TBD ("what exactly i amnot sure atm"). Will be specified during task breakdown. Constitution requires testability but defers framework choice to implementer.

**Re-assess During**: `/speckit-tasks` phase

---

### 3. Precision Handling for Decimals

**Decision**: Use JavaScript's native floating-point precision; display user-friendly rounding where needed

**Rationale**:
- Spec acknowledges "JavaScript default floating-point behavior is acceptable"
- Built-in `Math.round()` or `.toFixed()` for display formatting (e.g., 0.1 + 0.2 shows as 0.3)
- Core calculation engine returns raw result; UI layer formats for display

**Example**:
```javascript
// Core logic: returns raw result
function add(a, b) { return a + b; }

// Display logic: format for user
function formatResult(raw) { return parseFloat(raw.toFixed(10)); }
```

**Alternatives Considered**:
- BigDecimal library: Overkill for MVP; adds dependency
- Always display X decimal places: Hides precision issues; confusing for users

---

### 4. Deployment & Local Testing Workflow

**Decision**: Static HTML/CSS/JS → Netlify; local testing via live-server or simple `python -m http.server`

**Rationale**:
- User: "i have deployed this repo in netlify so the output should be accordingly"
- No backend server needed; all logic runs client-side
- Local testing: open index.html in browser or spin up local HTTP server (no build step required)
- Push workflow: git commit → push → Netlify auto-deploys from main branch

**Setup Instructions** (to be detailed in quickstart.md):
```bash
# Local testing
python -m http.server 8000  # or npx live-server
# Then open http://localhost:8000 in browser

# Deploy
git add .
git commit -m "..."
git push origin main  # Netlify auto-builds & deploys
```

---

### 5. Browser Compatibility

**Decision**: Support modern browsers (Chrome, Firefox, Safari, Edge) with ES6 support

**Rationale**:
- ES6 (2015) is 9+ years old; all modern browsers support it
- No need for IE11 or older polyfills (spec doesn't mention legacy support)
- Responsive CSS for mobile + desktop (user mentioned local testing)

**Minimum Versions**: Chrome 51+, Firefox 54+, Safari 10+, Edge 15+

---

### 6. Storage & Persistence

**Decision**: **DEFER** to future enhancement

**Rationale**:
- MVP spec makes no mention of calculation history or persistence
- Future enhancement can add localStorage for optional history
- Current design places no artificial barriers to this extension

---

## Assumptions Locked In

1. ✓ No user authentication required
2. ✓ Single-user, client-side only
3. ✓ No backend API or database
4. ✓ Responsive design (mobile + desktop)
5. ✓ Static site deployment model

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Testing approach TBD | Defer to tasks phase; constitutional Testability principle guides implementation |
| Floating-point precision edge cases | Document in spec assumptions; handle via display formatting; comprehensive test scenarios |
| Netlify deployment misconfiguration | Include `netlify.toml` or `_redirects` (if needed); document deployment step-by-step in quickstart |

---

## Next Phase

All clarifications resolved. Ready for Phase 1 design (data model, contracts, quickstart).
