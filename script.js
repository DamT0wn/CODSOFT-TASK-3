document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.calculator-buttons');

    let currentInput = '0'; // Stores the current number being input
    let firstOperand = null; // Stores the first number for an operation
    let operator = null; // Stores the selected operator
    let waitingForSecondOperand = false; // Flag to indicate if the next input should start a new number

    // Function to update the display
    function updateDisplay() {
        display.textContent = currentInput;
    }

    // Function to handle number input
    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    // Function to handle decimal point
    function inputDecimal(dot) {
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes(dot)) {
            currentInput += dot;
        }
        updateDisplay();
    }

    // Function to handle clear (AC)
    function clearCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    // Function to handle percentage
    function handlePercentage() {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
            currentInput = (value / 100).toString();
            updateDisplay();
        }
    }

    // Function to handle negation (+/-)
    function handleNegate() {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
            currentInput = (-value).toString();
            updateDisplay();
        }
    }

    // Function to perform calculations
    function performCalculation() {
        const inputValue = parseFloat(currentInput);

        if (firstOperand === null || operator === null) {
            return; // No operation to perform yet
        }

        if (waitingForSecondOperand) {
            // If an operator was just pressed and no second operand was entered,
            // use the first operand as the second operand (e.g., 5 + = 10)
            firstOperand = operate(firstOperand, firstOperand, operator);
        } else {
            firstOperand = operate(firstOperand, inputValue, operator);
        }

        currentInput = String(firstOperand);
        updateDisplay();
        operator = null; // Reset operator after calculation
        waitingForSecondOperand = true; // Ready for new input or chain operation
    }

    // Core arithmetic operations
    function operate(num1, num2, op) {
        switch (op) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/':
                if (num2 === 0) {
                    // Handle division by zero
                    setTimeout(() => {
                        display.textContent = 'Error';
                        currentInput = '0';
                        firstOperand = null;
                        operator = null;
                        waitingForSecondOperand = false;
                    }, 10); // Small delay to show "Error" before resetting
                    return 0; // Return 0 to prevent further calculation issues
                }
                return num1 / num2;
            default: return num2;
        }
    }

    // Event listener for all button clicks
    buttons.addEventListener('click', (event) => {
        const { target } = event;

        // Check if the clicked element is a button
        if (!target.matches('button')) {
            return;
        }

        if (target.dataset.value) {
            // It's a number button
            inputDigit(target.dataset.value);
        } else if (target.dataset.action === 'clear') {
            // It's the clear button
            clearCalculator();
        } else if (target.dataset.action === 'negate') {
            // It's the negate button (+/-)
            handleNegate();
        } else if (target.dataset.action === 'percent') {
            // It's the percentage button
            handlePercentage();
        } else if (target.dataset.action === 'equals') {
            // It's the equals button
            performCalculation();
            operator = null; // Ensure operator is cleared after equals
        } else if (target.dataset.action) {
            // It's an operator button (+, -, *, /)
            // Map action to operator symbol
            const actionToOperator = {
                add: '+',
                subtract: '-',
                multiply: '*',
                divide: '/'
            };
            const opSymbol = actionToOperator[target.dataset.action] || target.dataset.action;
            if (firstOperand === null) {
                firstOperand = parseFloat(currentInput);
            } else if (!waitingForSecondOperand) {
                // If not waiting for second operand, perform previous calculation
                performCalculation();
            }
            operator = opSymbol; // Store the mapped operator symbol
            waitingForSecondOperand = true; // Next digit input will be the second operand
        } else if (target.dataset.value === '.') {
            // It's the decimal button
            inputDecimal('.');
        }
    });

    // Initialize display on load
    updateDisplay();
});