import { InputField } from "./inputfield.js";

export class DropdownInputHandler extends InputField {

    #calculator = null;

    constructor(calculator, initialValues) {
        super();
        this.#calculator = calculator;
        let dropdownFields = document.querySelectorAll(".dropdownInput-field");
        this.setDefaultValues(dropdownFields, initialValues);
        this.attachEventListeners();
    }

    /** @inheritdoc 
    * DropdownInputHandler implementation loops through the dropdown options
    * and sets the visible text to match an option if the initial values match
    */
    setDefaultValues(dropdownFields, intialValues) {
        super.setDefaultValues(dropdownFields, intialValues);

        // Dropdowns also check if a initial value matches an option,
        // and sets its value to match the text
        dropdownFields.forEach(dropdown => {
            let dropdownContent = document.getElementById(dropdown.dataset.options);
            let options = dropdownContent.querySelectorAll(".dropdown-option");
            
            for(let option of options) {
                if(dropdown.value == option.dataset.value) {
                    dropdown.value = option.textContent;
                    break;
                }
            }
        });
    }

    attachEventListeners() {
        // User clicks on an option or the input field
        document.addEventListener("click", (clickEvent) => {
            this.handleClickEvent(clickEvent);
        });

        document.addEventListener("focusout", (focusoutEvent) => {
            if (focusoutEvent.target.classList.contains("dropdownInput-field")) {
                let inputField = focusoutEvent.target;
                this.cleanUpOnFocusout(inputField, true);
                this.storeInputValue(inputField.dataset.property, parseFloat(inputField.dataset.value));
            }
        });

        // User is typing in the input field
        document.addEventListener("input", (inputEvent) => {
            if (inputEvent.target.classList.contains("dropdownInput-field")) {
                let dropdownField = inputEvent.target;
                let dropdownContentID = dropdownField.dataset.options;
                this.handleInput(dropdownField);

                // Close the options if the user starts typing
                if (document.getElementById(dropdownContentID).classList.contains("animation")) {
                    this.toggleDropdown(dropdownContentID);
                }

                this.#calculator.setData(dropdownField.dataset.property, parseFloat(dropdownField.dataset.value));
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

            // Update calculations, store data, close dropdown
            this.#calculator.setData(dropdownField.dataset.property, parseFloat(option.dataset.value));
            this.storeInputValue(dropdownField.dataset.property, parseFloat(option.dataset.value));
            this.toggleDropdown(option.parentElement.id);
        }
        // User clicks on the input field:
        else if (clickEvent.target.classList.contains("dropdownInput-field")) {
            let dropdownField = clickEvent.target;
            let currentValue = dropdownField.value;
            
            // Clear premade option if one is selected (they contain text = NaN)
            // Set value to 0 for calculations
            if (isNaN(currentValue)) {
                dropdownField.value = "";
                dropdownField.dataset.value = dropdownField.min;
                this.#calculator.setData(dropdownField.dataset.property, parseFloat(dropdownField.dataset.value));
            }

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
        if(height > 180) {
            height = 180;
            dropdown.style.overflowY = "scroll";
        }

        // Set the variable used for max-height of the animation based on the amount of options
        // Now the animation works smoothly regardless of how many options there are
        dropdown.style.setProperty("--dropdownHeight", `${height}px`); 
        dropdown.classList.toggle("animation");

        // Also rotate the dropdown button:
        // Each button has data-options which is the same as the id of the dropdown
        let button = document.querySelector(`.dropdown-button[data-options="${dropdown.id}"]`);
        button.classList.toggle("rotate");
    }
}