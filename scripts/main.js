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

const localizationManager = new LocalizationManager();
// Initialize the localization manager
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get the start button and overlay elements
        const startButton = document.getElementById('start-calculator');
        const infoButton = document.getElementById('first-time-info-button');
        const firstTimeOverlay = document.querySelector('.first-time-use');
        const resultsContent = document.querySelector('.results-content');
        // Check if this is the user's first visit
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
        
        // If user has visited before, hide the overlay immediately
        if (hasVisitedBefore === 'true') {
            firstTimeOverlay.style.display = 'none';
            resultsContent.style.display = 'flex';
        }
        // Add click handler to the start button
        if (startButton) {
            startButton.addEventListener('click', function() {
                    firstTimeOverlay.style.display = 'none';
                    resultsContent.style.display = 'flex'; 

                    // Store in localStorage that user has visited
                    localStorage.setItem('hasVisitedBefore', 'true');
            });
        }
        if (infoButton) {
            infoButton.addEventListener('click', function() {
                firstTimeOverlay.style.display = 'flex';
                resultsContent.style.display = 'none'; 
            });
        }

        // Initialize localization manager and load language
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

document.addEventListener("DOMContentLoaded", function(){
    let currentIndex = 0;
    const totalScreens = 3;
    const resultsContent = document.querySelectorAll(".results-content")[0];

    let initialX = null;

    function startTouch(e){
        initialX = e.touches[0].clientX;
    }

    function moveTouch(e){
        if (initialX === null) {
            return;
        }

        let currentX = e.touches[0].clientX;
        let diffX = initialX - currentX;

        if(Math.abs(diffX) > 50){
            if(diffX > 0 && currentIndex < totalScreens - 1){
                currentIndex++;
            } else if(diffX < 0 && currentIndex > 0){
                currentIndex--;
            }

            resultsContent.style.transform = `translateX(-${currentIndex * 100}vw)`;
        }

        initialX = null;
        e.preventDefault();
    }

    resultsContent.addEventListener("touchstart", startTouch, false);
    resultsContent.addEventListener("touchmove", moveTouch, false);
});

// ** TOOLTIP FUNCTIONALITY **
const tooltip = document.getElementById("tooltip");
const elementsWithTooltip = document.querySelectorAll(".tooltip-container");

elementsWithTooltip.forEach(element => element.addEventListener("mouseover", (e) => {
    handleTooltipActivation(e.target); // Pass element being hovered over => the (?) cicle
}));

// ^^ Mobile support:
elementsWithTooltip.forEach(element => element.addEventListener("touchstart", (e) => {
    handleTooltipActivation(e.target);
}));

elementsWithTooltip.forEach(element => element.addEventListener("mouseout", () => {
    hideTooltip();
}));

function handleTooltipActivation(element) {
   
    const tooltipKey = element.getAttribute("data-tooltipkey"); // Each tooltip-container should define a key for localization so the text can be set
    let elementBounds = element.getBoundingClientRect();
    let tooltipBounds = tooltip.parentElement.getBoundingClientRect();

    let left = elementBounds.left - tooltipBounds.left + (elementBounds.width / 2);
    let top = elementBounds.top - tooltipBounds.top + (elementBounds.height / 2);

    let position = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };

    // Offset the tooltip based on which quadrant of the screen the element being hovered is in
    // This is to prevent it from overflowing outside of the page
    const offSet = 10; // TODO: Maybe adjust? Make it more dynamic?

    // Check if element is in the top or bottom half of the screen
    if (top > tooltipBounds.height / 2) { // Bottom half
        position.bottom = `${tooltipBounds.height - top + offSet}px`;
    }
    else { // Top half
        position.top = `${top + offSet}px`;
    }

    // Check if the element is in the left or right half of the screen
    if (left > tooltipBounds.width / 2) { // Right half
        position.right = `${tooltipBounds.width - left + offSet}px`;
    }
    else { // Left half
        position.left = `${left + offSet}px`;
    }

    showTooltip(tooltipKey, position);
}

function showTooltip(tipKey, position) {
    // call localization to get the new text using the key
    tooltip.textContent = localizationManager.getText(tipKey);

    // Adjust position
    tooltip.style.top = position.top;
    tooltip.style.right = position.right;
    tooltip.style.bottom = position.bottom;
    tooltip.style.left = position.left;

    // Display it
    tooltip.style.display = "flex";
}

function hideTooltip() {
    tooltip.style.display = "none";
}