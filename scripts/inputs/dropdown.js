export class DropdownInputHandler {

    #calculator = null;

    constructor(calculator) {
        this.#calculator = calculator;

        this.initializeFields(document.querySelectorAll(".dropdownInput-field"));
        // User clicks on an option or the input field
        document.addEventListener("click", (clickEvent) => {

            if (clickEvent.target.classList.contains("dropdown-option")) {
                let option = clickEvent.target; // The option that was clicked
                let dropdownField = document.getElementById(option.dataset.target);

                dropdownField.value = option.textContent;
                dropdownField.dataset.value = option.dataset.value; // Set field's data-value to option's data-value

                // TODO: UPDATE CALCULATIONS !!
                this.#calculator.setData(dropdownField.dataset.property, parseInt(option.dataset.value));
                this.toggleDropdown(option.parentElement.id);
            }
            else if (clickEvent.target.classList.contains("dropdownInput-field")) {
                let dropdownField = clickEvent.target;
                this.toggleDropdown(dropdownField.dataset.options);
            }
            else if(clickEvent.target.classList.contains("dropdown-button")) {
                let button = clickEvent.target;
                console.log("e");
                this.toggleDropdown(button.dataset.options);
            }
        });

        // The input field gets focus
        document.addEventListener("focusin", (focusinEvent) => {
            if (focusinEvent.target.classList.contains("dropdownInput-field")) {
                let dropdownField = focusinEvent.target;
                let currentValue = dropdownField.value;

                // Clear the field when clicking if invalid value
                if (isNaN(currentValue) || currentValue < dropdownField.min || currentValue > dropdownField.max) {
                    dropdownField.value = "";
                }
            }
        });

        // User is typing in the input field
        document.addEventListener("input", (inputEvent) => {
            if (inputEvent.target.classList.contains("dropdownInput-field")) {
                let dropdownField = inputEvent.target
                this.handleDropdownInput(dropdownField);

                let dropdownContentID = dropdownField.dataset.options;
                // Close the options if the user starts typing
                if (document.getElementById(dropdownContentID).classList.contains("animation")) {
                    this.toggleDropdown(dropdownContentID);
                }

                //TODO: UPDATE CALCULATIONS !!
                this.#calculator.setData(dropdownField.dataset.property, parseInt(dropdownField.dataset.value));
            }
        });
    }

    initializeFields(inputFields) {
        inputFields.forEach(field => {
            let property = field.dataset.property;
            field.value = this.#calculator[property];
            field.dataset.value = this.#calculator[property];
        });
    }

    toggleDropdown(dropdownID) {
        let dropdown = document.getElementById(dropdownID);
        let height = dropdown.scrollHeight; // Height of all the options inside the container
        
        // Set the variable used for max-height of the animation based on the amount of options
        // Now the animation works smoothly regardless of how many options there are
        dropdown.style.setProperty("--dropdownHeight", `${height}px`); 
        dropdown.classList.toggle("animation");
    }

    // dropdownField.value - The value visible to the user on the text field
    // dropdownField.dataset.value - The actual value that should be used in calculations

    /** Limits what the user can type to values between MIN and MAX of the field. Also allows empty input so the user can backspace.
     * Value used in calculations will still be within limits. See below note:
     * 
     * NOTE: **dropdownField.value** is the value visible to the user on the text field (can be empty).
     * **dropdownField.dataset.value** is the value that should be used in calculations (always min - max).
     * @param {HTMLInputElement} dropdownField - The custom input field of the dropdown.
    */
    handleDropdownInput(dropdownField) {
        // Allow empty, just don't update any value
        // (User can backspace properly)
        if (dropdownField.value === "") {
            return;
        }

        // Parse after checking for empty (empty would otherwise become NaN)
        let newValue = parseInt(dropdownField.value);

        // Check if user is trying to type non numeric values
        if (isNaN(newValue)) {
            if (dropdownField.oldValue === undefined) { // Check if no previous value (first time typing)
                dropdownField.oldValue = "";
                dropdownField.value = "";
            }
            else { // Keep value at previous valid value
                dropdownField.value = dropdownField.oldValue;
            }
            return;
        }

        // User is typing a valid number, check if within min/max
        // Set actual dataset values here
        if (newValue >= dropdownField.min && newValue <= dropdownField.max) {
            dropdownField.value = newValue;
            dropdownField.dataset.value = newValue;
        }
        else if (newValue > dropdownField.max) {
            dropdownField.value = dropdownField.max;
            dropdownField.dataset.value = dropdownField.max;
        }
        else {
            dropdownField.value = dropdownField.min;
            dropdownField.dataset.value = dropdownField.min;
        }
    }
}