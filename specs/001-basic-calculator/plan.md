# Implementation Plan: Basic Arithmetic Calculator

**Branch**: `001-basic-calculator` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-basic-calculator/spec.md`

## Summary

Single-page calculator app (HTML/CSS/JS) performing four basic arithmetic operations with strict correctness and testability (per constitution). Deployed as static site to Netlify; all logic runs client-side. Architecture decouples calculation engine from UI to enable independent testing and future extensibility.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+)

**Primary Dependencies**: None (vanilla JS, no frameworks or build tools)

**Storage**: N/A (no persistence in MVP; future enhancement can use localStorage)

**Testing**: Node's built-in test runner (`node:test`, Node 18+, no dependencies) for the calculation engine via `npm test`; the UI is checked by hand in a browser on a normal desktop width and a basic phone width, with no specific device testing

**Target Platform**: Web browsers (desktop + mobile, responsive)

**Project Type**: Single-page static web app (SPA)

**Performance Goals**: Calculation result display < 100ms after button click (per spec)

**Constraints**: Static site (no server), Netlify deployment, result precision per JavaScript floating-point standard

**Scale/Scope**: Single user, client-side only, MVP with four basic operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **All principles satisfied**:
- **Simplicity**: No frameworks, minimal dependencies, clear component structure (inputs → calculate → display)
- **Correctness**: Calculation logic isolated and testable; edge cases (div by zero, invalid input) handled explicitly
- **Testability**: Core math functions decoupled from DOM; unit tests can run without browser
- **Incremental Enhancement**: Modular structure allows adding operations/features without restructuring core logic

**Deviations from constitution Development Standards (user decision, 2026-10-29)**: linting and type checking are deferred, and multi-screen-size smoke testing is not required. See Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-basic-calculator/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── calculator-interface.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
.
├── index.html           # Main entry point (markup + layout)
├── styles.css           # Styling (mobile-first, one breakpoint)
├── calculator.js        # Calculation engine (pure functions, DOM-free, works in browser and Node)
├── app.js               # DOM wiring (submit and clear handlers)
├── tests/
│   └── calculator.test.js   # Unit tests for the engine (node:test)
├── package.json         # npm scripts only (start, test); no dependencies
├── .gitignore
└── README.md            # Deployment & local testing instructions
```

**Structure Decision**: Single static HTML/CSS/JS app (no bundler, no framework). All calculation logic in `calculator.js` as pure functions, separately testable. DOM wiring lives in `app.js` so the engine stays testable without a browser. UI in `index.html` minimal; styling in `styles.css` (mobile-first responsive). Tests use `node:test` (decided in the tasks phase).

**Open item**: Netlify serves the repo root as-is, so `specs/`, `.specify/`, `.claude/` and `tests/` are published too unless a separate publish directory (for example `public/`) is set. Not changed yet; needs a decision.

## Complexity Tracking

| Deviation | Why Needed | Standard Kept Instead Because |
|-----------|------------|-------------------------------|
| Lint and type checking deferred | User decision for a small toy app | Constitution Development Standards still say they are required; amend the constitution or add them later |
| No multi-screen-size smoke test | User only needs a normal wide desktop and any basic phone | Constitution asks for mobile, tablet and desktop smoke tests; replaced by one desktop-width and one phone-width check |
