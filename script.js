const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let expression = '';

function updateDisplay() {
  display.value = expression || '0';
}

function appendValue(val) {
  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function evaluateExpression() {
  if (!expression) return;

  // Normalize the expression: replace × and ÷ with * and /
  const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Basic safety: allow only digits, operators, decimal point, parentheses and spaces
  const allowed = /^[0-9+\-*/().\s]+$/;
  if (!allowed.test(normalized)) {
    display.value = 'Error';
    expression = '';
    return;
  }

  try {
    // Evaluate safely using Function constructor (after validation)
    // This is simple and acceptable for a basic calculator UI.
    const result = Function('"use strict"; return (' + normalized + ')')();
    expression = String(result);
    updateDisplay();
  } catch (err) {
    display.value = 'Error';
    expression = '';
  }
}

// Handle clicks on keys
keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteLast();
  } else if (action === 'evaluate') {
    evaluateExpression();
  } else if (value !== undefined) {
    appendValue(value);
  }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  // Allow numbers, basic operators, parentheses, decimal
  const key = e.key;

  if ((key >= '0' && key <= '9') || key === '.') {
    appendValue(key);
    e.preventDefault();
    return;
  }

  if (key === '+' || key === '-' || key === '*' || key === '/' ) {
    // Map * and / to visible symbols or keep as-is
    // We append as regular operator, evaluation allows them.
    appendValue(key);
    e.preventDefault();
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateExpression();
    e.preventDefault();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    e.preventDefault();
    return;
  }

  if (key === 'Escape') {
    clearAll();
    e.preventDefault();
    return;
  }

  if (key === '(' || key === ')') {
    appendValue(key);
    e.preventDefault();
    return;
  }
});

// initialize
updateDisplay();