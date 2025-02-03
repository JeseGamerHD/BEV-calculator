
const rangeInputSliders = document.querySelectorAll(".rangeInput"); // VALUES IN SLIDERS SHOULD BE VALID; Only gets values within min-max limits
const rangeInputFields = document.querySelectorAll(".rangeInput-field"); // VALUES IN FIELDS CAN BE INVALID; User can type anything or leave it empty, gets set to a proper value once focus is lost


rangeInputSliders.forEach((slider, index) => {

    // Initialize slider progress
    updateSliderProgressBar(slider); 
    
    // Apply listeners to sliders
    slider.addEventListener("input", () => {
        rangeInputFields[index].value = slider.value;
        updateSliderProgressBar(slider);
        // UPDATE CALCULATIONS HERE?
    });
});

// Apply listeners to slider fields
rangeInputFields.forEach((field, index) => {
    
    field.addEventListener("input", () => {
        handleRangeInputField(field, index);
        // UPDATE CALCULATIONS HERE?
    });

    // Runs when focus is lost on the field
    field.addEventListener("blur", () => {
        field.value = parseInt(field.value); // Remove leading zeros
        // Set invalid values to min
        // NOTE1: below min check here to allow the user to backspace properly
        if(isNaN(parseInt(field.value)) || parseInt(field.value) < parseInt(field.min)){
            field.value = field.min;
        }
    });
});

/**  
 * @param {HTMLInputElement} field - The field element next to the slider.
 * @param {number} index - The index of the current element in rangeInputFields
*/
function handleRangeInputField(field, index) {

    let minValue = rangeInputSliders[index].min;
    let maxValue = rangeInputSliders[index].max;
    let value = parseInt(field.value, 10);

    if (value >= minValue && value <= maxValue && !isNaN(value)) {
        rangeInputSliders[index].value = value;
    }
    // Value below min, set slider to min
    else if (value < minValue) {
        rangeInputSliders[index].value = minValue;
        // NOTE1: Don't set field to min to allow the user to backspace properly
        // invalid values set to min when focus is lost. TODO: Maybe a better way to do this?
    }
    // Value over max, set slider and field to max
    else if (value > maxValue) {
        rangeInputSliders[index].value = maxValue;
        field.value = maxValue;
    }
    else if(isNaN(value)) {
        rangeInputSliders[index].value = minValue;
    }

    updateSliderProgressBar(rangeInputSliders[index]);
}

// TODO: progress and thumb are offset from each other by a little (below 50% progress progress lacks behind, above 50% it goes slightly beyond thumb)
// figure out a proper offset based on the thumb
/** Fills the background of the slider based on its current value and min/max values 
 * @param {HTMLInputElement} slider - The slider element to be updated.
*/
function updateSliderProgressBar(slider) {
    
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    // Calculate the percentage based on the current value relative to min and max
    // (% of the background that should be filled in)
    const percentage = parseInt(((slider.value - min) / (max - min)) * 100 + 0.5);

    // Update the background:
    slider.style.background = `linear-gradient(to right,rgb(88, 124, 255) ${percentage}%,rgb(163, 163, 163) ${percentage}%)`;
}

