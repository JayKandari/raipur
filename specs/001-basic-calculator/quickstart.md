# Quickstart & Validation Guide: Basic Arithmetic Calculator

**Date**: 2026-10-29 | **Feature**: Basic Arithmetic Calculator | **Phase**: Phase 1

## Overview

This guide provides step-by-step instructions to set up, run, and validate the calculator locally before deploying to Netlify.

---

## Prerequisites

- Text editor (VS Code, Sublime, or any editor)
- Web browser (Chrome, Firefox, Safari, or Edge)
- Git (for version control)
- Node.js 18+ (tests) and Python 3 (local HTTP server via `npm start`)
- Netlify CLI (optional, for advanced deployment; not needed for basic push workflow)

---

## Local Setup & Testing

### Step 1: Clone or Navigate to Repository

```bash
cd /home/jaykandari/projects/raipur
git status
```

**Expected**: Clean working tree (or staged changes ready to commit)

---

### Step 2: Verify File Structure

Confirm the calculator files exist:

```bash
ls -la index.html styles.css calculator.js tests/
```

**Expected Output**:
```
index.html              (main HTML file)
styles.css              (styling)
calculator.js           (calculation logic)
tests/
  calculator.test.js    (unit tests, if created)
README.md               (this file or equivalent)
```

---

### Step 3: Start Local HTTP Server

**Option A: Python 3** (easiest, no installation needed on most systems)
```bash
python -m http.server 8000
```

**Option B: Node.js**
```bash
npx live-server --port=8000
```

**Expected Output**:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

### Step 4: Open Calculator in Browser

Navigate to:
```
http://localhost:8000
```

**Expected**: 
- Page loads without errors (check browser console: F12 → Console tab, should be empty or no red errors)
- Two input fields visible (labeled "Number 1" and "Number 2")
- Operation selector dropdown with +, −, ×, ÷ options
- Submit button and Clear button visible
- Results area is empty initially

---

## Validation Test Scenarios

### Scenario 1: Basic Addition

**Setup**: Page loaded

**Test Steps**:
1. Enter "5" in first input field
2. Enter "3" in second input field
3. Select "+" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "8"

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 2: Subtraction

**Setup**: Page loaded

**Test Steps**:
1. Enter "10" in first input field
2. Enter "4" in second input field
3. Select "−" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "6"

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 3: Multiplication

**Setup**: Page loaded

**Test Steps**:
1. Enter "6" in first input field
2. Enter "7" in second input field
3. Select "×" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "42"

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 4: Division

**Setup**: Page loaded

**Test Steps**:
1. Enter "20" in first input field
2. Enter "4" in second input field
3. Select "÷" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "5"

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 5: Decimal Operations

**Setup**: Page loaded

**Test Steps**:
1. Enter "2.5" in first input field
2. Enter "1.5" in second input field
3. Select "+" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "4"

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 6: Negative Numbers

**Setup**: Page loaded

**Test Steps**:
1. Enter "−5" in first input field
2. Enter "−3" in second input field
3. Select "+" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "−8"

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 7: Division by Zero (Error Handling)

**Setup**: Page loaded

**Test Steps**:
1. Enter "5" in first input field
2. Enter "0" in second input field
3. Select "÷" from operation dropdown
4. Click Submit

**Expected Result**: Error message appears (e.g., "Cannot divide by zero") instead of crash

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 8: Invalid Input (Non-Numeric)

**Setup**: Page loaded

**Test Steps**:
1. Enter "abc" in first input field
2. Enter "5" in second input field
3. Select "+" from operation dropdown
4. Click Submit

**Expected Result**: Error message appears (e.g., "Please enter a valid number")

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 9: Empty Input

**Setup**: Page loaded

**Test Steps**:
1. Leave both input fields empty
2. Select "+" from operation dropdown
3. Click Submit

**Expected Result**: Error message appears (e.g., "Please enter both numbers")

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 10: Clear Button Functionality

**Setup**: 
1. Enter "5" + "3" = "8" (completion of Scenario 1)
2. Results area displays "8"

**Test Steps**:
1. Click Clear button

**Expected Result**: 
- Both input fields are empty
- Operation selector reset to default (no selection)
- Results area is cleared (empty)
- Calculator ready for new calculation

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 11: Floating-Point Precision

**Setup**: Page loaded

**Test Steps**:
1. Enter "0.1" in first input field
2. Enter "0.2" in second input field
3. Select "+" from operation dropdown
4. Click Submit

**Expected Result**: Results area displays "0.3" (not "0.30000000000000004")

**Notes**: This tests the `formatResult()` function; core calculation may return raw 0.30000000000000004, but UI should display 0.3

**Pass/Fail**: ☐ Pass ☐ Fail

---

### Scenario 12: Responsive Design (Mobile)

**Setup**: Page loaded

**Test Steps** (one normal desktop width, one basic phone width; no specific device needed):
1. Open the page at a normal wide desktop window size and confirm it looks usable
2. Narrow the window to about 360px wide (or open on any phone)
3. Perform Scenario 1 (5 + 3)

**Expected Result**: 
- Calculator layout remains usable on mobile screen
- Input fields, buttons, results area are all visible and clickable
- No horizontal scrolling required
- Text is readable (font size appropriate)

**Pass/Fail**: ☐ Pass ☐ Fail

---

## Running Unit Tests (if implemented)

**Prerequisites**: Node.js 18+ (uses the built-in `node:test` runner; no install step)

```bash
npm test
# or
npm run test:unit
```

**Expected**: All tests pass and the summary shows `# fail 0` (the listing below is only an illustration; the real output is the Node test runner's report):
```
PASS  tests/calculator.test.js
  ✓ add(5, 3) equals 8
  ✓ add(0.1, 0.2) approximately equals 0.3
  ✓ subtract(10, 4) equals 6
  ✓ multiply(6, 7) equals 42
  ✓ divide(20, 4) equals 5
  ✓ divide(5, 0) returns Infinity
  ✓ formatResult(0.30000000000000004) equals "0.3"
  ✓ validateInput("5") returns { valid: true, value: 5 }
  ✓ validateInput("abc") returns { valid: false }

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

---

## Deployment to Netlify

### Step 1: Commit Changes Locally

```bash
git add .
git commit -m "feat: implement basic arithmetic calculator"
```

### Step 2: Push to Repository

```bash
git push origin main
# or
git push origin 001-basic-calculator  # if working on feature branch
```

### Step 3: Netlify Auto-Deploy

Once pushed to main (or configured branch):
- Netlify automatically detects the push
- Builds the static site (no build step needed for vanilla JS)
- Deploys to live URL (e.g., https://your-project.netlify.app)
- New deploy takes 1−2 minutes

**Verification**:
1. Check Netlify dashboard for deploy status
2. Open deployed URL in browser
3. Perform quick smoke test (5 + 3 = 8) on live site

### Step 4: Manual Deploy (if needed)

If auto-deploy not configured, use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Validation Checklist

Complete before marking feature as "ready to merge":

- [ ] All 12 test scenarios pass locally
- [ ] Browser console (F12) shows no errors
- [ ] Mobile responsive design verified (no horizontal scroll)
- [ ] Unit tests pass (if implemented)
- [ ] Code follows constitutional guidelines (Simplicity, Correctness, Testability)
- [ ] Changes committed with descriptive message
- [ ] Pushed to repository
- [ ] Netlify deployment successful
- [ ] Smoke test performed on live deployment
- [ ] No regressions in other features (if any exist)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found" error in console | Ensure all `.js` files are in correct paths; check HTML script tags point to correct files |
| Results show "NaN" or "Infinity" | Check `formatResult()` function handles edge cases; review error handling for division by zero |
| Input field doesn't accept negative numbers | Use text input or explicitly handle minus sign in validation |
| Clear button doesn't work | Verify event listener attached to button; ensure DOM element IDs match |
| Responsive design breaks on mobile | Add media queries to `styles.css`; use viewport meta tag in HTML `<head>` |
| Netlify deploy fails | Check `.gitignore` not excluding necessary files; verify no build errors in local server |

---

## Reference

See [Data Model](data-model.md) for entity definitions and state transitions.

See [Calculator Interface Contract](contracts/calculator-interface.md) for calculation engine API and UI interaction flow.

