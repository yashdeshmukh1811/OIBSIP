const expressionDisplay =
    document.getElementById("expression");

const resultDisplay =
    document.getElementById("result");

const buttons =
    document.querySelectorAll("button");


let currentInput = "";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;


// Update calculator display
function updateDisplay() {

    if (currentInput === "") {
        expressionDisplay.textContent = "0";
    } else {
        expressionDisplay.textContent = currentInput;
    }
}


// Add a number or decimal point
function inputNumber(value) {

    if (waitingForSecondNumber) {

        currentInput = "";

        waitingForSecondNumber = false;
    }


    // Prevent multiple decimal points
    if (value === ".") {

        if (currentInput.includes(".")) {
            return;
        }

        // Start decimal numbers with 0
        if (currentInput === "") {
            currentInput = "0";
        }
    }


    currentInput += value;

    updateDisplay();
}


// Choose an operator
function chooseOperator(selectedOperator) {

    if (currentInput === "" && firstNumber === null) {
        return;
    }


    // If an operator is already waiting,
    // calculate the previous operation first.
    if (firstNumber !== null && waitingForSecondNumber) {

        operator = selectedOperator;

        return;
    }


    if (firstNumber === null) {

        firstNumber = parseFloat(currentInput);

    } else if (operator !== null) {

        const secondNumber =
            parseFloat(currentInput);

        const calculation =
            calculate(
                firstNumber,
                secondNumber,
                operator
            );


        if (calculation === "Error") {

            showError();

            return;
        }


        firstNumber = calculation;

        currentInput = String(calculation);
    }


    operator = selectedOperator;

    waitingForSecondNumber = true;

    resultDisplay.textContent =
        `${firstNumber} ${getOperatorSymbol(operator)}`;

    updateDisplay();
}


// Perform arithmetic operation
function calculate(first, second, selectedOperator) {

    switch (selectedOperator) {

        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":

            if (second === 0) {
                return "Error";
            }

            return first / second;

        default:
            return second;
    }
}


// Display the final result
function calculateResult() {

    if (
        firstNumber === null ||
        operator === null ||
        currentInput === "" ||
        waitingForSecondNumber
    ) {
        return;
    }


    const secondNumber =
        parseFloat(currentInput);


    // Prevent division by zero
    if (operator === "/" && secondNumber === 0) {

        showError();

        return;
    }


    const calculation =
        calculate(
            firstNumber,
            secondNumber,
            operator
        );


    if (calculation === "Error") {

        showError();

        return;
    }


    resultDisplay.textContent =
        `${firstNumber} ${getOperatorSymbol(operator)} ${secondNumber} =`;

    currentInput =
        String(roundResult(calculation));

    firstNumber = null;
    operator = null;

    waitingForSecondNumber = false;

    updateDisplay();
}


// Round long decimal results
function roundResult(number) {

    return Number(
        number.toFixed(10)
    );
}


// Convert operator to display symbol
function getOperatorSymbol(selectedOperator) {

    switch (selectedOperator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return "";
    }
}


// Clear calculator
function clearCalculator() {

    currentInput = "";

    firstNumber = null;

    operator = null;

    waitingForSecondNumber = false;

    resultDisplay.textContent = "";

    updateDisplay();
}


// Remove the last character
function backspace() {

    if (waitingForSecondNumber) {
        return;
    }


    currentInput =
        currentInput.slice(0, -1);


    updateDisplay();
}


// Show error message
function showError() {

    expressionDisplay.textContent =
        "Error";

    resultDisplay.textContent =
        "Cannot divide by zero";


    currentInput = "";

    firstNumber = null;

    operator = null;

    waitingForSecondNumber = false;
}


// Add event listeners to all buttons
buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        const number =
            button.dataset.number;

        const selectedOperator =
            button.dataset.operator;

        const action =
            button.dataset.action;


        // Number / decimal button
        if (number !== undefined) {

            inputNumber(number);

            return;
        }


        // Operator button
        if (selectedOperator !== undefined) {

            chooseOperator(selectedOperator);

            return;
        }


        // Clear button
        if (action === "clear") {

            clearCalculator();

            return;
        }


        // Backspace button
        if (action === "backspace") {

            backspace();

            return;
        }


        // Equals button
        if (action === "equals") {

            calculateResult();

        }

    });

});


// Initial display
updateDisplay();