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
    energyPrice: 0.2,
    pricingModel: "energy",

};

// Initialize the calculator and inputs
const calculator = new Calculator(BASE_VALUES);
const dropdownInputHandler = new DropdownInputHandler(calculator);
const numberInputHandler = new NumberInputHandler(calculator);
const rangeInputHandler = new RangeInputHandler(calculator);
const toggleInputHandler = new ToggleInputHandler(calculator);

// Add functionality for add/remove comparison buttons
document.getElementById("addChargerPriceComparison").addEventListener("click", (event) => {
    event.target.style.display = "none";
    document.getElementById("chargerPricingAlt-wrapper").classList.toggle("animation");
});

document.getElementById("removeChargerPriceComparison").addEventListener("click", () => {
    document.getElementById("chargerPricingAlt-wrapper").classList.toggle("animation");
    document.getElementById("addChargerPriceComparison").style.display = "inline-block"; 
});

// Finally update after everything has been initialized so results match example values
calculator.updateCalculations();
