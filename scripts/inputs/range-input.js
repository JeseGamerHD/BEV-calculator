import { InputField } from "./inputfield.js";

export class RangeInputHandler extends InputField {

    #calculator = null;
    #rangeInputSliders = null; // VALUES IN SLIDERS SHOULD BE VALID; Only gets values within min-max limits
    #rangeInputFields = null; // VALUES IN FIELDS CAN BE INVALID; User can type anything or leave it empty, gets set to a proper value once focus is lost

    constructor(calculator) {
        super();
        this.#calculator = calculator;
        this.#rangeInputSliders = document.querySelectorAll(".rangeInput");
        this.#rangeInputFields = document.querySelectorAll(".rangeInput-field"); 

        // Set base values
        this.setDefaultValues(this.#rangeInputSliders, calculator);
        this.setDefaultValues(this.#rangeInputFields, calculator);

        this.#rangeInputSliders.forEach((slider, index) => {

            // Initialize slider progress
            this.updateSliderProgressBar(slider); 
            
            // Apply listeners to sliders
            slider.addEventListener("input", () => {
                this.#rangeInputFields[index].value = slider.value;
                this.updateSliderProgressBar(slider);
                calculator.setData(slider.dataset.property, parseInt(slider.value));
            });
        });

        this.#rangeInputFields.forEach((field, index) => {
    
            field.addEventListener("input", () => {
                this.handleRangeInputField(field, index);
                
                // TODO: field.value can contain NaN, check if fixed once
                // input validation is ready in InputField class
                calculator.setData(field.dataset.property, parseInt(field.value));
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
    }

    /**  
    * @param {HTMLInputElement} field - The field element next to the slider.
    * @param {number} index - The index of the current element in rangeInputFields
    */
    handleRangeInputField(field, index) {

        let minValue = this.#rangeInputSliders[index].min;
        let maxValue = this.#rangeInputSliders[index].max;
        let value = parseInt(field.value, 10);

        if (value >= minValue && value <= maxValue && !isNaN(value)) {
            this.#rangeInputSliders[index].value = value;
        }
        // Value below min, set slider to min
        else if (value < minValue) {
            this.#rangeInputSliders[index].value = minValue;
            // NOTE1: Don't set field to min to allow the user to backspace properly
            // invalid values set to min when focus is lost. TODO: Maybe a better way to do this?
        }
        // Value over max, set slider and field to max
        else if (value > maxValue) {
            this.#rangeInputSliders[index].value = maxValue;
            field.value = maxValue;
        }
        else if (isNaN(value)) {
            this.#rangeInputSliders[index].value = minValue;
        }

        this.updateSliderProgressBar(this.#rangeInputSliders[index]);
    }

    // TODO: progress and thumb are offset from each other by a little (below 50% progress progress lacks behind, above 50% it goes slightly beyond thumb)
    // figure out a proper offset based on the thumb
    /** Fills the background of the slider based on its current value and min/max values 
     * @param {HTMLInputElement} slider - The slider element to be updated.
    */
    updateSliderProgressBar(slider) {

        const min = parseInt(slider.min);
        const max = parseInt(slider.max);
        // Calculate the percentage based on the current value relative to min and max
        // (% of the background that should be filled in)
        const percentage = parseInt(((slider.value - min) / (max - min)) * 100 + 0.5);

        // Update the background:
        slider.style.background = `linear-gradient(to right,rgb(88, 124, 255) ${percentage}%,rgb(163, 163, 163) ${percentage}%)`;
    }
}

