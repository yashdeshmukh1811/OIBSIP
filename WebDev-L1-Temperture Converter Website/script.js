const form = document.getElementById("temperatureForm");

const temperatureInput =
    document.getElementById("temperature");

const unitSelect =
    document.getElementById("unit");

const errorMessage =
    document.getElementById("errorMessage");

const statusMessage =
    document.getElementById("statusMessage");

const celsiusResult =
    document.getElementById("celsiusResult");

const fahrenheitResult =
    document.getElementById("fahrenheitResult");

const kelvinResult =
    document.getElementById("kelvinResult");


// Format result to 2 decimal places
function formatTemperature(value) {
    return Number(value.toFixed(2));
}


// Convert any input to Celsius
function toCelsius(value, unit) {

    if (unit === "celsius") {
        return value;
    }

    if (unit === "fahrenheit") {
        return (value - 32) * 5 / 9;
    }

    if (unit === "kelvin") {
        return value - 273.15;
    }
}


// Validate input
function validateInput() {

    const inputValue =
        temperatureInput.value.trim();

    errorMessage.textContent = "";

    temperatureInput.setCustomValidity("");


    // Empty input
    if (inputValue === "") {

        errorMessage.textContent =
            "Please enter a temperature.";

        temperatureInput.setCustomValidity(
            "Please enter a temperature."
        );

        return false;
    }


    // Non-numeric input
    const value = Number(inputValue);

    if (!Number.isFinite(value)) {

        errorMessage.textContent =
            "Please enter a valid numeric temperature.";

        temperatureInput.setCustomValidity(
            "Please enter a valid numeric temperature."
        );

        return false;
    }


    const unit = unitSelect.value;


    // Celsius absolute zero
    if (unit === "celsius" && value < -273.15) {

        errorMessage.textContent =
            "Temperature cannot be below absolute zero (−273.15 °C).";

        temperatureInput.setCustomValidity(
            "Temperature cannot be below absolute zero."
        );

        return false;
    }


    // Fahrenheit absolute zero
    if (unit === "fahrenheit" && value < -459.67) {

        errorMessage.textContent =
            "Temperature cannot be below absolute zero (−459.67 °F).";

        temperatureInput.setCustomValidity(
            "Temperature cannot be below absolute zero."
        );

        return false;
    }


    // Kelvin absolute zero
    if (unit === "kelvin" && value < 0) {

        errorMessage.textContent =
            "Kelvin cannot be below absolute zero (0 K).";

        temperatureInput.setCustomValidity(
            "Temperature cannot be below absolute zero."
        );

        return false;
    }


    return true;
}


// Clear results
function clearResults() {

    celsiusResult.textContent = "—";
    fahrenheitResult.textContent = "—";
    kelvinResult.textContent = "—";

    statusMessage.textContent =
        "Please correct the input above.";
}


// Convert temperature
function convertTemperature() {

    if (!validateInput()) {

        clearResults();

        return;
    }


    const value =
        Number(temperatureInput.value);

    const unit =
        unitSelect.value;


    // Convert input to Celsius
    const celsius =
        toCelsius(value, unit);


    // Convert Celsius to Fahrenheit
    const fahrenheit =
        (celsius * 9 / 5) + 32;


    // Convert Celsius to Kelvin
    const kelvin =
        celsius + 273.15;


    // Display results
    celsiusResult.textContent =
        `${formatTemperature(celsius)} °C`;

    fahrenheitResult.textContent =
        `${formatTemperature(fahrenheit)} °F`;

    kelvinResult.textContent =
        `${formatTemperature(kelvin)} K`;


    statusMessage.textContent =
        "Conversion successful.";
}


// Convert when button is clicked
form.addEventListener("submit", function (event) {

    event.preventDefault();

    convertTemperature();

});


// Real-time validation
temperatureInput.addEventListener("input", function () {

    validateInput();

});


// Validate again if unit changes
unitSelect.addEventListener("change", function () {

    if (temperatureInput.value.trim() !== "") {

        validateInput();

    }

});