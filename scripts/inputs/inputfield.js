/** Base class for all input components that contain an `<input>` field.
 */
export class InputField {

    /** Sets the default values for the given elements based on their data-property. 
    * @param {NodeList} elements - A List of all the elements that the handler is responsible for.
    * @param {Calculator} calculator - The calculator object
    */
    setDefaultValues(elements, calculator) {
        elements.forEach(element => {
            
            if(element.hasAttribute("data-property")) { // Check if they have a data-property
                let property = element.dataset.property;
                if(calculator.hasOwnProperty(element.dataset.property)) { // Check if the calculator's and the element's property matches
                    element.value = calculator[property];
                    element.dataset.value = calculator[property];
                }
                else {
                    console.warn(element.id + ": data-property mismatch (or missing from calculator)");
                }
            }
            else {
                console.warn(element.id + ": data-property missing");
            }
        });
    }

    /**
    * Handles the "input" event for input fields.
    * Input elements should specify a ```data-type``` attribute: **"integer"** or **"decimal"** in the HTML document.
    * If no data-type is specified or it's invalid, input will be treated as an integer.
    * 
    * @param {HTMLInputElement} inputField - The input element that triggered the event
    */
    handleInput(inputField) {

        // Allow empty, set data-value to MIN
        // (User can backspace properly, text field is empty, but internally has MIN)
        if(inputField.value === "") {
            inputField.dataset.value = inputField.min;
            return;
        }

        if(inputField.dataset.type === "integer"){
            this.handleIntegerInput(inputField);
        }

        else if(inputField.dataset.type === "decimal") {
            this.handleDecimalInput(inputField);
        }
        else {
            this.handleIntegerInput(inputField);
            console.warn(inputField.id + " data-type missing or invalid");
        }
    }

    handleIntegerInput(inputField) {

        let newValue = parseInt(inputField.value);

        // If the user is typing in NaN values
        // keep the current value
        if (isNaN(newValue)) {
            inputField.value = inputField.dataset.value;
            return;
        }

        // Numeric values:
        // Value within MIN - MAX = set value
        // If over MAX, set to MAX, same with MIN
        if (newValue >= inputField.min && newValue <= inputField.max) {
            inputField.value = newValue;
            inputField.dataset.value = newValue;
        }
        else if (newValue > inputField.max) {
            inputField.value = inputField.max;
            inputField.dataset.value = inputField.max;
        }
        else {
            inputField.value = inputField.min;
            inputField.dataset.value = inputField.min;
        }
    }

    handleDecimalInput(inputField) {

        let normalizedValue = inputField.value.replace(',', '.'); // Replace commas, not properly supported
        let sanitizedValue = normalizedValue.replace(/[^0-9.]/g, ''); // Remove any NaN values
        
        let firstDotIndex = sanitizedValue.indexOf(".")
        if(firstDotIndex !== -1) {
            // If the decimal has multiple dots: 0..334...44
            // replace the extra dots with '' and then combine the result with the value up until the first dot.
            // Example: With value 4.3..4. the first substring is 4. and the second becomes 34
            // Then they simply combine to 4.34
            sanitizedValue = sanitizedValue.substring(0, firstDotIndex + 1) + sanitizedValue.substring(firstDotIndex + 1).replace('.', '');
        }

        let newValue = parseFloat(sanitizedValue);
        if (isNaN(newValue)) { // Technically not needed, but for safety
            inputField.value = inputField.dataset.value;
            return;
        }

        inputField.value = sanitizedValue; // So that decimal dot is visible, gets removed when focus is lost if user leaves it at X. etc
        if (newValue >= inputField.min && newValue <= inputField.max) {
            inputField.dataset.value = newValue;
        }
        else if (newValue > inputField.max) {
            inputField.value = inputField.max;
            inputField.dataset.value = inputField.max;
        }
        else {
            inputField.dataset.value = inputField.min;
        }
    }
}