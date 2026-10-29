---

description: "Task list for Basic Arithmetic Calculator"
---

# Tasks: Basic Arithmetic Calculator

**Input**: Design documents from `/specs/001-basic-calculator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/calculator-interface.md, quickstart.md

**Tests**: Included. Constitution Principle III (Testability) and the user's "rules and testing before committing" requirement call for unit tests on the calculation engine. Framework choice resolved here (deferred from plan): Node built-in `node:test` + `node:assert/strict`. Zero dependencies, honors Principle I (Simplicity).

**Organization**: Tasks grouped by user story. US1 = P1 (MVP), US2 = P2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 or US2
- Paths are repo-root relative (static site: no `src/`, per plan.md)

## Path Conventions

- `index.html`, `styles.css`, `calculator.js` (logic, DOM-free), `app.js` (DOM wiring) at repo root (Netlify serves root as-is, no build step)
- `tests/calculator.test.js` for engine unit tests
- `calculator.js` MUST be dual-use: attach to `window.Calculator` in browser AND `module.exports` in Node, so `node --test` can import it without a DOM (Principle III)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project skeleton and local run/test workflow

- [X] T001 Create empty `index.html`, `styles.css`, `calculator.js`, `app.js`, and `tests/calculator.test.js` at repo root per plan.md Source Code layout (plus `app.js`)
- [X] T002 [P] Create `package.json` at repo root with `"private": true`, NO dependencies, and scripts `"test": "node --test tests/"` and `"start": "python3 -m http.server 8000"`
- [X] T003 [P] Create `README.md` at repo root documenting: local run (`npm start` then open http://localhost:8000), run tests (`npm test`), deploy (push to the branch Netlify is connected to; no build command, publish directory is repo root)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Page shell and dual-use module scaffold that both stories build on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Write `calculator.js` module scaffold: an IIFE that builds a `Calculator` object and exports via `module.exports` when `typeof module !== 'undefined'`, otherwise assigns `window.Calculator`; no functions implemented yet
- [X] T005 Write `index.html` shell: `<meta name="viewport" content="width=device-width, initial-scale=1">`, link `styles.css`, load `calculator.js` then `app.js` with `<script>` tags at end of body; create empty `app.js` (all DOM wiring lives here so `calculator.js` stays DOM-free; adds one file beyond the plan.md layout)
- [X] T006 [P] Write base responsive layout in `styles.css`: mobile-first single column, max-width container centered on desktop, no horizontal scroll at 320px width, `.error` and `.result` style hooks

**Checkpoint**: Page loads with empty shell; `require('./calculator.js')` works in Node

---

## Phase 3: User Story 1 - Perform Basic Arithmetic Operations (Priority: P1) MVP

**Goal**: User enters two numbers, selects an operation, submits, and sees a correct result or a clear error.

**Independent Test**: Run `npm test` (engine) and quickstart.md Scenarios 1-9 and 11 in a browser.

### Tests for User Story 1 (write FIRST, confirm they FAIL)

- [X] T007 [P] [US1] In `tests/calculator.test.js`, add tests for `add`, `subtract`, `multiply`, `divide` using spec examples: 5+3=8, 10-4=6, 6*7=42, 20/4=5, 2.5+1.5=4, -5+-3=-8, -5-10=-15, 999999+1=1000000
- [X] T008 [P] [US1] In `tests/calculator.test.js`, add tests for `formatResult`: `formatResult(0.30000000000000004) === "0.3"`, `formatResult(7) === "7"`, `formatResult(1/3) === "0.3333333333"` (10 decimal places max)
- [X] T009 [P] [US1] In `tests/calculator.test.js`, add tests for `validateInput`: "5"→valid 5, "5.5"→valid 5.5, "-5"→valid -5, "  5.5  "→valid 5.5, "007"→valid 7, "abc"→invalid, ""→invalid, "Infinity"→invalid, "NaN"→invalid
- [X] T010 [P] [US1] In `tests/calculator.test.js`, add tests for `calculate(rawA, op, rawB)` returning `{ok:true, formatted}` or `{ok:false, error:{type,message,guidance}}` covering every error row in data-model.md: INVALID_INPUT, DIVISION_BY_ZERO, MISSING_OPERAND, MISSING_OPERATION, EMPTY_SUBMIT

### Implementation for User Story 1

- [X] T011 [US1] Implement `validateInput(input)` in `calculator.js` returning `{valid, value?, error?}`. Rules (data-model.md Operand): trim whitespace; accept integers, decimals, negatives; "Empty input → error state"; reject Infinity and NaN; reject scientific notation (per contract default); leading zeros parse as numbers (007 → 7)
- [X] T012 [P] [US1] Implement `add`, `subtract`, `multiply`, `divide` in `calculator.js` as pure functions returning raw JS results; `divide` returns `Infinity` on zero denominator (UI layer maps to error, per contract)
- [X] T013 [US1] Implement `formatResult(value, precision = 10)` in `calculator.js`. Rules (data-model.md Result): "Truncate trailing zeros (7.0 → "7", not "7.0")", "Cap decimal places at 10 for display", "Use standard numeric notation (no scientific notation in output)"
- [X] T014 [US1] Implement `calculate(rawA, op, rawB)` in `calculator.js` applying data-model.md Validation Logic order: both empty and no op → EMPTY_SUBMIT; operand1 invalid → INVALID_INPUT; operation missing → MISSING_OPERATION; operand2 invalid → INVALID_INPUT; `÷` with operand2 === 0 → DIVISION_BY_ZERO; else compute and format. Error messages verbatim from data-model.md: "Please enter a valid number", "Cannot divide by zero", "Please enter both numbers", "Please select an operation", "Nothing to calculate", each with its Guidance text
- [X] T015 [US1] Add form markup to `index.html`: two `<input type="text" inputmode="decimal">` fields with `<label>`s ("Number 1", "Number 2"), `<select>` with options `+`, `−`, `×`, `÷` plus an empty default option, a Submit button, and a results region with `aria-live="polite"` and `role="status"`
- [X] T016 [US1] Wire the Submit handler in `app.js`: read fields, call `Calculator.calculate`, render formatted result into the results region, or render `message` + `guidance` with the `.error` class; never throw to the console
- [X] T017 [P] [US1] Style inputs, select, button, result, and error states in `styles.css`; touch targets at least 44px tall; error text visually distinct and not color-only
- [X] T018 [US1] Run `npm test` until T007-T010 pass, then run quickstart.md Scenarios 1-9 and 11 in a browser via `npm start`

**Checkpoint**: US1 fully functional and independently testable. This is the MVP.

---

## Phase 4: User Story 2 - Clear and Recalculate (Priority: P2)

**Goal**: One action resets inputs, operation, and results.

**Independent Test**: quickstart.md Scenario 10.

### Tests for User Story 2

- [X] T019 [P] [US2] In `tests/calculator.test.js`, add a test for a DOM-free `initialState()` helper returning empty operands, no operation, no result, no error (Clear Flow in data-model.md: "Reset all fields to empty/default state")

### Implementation for User Story 2

- [X] T020 [US2] Implement `initialState()` in `calculator.js` returning `{operand1: '', operand2: '', operation: '', result: null, error: null}`
- [X] T021 [US2] Add a Clear button to `index.html` next to Submit
- [X] T022 [US2] Wire the Clear handler in `app.js` (use `Calculator.initialState()`): reset both inputs, reset the select to the empty option, empty the results region, remove any error styling, return focus to the first input
- [X] T023 [US2] Run quickstart.md Scenario 10 in a browser

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation before commit and push

- [X] T024 [P] Open the page once at normal desktop width and once at a basic phone width; confirm it is usable with no horizontal scroll (no specific device or size testing; lint and type checking are deferred by user decision)
- [ ] T025 [P] Confirm the browser console shows zero errors across all quickstart scenarios
- [ ] T026 Walk `specs/001-basic-calculator/checklists/test-coverage.md` and mark items reviewed; add any gaps found (for example scientific notation and very large numbers, which spec.md leaves undefined) to spec.md Edge Cases
- [ ] T027 Run `npm test` one last time; all green is the commit gate. Then commit and push so Netlify deploys, and smoke-test 5 + 3 = 8 on the live URL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: after Setup; blocks both stories
- **US1 (Phase 3)**: after Foundational
- **US2 (Phase 4)**: after Foundational; touches the same files as US1 (`index.html`, `calculator.js`, `styles.css`), so run it after US1 to avoid merge conflicts even though it is logically independent
- **Polish (Phase 5)**: after both stories

### Within Each Story

- Tests first and failing, then engine functions, then markup, then wiring, then styling
- T011 before T014 (calculate uses validateInput); T012 and T013 before T014
- T015 before T016; T016 before T018

### Parallel Opportunities

- T002 and T003 together
- T006 alongside T004/T005
- T007, T008, T009, T010 together (same file but independent test blocks; coordinate edits)
- T012 alongside T011
- T017 alongside T015/T016
- T024 and T025 together

---

## Parallel Example: User Story 1

```text
# Tests together:
Task: "add/subtract/multiply/divide tests in tests/calculator.test.js"
Task: "formatResult tests in tests/calculator.test.js"
Task: "validateInput tests in tests/calculator.test.js"
Task: "calculate error-path tests in tests/calculator.test.js"

# Then engine pieces:
Task: "validateInput in calculator.js"
Task: "arithmetic functions in calculator.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup, Phase 2 Foundational
2. Phase 3 US1
3. STOP and validate: `npm test` plus quickstart scenarios 1-9, 11
4. Commit and push to deploy; this alone is a working calculator

### Incremental Delivery

1. Setup + Foundational
2. US1, validate, deploy (MVP)
3. US2, validate, deploy
4. Polish, final gate, deploy

---

## Notes

- Engine functions stay DOM-free so `npm test` needs no browser (Constitution III)
- No dependencies, no build step (Constitution I; Netlify serves files directly)
- Test framework deferred in plan.md is resolved here as `node:test`; revisit only if Jest is wanted later
- Open spec gaps carried to T026: scientific notation input, upper bound on number size
- Commit after each task or logical group
