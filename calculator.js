(function () {
  'use strict';

  var NUMBER_PATTERN = /^-?(\d+\.?\d*|\.\d+)$/;
  var MAX_FIXED = 1e21;

  var ERRORS = {
    INVALID_INPUT: {
      message: 'Please enter a valid number',
      guidance: 'Use integers, decimals or negatives, for example 5, 2.5 or -3'
    },
    DIVISION_BY_ZERO: {
      message: 'Cannot divide by zero',
      guidance: 'Enter a non-zero value in the second field'
    },
    MISSING_OPERAND: {
      message: 'Please enter both numbers',
      guidance: 'Fill both input fields before clicking submit'
    },
    MISSING_OPERATION: {
      message: 'Please select an operation',
      guidance: 'Choose +, −, × or ÷'
    },
    EMPTY_SUBMIT: {
      message: 'Nothing to calculate',
      guidance: 'Enter two numbers and select an operation'
    },
    OUT_OF_RANGE: {
      message: 'Result is too large',
      guidance: 'Use smaller numbers'
    }
  };

  function add(a, b) { return a + b; }
  function subtract(a, b) { return a - b; }
  function multiply(a, b) { return a * b; }
  function divide(a, b) { return a / b; }

  var OPERATIONS = {
    '+': add,
    '−': subtract,
    '×': multiply,
    '÷': divide
  };

  function validateInput(input) {
    var text = String(input == null ? '' : input).trim().replace(/−/g, '-');
    if (text === '') {
      return { valid: false, empty: true, error: 'Please enter a number' };
    }
    if (!NUMBER_PATTERN.test(text)) {
      return { valid: false, error: ERRORS.INVALID_INPUT.message };
    }
    var value = Number(text);
    if (!isFinite(value)) {
      return { valid: false, error: ERRORS.INVALID_INPUT.message };
    }
    return { valid: true, value: value };
  }

  function formatResult(value, precision) {
    if (precision === undefined) { precision = 10; }
    if (!isFinite(value)) { return String(value); }

    if (Math.abs(value) >= MAX_FIXED) {
      return value.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 0 });
    }

    var text = value.toFixed(precision);
    if (text.indexOf('.') !== -1) {
      text = text.replace(/0+$/, '').replace(/\.$/, '');
    }
    return text === '-0' ? '0' : text;
  }

  function fail(type) {
    return {
      ok: false,
      error: { type: type, message: ERRORS[type].message, guidance: ERRORS[type].guidance }
    };
  }

  function calculate(rawA, operation, rawB) {
    var blankA = validateInput(rawA).empty === true;
    var blankB = validateInput(rawB).empty === true;
    if (blankA && blankB && !operation) { return fail('EMPTY_SUBMIT'); }

    var a = validateInput(rawA);
    if (a.empty) { return fail('MISSING_OPERAND'); }
    if (!a.valid) { return fail('INVALID_INPUT'); }

    var compute = OPERATIONS[operation];
    if (!compute) { return fail('MISSING_OPERATION'); }

    var b = validateInput(rawB);
    if (b.empty) { return fail('MISSING_OPERAND'); }
    if (!b.valid) { return fail('INVALID_INPUT'); }

    if (compute === divide && b.value === 0) { return fail('DIVISION_BY_ZERO'); }

    var result = compute(a.value, b.value);
    if (!isFinite(result)) { return fail('OUT_OF_RANGE'); }

    return { ok: true, formatted: formatResult(result) };
  }

  function initialState() {
    return { operand1: '', operand2: '', operation: '', result: null, error: null };
  }

  var api = {
    ERRORS: ERRORS,
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    validateInput: validateInput,
    formatResult: formatResult,
    calculate: calculate,
    initialState: initialState
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.Calculator = api;
  }
})();
