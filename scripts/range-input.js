// WORK IN PROGRESS
// TODO: modify so that this can be used with all the sliders, currently tuned to only one
// (select all slider elements, apply listeners in foreach, modify updateSliderProgress to handle updating per slider)

const stateOfChargeSlider = document.getElementById("SOC-slider");
const stateOfChargeNumber = document.getElementById("SOC-number");

stateOfChargeSlider.addEventListener("input", () => {
    stateOfChargeNumber.value = stateOfChargeSlider.value;
    updateSliderProgressBar();
});

stateOfChargeNumber.addEventListener("input", () => {
    
    let minValue = stateOfChargeSlider.min; // 0
    let maxValue = stateOfChargeSlider.max; // 100
    let value = parseInt(stateOfChargeNumber.value, 10); // Value from number input field
    
    // If value is acceptable:
    if(value >= minValue && value <= maxValue && !isNaN(value)) {
        stateOfChargeSlider.value = value;
    }
    // value is below MIN, set slider + input to MIN
    else if(value <= minValue) {
        stateOfChargeSlider.value = minValue;
        stateOfChargeNumber.value = minValue;
    }
    // value is over MAX, set slider + input to MAX
    else if(value >= maxValue) {
        stateOfChargeSlider.value = maxValue;
        stateOfChargeNumber.value = maxValue;
    }
    // value is empty, set slider to MIN
    else if(isNaN(value)) {
        stateOfChargeSlider.value = minValue;
    }

    updateSliderProgressBar();
});

// When focus is lost on the number input field
stateOfChargeNumber.addEventListener("blur", () => {
    // Removes leading zeroes
    stateOfChargeNumber.value = parseInt(stateOfChargeNumber.value);
    // If field is left empty, set it to 0
    if(isNaN(parseFloat(stateOfChargeNumber.value))) {
        stateOfChargeNumber.value = 0;
    }
});

// Fills the background of the slider based on the current value
function updateSliderProgressBar() {
    let percentage = stateOfChargeSlider.value;
    stateOfChargeSlider.style.background = `linear-gradient(to right,rgb(88, 124, 255) ${percentage}%,rgb(163, 163, 163) ${percentage}%)`;
}
updateSliderProgressBar();

