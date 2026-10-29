# Data Model: Basic Arithmetic Calculator

**Date**: 2026-10-29 | **Feature**: Basic Arithmetic Calculator | **Phase**: Phase 1

## Overview

Calculator app operates on simple numeric values and produces results. No persistent data storage in MVP. All state is ephemeral (in-memory, cleared on refresh or user reset).

---

## Core Entities

### Operand

**Purpose**: User-supplied numeric input

**Fields**:
| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `value` | Number | Required; finite | Integer or decimal; positive or negative |
| `raw_input` | String | Optional | Original user input before parsing (for debugging/logging) |

**Validation Rules**:
- Must be a valid number (integers, decimals, negatives accepted)
- Special cases: Infinity → reject; NaN → reject; scientific notation (1e3), hexadecimal/binary (0x10) and a leading "+" → reject; the minus sign "−" is treated as "-"
- Empty input → error state (user must enter value)
- Whitespace → trim before parsing

**Lifecycle**:
1. User types in input field → raw_input captured
2. On submit, parse raw_input → validate → if valid, store value; else, display error
3. User clicks clear → reset to empty

---

### Operation

**Purpose**: Arithmetic operation selector

**Fields**:
| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `symbol` | String (enum) | Required; one of (+, −, ×, ÷) | User-facing display symbol |
| `function` | Function | Required | JavaScript function that performs calculation |

**Valid Values**:
- `+` (addition)
- `−` (subtraction)
- `×` (multiplication)
- `÷` (division)

**Validation Rules**:
- User must select exactly one operation before submit
- Operation selector cannot be empty on submit

**Lifecycle**:
1. User clicks/selects operation → mark as selected
2. User clicks submit → operation applied
3. User clicks clear → operation selector reset to default (empty)

---

### Calculation

**Purpose**: Encapsulates operand pair + operation + result

**Fields**:
| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `operand1` | Operand | Required | First input value |
| `operand2` | Operand | Required | Second input value |
| `operation` | Operation | Required | Selected arithmetic operation |
| `result` | Result | Optional | Computed outcome (null before submit) |
| `error` | Error | Optional | Error state if calculation fails |

**State Transitions**:
```
[Empty] 
  → [Operand1 Entered] (user types in first field)
  → [Operation Selected] (user selects operation)
  → [Operand2 Entered] (user types in second field)
  → [Ready to Submit] (all three required, no errors)
  → [Calculating] (user clicks submit)
  → [Result Display] (success) OR [Error Display] (div by zero, etc.)
  → [Clear] (user clicks clear) → back to [Empty]
```

---

### Result

**Purpose**: Computed calculation outcome

**Fields**:
| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `value` | Number | Required; finite | Mathematical result of operation |
| `raw_value` | Number | Optional | Unrounded JavaScript result (for debugging) |
| `formatted` | String | Required | Display string (e.g., "0.3" not "0.30000000000000004") |

**Formatting Rules**:
- Truncate trailing zeros (7.0 → "7", not "7.0")
- Cap decimal places at 10 for display (0.1 + 0.2 = 0.3, not 0.30000000000000004)
- Use standard numeric notation (no scientific notation in output)

**Lifecycle**:
1. Calculation triggered → compute raw_value
2. Apply formatting rules → formatted string
3. Display to user
4. User can clear and start new calculation, or clear and stop

---

### Error

**Purpose**: Captures invalid states and user-facing error messages

**Fields**:
| Field | Type | Constraint | Notes |
|-------|------|-----------|-------|
| `type` | String (enum) | Required | Error category |
| `message` | String | Required | User-facing explanation |
| `guidance` | String | Optional | How to fix the error |

**Error Types & Messages**:

| Type | Message | Guidance |
|------|---------|----------|
| `INVALID_INPUT` | "Please enter a valid number" | Explain allowed formats (integers, decimals, negatives) |
| `DIVISION_BY_ZERO` | "Cannot divide by zero" | "Enter a non-zero value in the second field" |
| `MISSING_OPERAND` | "Please enter both numbers" | "Fill both input fields before clicking submit" |
| `MISSING_OPERATION` | "Please select an operation" | "Choose +, −, ×, or ÷" |
| `EMPTY_SUBMIT` | "Nothing to calculate" | "Enter two numbers and select an operation" |
| `OUT_OF_RANGE` | "Result is too large" | "Use smaller numbers" |

**Precedence** (first match wins): both operands empty and no operation → `EMPTY_SUBMIT`; operand 1 empty → `MISSING_OPERAND`; operand 1 not a number → `INVALID_INPUT`; no operation → `MISSING_OPERATION`; operand 2 empty → `MISSING_OPERAND`; operand 2 not a number → `INVALID_INPUT`; division by zero → `DIVISION_BY_ZERO`; non-finite result → `OUT_OF_RANGE`.

**Lifecycle**:
1. User action triggers validation → if failure, create Error
2. Display error message to user (replace results area with error)
3. Error clears when user fixes input and resubmits, or clicks clear

---

## Relationships & Dependencies

```
┌──────────────────────────────────────┐
│       Calculation State (Global)     │
├──────────────────────────────────────┤
│  operand1: Operand                   │
│  operation: Operation                │
│  operand2: Operand                   │
│  result: Result (optional)           │
│  error: Error (optional)             │
└──────────────────────────────────────┘
         ↓
         ├─→ Result or Error
         │   (mutually exclusive)
         │
         └─→ UI updates based on state
```

**Invariants**:
- Result and Error cannot both be non-null (mutual exclusion)
- If Error exists, Result must be null
- If Result exists, Error must be null

---

## Validation Logic (Summary)

**Submit Flow**:
1. Validate operand1 is valid number (non-empty, non-NaN) → if fail, emit INVALID_INPUT error
2. Validate operation is selected → if fail, emit MISSING_OPERATION error
3. Validate operand2 is valid number → if fail, emit INVALID_INPUT error
4. If operation is division and operand2 === 0 → emit DIVISION_BY_ZERO error
5. Else: compute Result, format, display

**Clear Flow**:
1. Reset all fields to empty/default state
2. Clear any existing error or result
3. Focus first input field

---

## Storage & State Management

**Current State**: Kept in-memory during session (global calculator object or component state)

**Persistence**: None in MVP (localStorage can be added in future phase)

**Session Lifecycle**:
- State initialized on page load → empty
- State modified by user interactions (typing, clicking, submitting, clearing)
- State persists until user closes browser or navigates away (lost on refresh)

---

## Glossary

| Term | Definition |
|------|-----------|
| Operand | A numeric value (one of two inputs) |
| Operation | An arithmetic operator (+, −, ×, ÷) |
| Result | The computed outcome of operand1 operation operand2 |
| Calculation | The act of combining operand1, operation, and operand2 to produce a result |
| Error State | Invalid input or edge case (div by zero) preventing calculation |
| Format | Display-friendly representation of a result (e.g., "0.3" instead of raw 0.30000000000000004) |
