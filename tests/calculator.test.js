const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const Calculator = require('../calculator.js');

describe('arithmetic', () => {
  test('add', () => {
    assert.equal(Calculator.add(5, 3), 8);
    assert.equal(Calculator.add(2.5, 1.5), 4);
    assert.equal(Calculator.add(-5, -3), -8);
    assert.equal(Calculator.add(999999, 1), 1000000);
  });

  test('subtract', () => {
    assert.equal(Calculator.subtract(10, 4), 6);
    assert.equal(Calculator.subtract(-5, 10), -15);
  });

  test('multiply', () => {
    assert.equal(Calculator.multiply(6, 7), 42);
    assert.equal(Calculator.multiply(-3, 4), -12);
  });

  test('divide', () => {
    assert.equal(Calculator.divide(20, 4), 5);
    assert.equal(Calculator.divide(5, 0), Infinity);
  });
});

describe('formatResult', () => {
  test('hides floating-point noise', () => {
    assert.equal(Calculator.formatResult(Calculator.add(0.1, 0.2)), '0.3');
  });

  test('strips trailing zeros', () => {
    assert.equal(Calculator.formatResult(7), '7');
    assert.equal(Calculator.formatResult(4.0), '4');
    assert.equal(Calculator.formatResult(2.5), '2.5');
  });

  test('caps at 10 decimal places', () => {
    assert.equal(Calculator.formatResult(1 / 3), '0.3333333333');
  });

  test('never uses scientific notation', () => {
    assert.equal(Calculator.formatResult(1e21), '1000000000000000000000');
    assert.equal(Calculator.formatResult(1e-7), '0.0000001');
  });

  test('negative zero and tiny negatives become 0', () => {
    assert.equal(Calculator.formatResult(-0), '0');
    assert.equal(Calculator.formatResult(-1e-12), '0');
  });
});

describe('validateInput', () => {
  const ok = (input, value) =>
    assert.deepEqual(Calculator.validateInput(input), { valid: true, value });

  test('accepts integers, decimals, negatives, whitespace, leading zeros', () => {
    ok('5', 5);
    ok('5.5', 5.5);
    ok('-5', -5);
    ok('  5.5  ', 5.5);
    ok('007', 7);
    ok('.5', 0.5);
    ok('5.', 5);
  });

  test('accepts the unicode minus sign', () => {
    ok('−5', -5);
  });

  test('rejects empty input and flags it as empty', () => {
    const r = Calculator.validateInput('');
    assert.equal(r.valid, false);
    assert.equal(r.empty, true);
    assert.equal(Calculator.validateInput('   ').empty, true);
  });

  test('rejects non-numeric forms', () => {
    for (const bad of ['abc', '5a', '1e3', '0x10', '0b11', 'Infinity', 'NaN', '--5', '1.2.3', '+5']) {
      const r = Calculator.validateInput(bad);
      assert.equal(r.valid, false, bad);
      assert.notEqual(r.empty, true, bad);
    }
  });

  test('rejects digit strings too long to represent', () => {
    assert.equal(Calculator.validateInput('9'.repeat(400)).valid, false);
  });
});

describe('calculate', () => {
  const fail = (a, op, b, type) => {
    const r = Calculator.calculate(a, op, b);
    assert.equal(r.ok, false);
    assert.equal(r.error.type, type);
    assert.ok(r.error.message);
    assert.ok(r.error.guidance);
    return r;
  };

  test('computes and formats each operation', () => {
    assert.deepEqual(Calculator.calculate('5', '+', '3'), { ok: true, formatted: '8' });
    assert.deepEqual(Calculator.calculate('10', '−', '4'), { ok: true, formatted: '6' });
    assert.deepEqual(Calculator.calculate('6', '×', '7'), { ok: true, formatted: '42' });
    assert.deepEqual(Calculator.calculate('20', '÷', '4'), { ok: true, formatted: '5' });
    assert.deepEqual(Calculator.calculate('2.5', '+', '1.5'), { ok: true, formatted: '4' });
    assert.deepEqual(Calculator.calculate('0.1', '+', '0.2'), { ok: true, formatted: '0.3' });
    assert.deepEqual(Calculator.calculate('-5', '+', '-3'), { ok: true, formatted: '-8' });
  });

  test('INVALID_INPUT for non-numeric operands', () => {
    const r = fail('abc', '+', '5', 'INVALID_INPUT');
    assert.equal(r.error.message, 'Please enter a valid number');
    fail('5', '+', 'abc', 'INVALID_INPUT');
  });

  test('MISSING_OPERAND when an operand is empty', () => {
    const r = fail('', '+', '', 'MISSING_OPERAND');
    assert.equal(r.error.message, 'Please enter both numbers');
    fail('5', '+', '', 'MISSING_OPERAND');
  });

  test('MISSING_OPERATION when no operation is selected', () => {
    const r = fail('5', '', '3', 'MISSING_OPERATION');
    assert.equal(r.error.message, 'Please select an operation');
  });

  test('EMPTY_SUBMIT when nothing is entered', () => {
    const r = fail('', '', '', 'EMPTY_SUBMIT');
    assert.equal(r.error.message, 'Nothing to calculate');
  });

  test('DIVISION_BY_ZERO', () => {
    const r = fail('5', '÷', '0', 'DIVISION_BY_ZERO');
    assert.equal(r.error.message, 'Cannot divide by zero');
    fail('0', '÷', '0', 'DIVISION_BY_ZERO');
    fail('5', '÷', '-0', 'DIVISION_BY_ZERO');
  });

  test('OUT_OF_RANGE when the result is not finite', () => {
    fail('1' + '0'.repeat(308), '×', '10', 'OUT_OF_RANGE');
  });
});

describe('initialState', () => {
  test('returns the empty calculator state', () => {
    assert.deepEqual(Calculator.initialState(), {
      operand1: '',
      operand2: '',
      operation: '',
      result: null,
      error: null,
    });
  });
});
