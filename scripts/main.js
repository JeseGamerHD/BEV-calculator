import Calculator from "./scripts.js";
import { DropdownInputHandler } from "./inputs/dropdown.js";
import { NumberInputHandler } from "./inputs/number-input.js";
import { RangeInputHandler } from "./inputs/range-input.js";
import { ToggleInputHandler } from "./inputs/toggle-switch.js";

const BASE_VALUES = {
    desiredRange: 250,
    batteryCapacity: 60,
    bevEnergyConsumption: 15,
    stateOfCharge: 50,
    chargerPower: 22,
    chargerPowerAlt: 50,
    energyPrice: 0.2,
    energyPriceAlt: 0.2,
    pricingModel: "energy",
    pricingModelAlt: "energy",
    
};

// Initialize the calculator and inputs
const calculator = new Calculator(BASE_VALUES);
const dropdownInputHandler = new DropdownInputHandler(calculator);
const numberInputHandler = new NumberInputHandler(calculator);
const rangeInputHandler = new RangeInputHandler(calculator);
const toggleInputHandler = new ToggleInputHandler(calculator);

// Update after everything has been initialized so results match example values
calculator.updateCalculations();

// Functionality for add comparison button
document.getElementById("addChargerPriceComparison").addEventListener("click", (event) => {
    handleComparisonButtons(event.target);
});

// Functionality for remove comparison button
document.getElementById("removeChargerPriceComparison").addEventListener("click", (event) => {
    handleComparisonButtons(event.target);
});

function handleComparisonButtons(button) {

    // ADD BUTTON
    if (button.id === "addChargerPriceComparison") {
        button.style.display = "none"; // Hide the add button
        document.getElementById("chargerPricingAlt-wrapper").classList.toggle("animation");
        calculator.toggleComparison();

        // Toggle the result options
        document.querySelectorAll(".single-option").forEach((element) => {
            element.style.display = "none";
        });
        document.querySelectorAll(".multiple-options").forEach((element) => {
            element.style.display = "flex";
        });
    }

    // REMOVE BUTTON
    else {
        document.getElementById("chargerPricingAlt-wrapper").classList.toggle("animation");
        setTimeout(() => { // Give enough time for the above animation to finish (option 2 to disappear), then display the add button:
            document.getElementById("addChargerPriceComparison").style.display = "inline-block";
        }, 200);
        calculator.toggleComparison();

        // Toggle the result options
        document.querySelectorAll(".single-option").forEach((element) => {
            element.style.display = "flex";
        });
        document.querySelectorAll(".multiple-options").forEach((element) => {
            element.style.display = "none";
        });
    }
}


