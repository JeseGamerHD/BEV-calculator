import { InputField } from "./inputfield.js";

export class DropdownInputHandler extends InputField {

    #calculator = null;

    constructor(calculator) {
        super();
        this.#calculator = calculator;
        this.setDefaultValues(document.querySelectorAll(".dropdownInput-field"), calculator);
        this.attachEventListeners();
    }

    attachEventListeners() {

        // User clicks on an option or the input field
        document.addEventListener("click", (clickEvent) => {
            this.handleClickEvent(clickEvent);
        });

        // The input field gets focus
        document.addEventListener("focusin", (focusinEvent) => {
            if (focusinEvent.target.classList.contains("dropdownInput-field")) {
                let dropdownField = focusinEvent.target;
                let currentValue = dropdownField.value;

                // Clear the field when an option is selected
                // The value can be invalid through premade options, but the internal data-value is always valid
                if (isNaN(currentValue) || currentValue < dropdownField.min || currentValue > dropdownField.max) {
                    dropdownField.value = "";
                }
            }
        });

        // User is typing in the input field
        document.addEventListener("input", (inputEvent) => {
            if (inputEvent.target.classList.contains("dropdownInput-field")) {
                let dropdownField = inputEvent.target
                let dropdownContentID = dropdownField.dataset.options;
                
                this.handleInput(dropdownField);

                // TODO: should it?
                // Close the options if the user starts typing
                if (document.getElementById(dropdownContentID).classList.contains("animation")) {
                    this.toggleDropdown(dropdownContentID);
                }

                this.#calculator.setData(dropdownField.dataset.property, parseInt(dropdownField.dataset.value));
            }
        });
    }

    handleClickEvent(clickEvent) {

        // User selects an option from the dropdown:
        if (clickEvent.target.classList.contains("dropdown-option")) {
            let option = clickEvent.target; // The option that was clicked
            let dropdownField = document.getElementById(option.dataset.target);

            // Set value based on the option:
            dropdownField.value = option.textContent;
            dropdownField.dataset.value = option.dataset.value;

            // Update calculations, close dropdown
            this.#calculator.setData(dropdownField.dataset.property, parseInt(option.dataset.value));
            this.toggleDropdown(option.parentElement.id);
        }
        // User clicks on the input field:
        else if (clickEvent.target.classList.contains("dropdownInput-field")) {
            let dropdownField = clickEvent.target;
            this.toggleDropdown(dropdownField.dataset.options);
        }
        // User clicks on the dropdown button:
        else if (clickEvent.target.classList.contains("dropdown-button")) {
            let button = clickEvent.target;
            this.toggleDropdown(button.dataset.options);
        }
    }

    toggleDropdown(dropdownID) {
        let dropdown = document.getElementById(dropdownID);
        let height = dropdown.scrollHeight; // Height of all the options inside the container

        // TODO: adjust if needed
        // Limit the height in cases where there are a lot of options
        // Enable scrolling in those cases
        if(height > 150) {
            height = 150;
            dropdown.style.overflow = "scroll";
        }

        // Set the variable used for max-height of the animation based on the amount of options
        // Now the animation works smoothly regardless of how many options there are
        dropdown.style.setProperty("--dropdownHeight", `${height}px`); 
        dropdown.classList.toggle("animation");
    }
}