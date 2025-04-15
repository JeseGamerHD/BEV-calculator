import Calculator from "./scripts.js";
import { DropdownInputHandler } from "./inputs/dropdown.js";
import { NumberInputHandler } from "./inputs/number-input.js";
import { RangeInputHandler } from "./inputs/range-input.js";
import { ToggleInputHandler } from "./inputs/toggle-switch.js";
import localization from "./localization.js";

const BASE_VALUES = {
    desiredRange: null,
    batteryCapacity: null,
    bevEnergyConsumption: null,
    stateOfCharge: 50,
    chargerPower: null,
    chargerPowerAlt: null,
    energyPrice: null,
    energyPriceAlt: null,
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

// Initialize the calculator
const calculator = new Calculator(initialValues);

// Initialize the page:
document.addEventListener('DOMContentLoaded', async () => {
    try {      
        // Initialize localization
        await localization.initializeLanguage();

        // Set up language switcher if it exists
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            languageSwitcher.value = localization.currentLanguage; // Change the selected option to the one set in the localization
            
            languageSwitcher.addEventListener('change', async (changeEvent) => {
                let newLanguage = changeEvent.target.value; // The selected language option
                if (newLanguage != localization.currentLanguage) { // No need to update if same language is picked or options only opened
                    localStorage.setItem("language", newLanguage); // Store choice
                    // Update language, then calculations (otherwise placeholder/temp texts show up)
                    await localization.loadLanguage(newLanguage);
                    calculator.updateCalculations();
                }
            });
        }       
    } catch (error) {
        console.error("Error during localization initialization:", error);
    }

    // Initialize input handlers
    const dropdownInputHandler = new DropdownInputHandler(calculator, initialValues);
    const numberInputHandler = new NumberInputHandler(calculator, initialValues);
    const rangeInputHandler = new RangeInputHandler(calculator, initialValues);
    const toggleInputHandler = new ToggleInputHandler(calculator, initialValues);

    // Initialize the first time use
    initializeFirstTimeUse();

    // After initialization has completed, now we can update calculations
    // This ensures calculator results are the last thing to modify the DOM
    setTimeout(() => {
        calculator.updateCalculations();
    }, 0);
});

function initializeFirstTimeUse() {
   
    const firstTimeOverlay = document.querySelector('.first-time-use');
    const resultsContent = document.querySelector('.oikea-puoli-sivusta');
    const inputAreaContainer = document.getElementById("input-area-container"); // Input side is hidden on mobile if first time is active
    const mobileActive = window.matchMedia("(max-width: 900px)"); // Using mobile?
    
    // If user has visited before, hide the overlay immediately
    if (localStorage.getItem('hasVisitedBefore') === 'true') {
        firstTimeOverlay.style.display = 'none';
        resultsContent.style.display = 'flex';
        inputAreaContainer.style.display = "flex";
    } else {
        if (mobileActive.matches) {
            // Input side is hidden on mobile due to scrolling issues
            // when the introduction is active, TODO: Better fix
            resultsContent.style.display = "none";
            inputAreaContainer.style.display = "none";
        } else {
            inputAreaContainer.style.display = "flex";
            resultsContent.style.display = "none";
        }
    }

    // After first time use is intitialized, add functionality to buttons etc:

    // Add click handler to the start button
    const startButton = document.getElementById('start-calculator');
    if (startButton) {
        startButton.addEventListener('click', function () {
            firstTimeOverlay.style.display = 'none';
            resultsContent.style.display = 'flex';
            inputAreaContainer.style.display = "flex";

            // Store in localStorage that user has visited
            localStorage.setItem('hasVisitedBefore', 'true');
        });
    }
    // And to the info button
    const infoButton = document.getElementById('first-time-info-button');
    if (infoButton) {
        infoButton.addEventListener('click', function () {
            firstTimeOverlay.style.display = 'flex';
            resultsContent.style.display = 'none';
            if (mobileActive.matches) {
                inputAreaContainer.style.display = "none";
            }
        });
    }

    // For cases where user resizes desktop browser
    // On desktop inputs are always visible
    window.addEventListener("resize", () => {
        let mobile = window.matchMedia("(max-width: 900px)");
        if (!mobile.matches) {
            inputAreaContainer.style.display = "flex";
        }
    });
}
  
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

        document.querySelectorAll(".comparison-dot").forEach((dot) => {
            dot.style.display = "flex";
        });
        
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

        document.querySelectorAll(".comparison-dot").forEach((dot) => {
            dot.style.display = "none";
        });

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

// ** MOBILE RESULT SWIPE FUNCTIONALITY **
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
    tooltip.textContent = localization.getText(tipKey);

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