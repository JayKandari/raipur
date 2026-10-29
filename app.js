(function () {
  'use strict';

  var form = document.getElementById('calc-form');
  var operand1 = document.getElementById('operand1');
  var operand2 = document.getElementById('operand2');
  var operation = document.getElementById('operation');
  var clearButton = document.getElementById('clear');
  var result = document.getElementById('result');

  function showResult(text) {
    result.className = 'result';
    result.textContent = text;
  }

  function showError(error) {
    result.className = 'result error';
    result.textContent = '';

    var label = document.createElement('strong');
    label.textContent = 'Error: ';
    result.appendChild(label);
    result.appendChild(document.createTextNode(error.message));

    var guidance = document.createElement('span');
    guidance.className = 'guidance';
    guidance.textContent = error.guidance;
    result.appendChild(guidance);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var outcome = Calculator.calculate(operand1.value, operation.value, operand2.value);
    if (outcome.ok) {
      showResult(outcome.formatted);
    } else {
      showError(outcome.error);
    }
  });

  clearButton.addEventListener('click', function () {
    var state = Calculator.initialState();
    operand1.value = state.operand1;
    operand2.value = state.operand2;
    operation.value = state.operation;
    showResult('');
    operand1.focus();
  });
})();
