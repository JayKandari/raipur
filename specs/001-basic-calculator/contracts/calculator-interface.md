# Calculator Interface Contract

**Date**: 2026-10-29 | **Feature**: Basic Arithmetic Calculator | **Phase**: Phase 1

## Overview

This contract defines the interface between the calculation engine (business logic) and the UI layer. Separates concerns: calculation logic (testable, framework-agnostic) from DOM manipulation (browser-specific).

---

## Core Calculation Engine API

The calculator engine exports pure functions that accept numbers and return results. **These functions are independently testable and have no UI dependencies.**

### Function: `add(a: number, b: number): number`

**Purpose**: Add two numbers

**Input**:
- `a`: number (integer, decimal, positive, negative)
- `b`: number (integer, decimal, positive, negative)

**Output**: `number` (sum of a + b)

**Behavior**:
- Returns raw JavaScript sum (0.1 + 0.2 = 0.30000000000000004)
- Throws or returns NaN if inputs are not valid numbers

**Example**:
```javascript
add(5, 3)           // → 8
add(2.5, 1.5)       // → 4.0
add(-5, -3)         // → -8
add(0.1, 0.2)       // → 0.30000000000000004 (raw result)
```

---

### Function: `subtract(a: number, b: number): number`

**Purpose**: Subtract b from a

**Input**:
- `a`: number
- `b`: number

**Output**: `number` (a − b)

**Example**:
```javascript
subtract(10, 4)     // → 6
subtract(5, 10)     // → -5
subtract(-5, -3)    // → -2
```

---

### Function: `multiply(a: number, b: number): number`

**Purpose**: Multiply two numbers

**Input**:
- `a`: number
- `b`: number

**Output**: `number` (a × b)

**Example**:
```javascript
multiply(6, 7)      // → 42
multiply(2.5, 4)    // → 10
multiply(-3, 4)     // → -12
```

---

### Function: `divide(a: number, b: number): number | Error`

**Purpose**: Divide a by b

**Input**:
- `a`: number (numerator)
- `b`: number (denominator; must not be zero)

**Output**: 
- `number` if b !== 0
- `Error` or `NaN` if b === 0 (implementation decides; UI layer handles)

**Behavior**:
- Returns raw JavaScript division result
- Caller must check for Infinity or NaN before displaying

**Example**:
```javascript
divide(20, 4)       // → 5
divide(1, 3)        // → 0.3333333333333333
divide(5, 0)        // → Infinity (or throw; UI decides error handling)
```

---

### Function: `formatResult(value: number, precision?: number): string`

**Purpose**: Format raw calculation result for display

**Input**:
- `value`: number (raw result)
- `precision`: number (optional, default 10) — max decimal places to show

**Output**: `string` (display-friendly representation)

**Behavior**:
- Removes trailing zeros (7.0 → "7")
- Caps decimal places (0.30000000000000004 → "0.3")
- Returns "Infinity" or "NaN" as strings if input is invalid
- Uses standard notation (no scientific notation)

**Example**:
```javascript
formatResult(0.30000000000000004)    // → "0.3"
formatResult(7)                      // → "7"
formatResult(7.0)                    // → "7"
formatResult(1/3)                    // → "0.3333333333"
formatResult(1/0)                    // → "Infinity"
```

---

### Function: `validateInput(input: string): { valid: boolean, value?: number, error?: string }`

**Purpose**: Parse and validate user input

**Input**:
- `input`: string (raw user input from form field)

**Output**: 
```javascript
{
  valid: boolean,
  value: number | undefined,  // only if valid === true
  error: string | undefined   // only if valid === false
}
```

**Validation Rules**:
- Trim whitespace
- Must parse as a valid number (integers, decimals, negatives)
- Reject scientific notation (or accept per task decision)
- Reject empty strings, non-numeric characters
- Accept leading/trailing whitespace (strip and retry)

**Example**:
```javascript
validateInput("5")              // → { valid: true, value: 5 }
validateInput("5.5")            // → { valid: true, value: 5.5 }
validateInput("-5")             // → { valid: true, value: -5 }
validateInput("  5.5  ")        // → { valid: true, value: 5.5 }
validateInput("abc")            // → { valid: false, error: "Invalid number" }
validateInput("")               // → { valid: false, error: "Please enter a number" }
```

---

## UI Interaction Flow

### Input Capture

**Inputs**: Two HTML `<input type="number">` fields (or `<input type="text">` with validation)

**On User Entry**:
1. Capture raw text from field
2. Call `validateInput(raw_text)`
3. If valid: store parsed value; clear any error display
4. If invalid: display error message; do not update stored value

---

### Operation Selection

**UI**: Dropdown `<select>` or button group with options (+, −, ×, ÷)

**On Selection**:
1. Store selected operation symbol
2. Enable submit button (if both operands present)

---

### Submit & Calculate

**On Submit Button Click**:
1. Validate operand1 is present and valid
2. Validate operation is selected
3. Validate operand2 is present and valid
4. If operation is division: check operand2 !== 0 (reject if zero)
5. Call appropriate calculation function: `add()`, `subtract()`, `multiply()`, or `divide()`
6. Check result for Infinity/NaN:
   - If error state: display error message ("Cannot divide by zero")
   - If valid: format with `formatResult()` and display
7. Display result in results area

---

### Clear & Reset

**On Clear Button Click**:
1. Reset input1 field to empty
2. Reset input2 field to empty
3. Reset operation selector to default (no selection)
4. Clear results area
5. Clear any error message
6. Return focus to input1 field

---

## Example Calculation Flow (End-to-End)

```
User enters "5" in input1
  → validateInput("5") → { valid: true, value: 5 }
  → Store operand1 = 5

User selects "+" from operation dropdown
  → Store operation = "+"
  → Enable submit button

User enters "3" in input2
  → validateInput("3") → { valid: true, value: 3 }
  → Store operand2 = 3

User clicks submit
  → add(5, 3) → 8
  → formatResult(8) → "8"
  → Display "8" in results area

User clicks clear
  → input1.value = ""
  → input2.value = ""
  → operation.value = ""
  → results.textContent = ""
  → Focus input1
```

---

## Error States

| Scenario | Error Message | How to Fix |
|----------|---------------|-----------|
| User enters "abc" in input1 | "Please enter a valid number" | Clear field, enter numeric value |
| User clicks submit without entering operand1 | "Please enter both numbers" | Enter values in both input fields |
| User clicks submit without selecting operation | "Please select an operation" | Choose +, −, ×, or ÷ |
| User enters "5" and "0" with ÷ operation | "Cannot divide by zero" | Change operand2 or choose different operation |
| User clicks submit with no inputs | "Nothing to calculate" | Enter two numbers and select an operation |

---

## Testing Implications

### Unit Tests (for calculation engine)

Tests should verify:
- `add(5, 3) === 8`
- `add(0.1, 0.2)` close to 0.3 (within floating-point tolerance)
- `divide(20, 4) === 5`
- `divide(5, 0)` returns Infinity or throws error
- `formatResult(0.30000000000000004) === "0.3"`
- `validateInput("5") → { valid: true, value: 5 }`
- `validateInput("abc") → { valid: false, error: "..." }`

### Integration Tests (for UI + engine together)

Tests should verify:
- Entering two numbers and clicking submit displays result
- Entering invalid input shows error message
- Clicking clear resets all fields
- Division by zero shows error (not crash)

### Manual Tests (smoke test in browser)

- Open calculator in Chrome, Firefox, Safari
- Perform calculations: 5+3, 10−4, 6×7, 20÷4
- Verify results display correctly and instantly
- Test error cases: invalid input, division by zero
- Verify clear button works
- Verify responsive design on mobile (portrait/landscape)

