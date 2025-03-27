import Calculator from "./scripts.js";
import { DropdownInputHandler } from "./inputs/dropdown.js";
import { NumberInputHandler } from "./inputs/number-input.js";
import { RangeInputHandler } from "./inputs/range-input.js";
import { ToggleInputHandler } from "./inputs/toggle-switch.js";
import { LocalizationManager } from "./localization.js";

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

// Access saved input data, merge it with BASE_VALUES
// If some value is not stored base is used.
// If value is stored, it replaces the base.
const savedInputData = JSON.parse(localStorage.getItem("inputData")) || {};
const initialValues = {
    ...BASE_VALUES,
    ...savedInputData
};

// Initialize the calculator and inputs
const calculator = new Calculator(initialValues);
const dropdownInputHandler = new DropdownInputHandler(calculator, initialValues);
const numberInputHandler = new NumberInputHandler(calculator, initialValues);
const rangeInputHandler = new RangeInputHandler(calculator, initialValues);
const toggleInputHandler = new ToggleInputHandler(calculator, initialValues);

// Initialize the localization manager
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize localization manager and load language
        const localizationManager = new LocalizationManager();
        await localizationManager.initializeLanguage();

        // Set up language switcher if it exists
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            languageSwitcher.value = localizationManager.currentLanguage; // Change the selected option to the one set in the localization
            
            languageSwitcher.addEventListener('click', async (clickEvent) => {
                let newLanguage = clickEvent.target.value; // The selected language option
                
                if (newLanguage != localizationManager.currentLanguage) { // No need to update if same language is picked or options only opened
                    localStorage.setItem("language", newLanguage); // Store choice
                    // Update language, then calculations (otherwise placeholder/temp texts show up)
                    await localizationManager.loadLanguage(newLanguage);
                    calculator.updateCalculations();
                }
            });
        }

        // After localization has completed, now we can update calculations
        // This ensures calculator results are the last thing to modify the DOM
        setTimeout(() => {
            calculator.updateCalculations();
        }, 0);
        
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});
  
// Functionality for add comparison button
document.getElementById("addChargerPriceComparison").addEventListener("click", (event) => {
    handleComparisonButtons(event.target);
});

// Functionality for remove comparison button
document.getElementById("removeChargerPriceComparison").addEventListener("click", (event) => {
    handleComparisonButtons(event.target);
});

// TODO: Figure out a better way to animate the add button and the comparison fields
function handleComparisonButtons(button) {

    // ADD BUTTON
    if (button.id === "addChargerPriceComparison") {
        button.style.opacity = 0; // Hide the add button
        button.style.maxHeight = "0px";
        setTimeout(() => { // Set display to none after the transition (button smoothly fades and height goes to zero)
            button.style.display = "none"; // Removes it from the document flow, takes no space
        }, 100);
        
        document.getElementById("chargerPricingAlt-wrapper").classList.toggle("animation"); // Display the alternate charger & pricing
        setTimeout(() => { // So scrollIntoView doesnt jump when the above animation is still in progress
            document.getElementById("chargerPricingAlt-wrapper").scrollIntoView();
        }, 100);

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
        document.getElementById("chargerPricingAlt-wrapper").classList.toggle("animation"); // Hide the altenate charger and pricing:
        
        // Bring the add button back:
        let addButton = document.getElementById("addChargerPriceComparison");
        addButton.style.display = "inline-block"; // Now first set the display
        setTimeout(() => { // Then begin animating (button fades in and smoothly takes space)
            addButton.style.opacity = 1;
            addButton.style.maxHeight = "60px";
        }, 100);

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


