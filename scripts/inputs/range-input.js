import { InputField } from "./inputfield.js";

export class RangeInputHandler extends InputField {

    #calculator = null;

    constructor(calculator) {
        super();
        this.#calculator = calculator;
        let rangeInputSliders = document.querySelectorAll(".rangeInput");
        let rangeInputFields = document.querySelectorAll(".rangeInput-field");

        // Set base values
        this.setDefaultValues(rangeInputSliders, calculator);
        this.setDefaultValues(rangeInputFields, calculator);
        
        // Initialize slider progress
        rangeInputSliders.forEach(slider => {
            this.updateSliderProgressBar(slider);
        });

        this.attachEventListeners();
    }

    attachEventListeners() {
        
        document.addEventListener("input", (inputEvent) => {
            // SLIDERS
            if(inputEvent.target.classList.contains("rangeInput")) {
                let slider = inputEvent.target;
                let inputField = document.getElementById(slider.dataset.target);

                // Slider values shouldn't be invalid so safe to set directly
                // No need to use handleInput
                inputField.value = slider.value;
                inputField.dataset.value = slider.value;
                
                this.updateSliderProgressBar(slider);
                this.#calculator.setData(slider.dataset.property, parseInt(slider.value));
            }
            // FIELDS
            if(inputEvent.target.classList.contains("rangeInput-field")) {
                let inputField = inputEvent.target;
                let slider = document.getElementById(inputField.dataset.target);

                this.handleInput(inputField, slider);
                this.updateSliderProgressBar(slider);
                this.#calculator.setData(slider.dataset.property, parseInt(slider.value));
            }
        });

        document.addEventListener("focusout", (focusoutEvent) => {
            if(focusoutEvent.target.classList.contains("rangeInput-field")){
                let inputField = focusoutEvent.target;
                inputField.value = inputField.dataset.value;
            }
        });
    }

    /** @inheritdoc This implementation also updates the value of the slider
    * associated with the field
    * @param {HTMLInputElement} slider
    */
    handleInput(inputField, slider) {
        super.handleInput(inputField);
        slider.value = inputField.dataset.value;
        slider.dataset.value = inputField.dataset.value;
    }

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
        slider.style.background = `linear-gradient(to right, rgba(29,125,255,1) 0%, rgba(72,214,255,1) ${percentage}%, rgb(163, 163, 163) ${percentage}%, rgb(163, 163, 163) 100%)`;
    }
}

