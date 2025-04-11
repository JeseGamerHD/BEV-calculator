/** Base class for all input components that contain an `<input>` field.
 * This class **does not** attach event listeners, each input component should attach their own listeners
 * in order utilize most methods in this class.
 */
export class InputField {

    #defaultValues = null;

    /** Sets the default values for the given elements based on their data-property.
    * If defaultValues entry contain a null value (new user), sets visible value to empty and internal value to 0.
    * @param {NodeList} elements - A List of all the elements that the handler is responsible for.
    * @param {Object} defaultValues - The object holding the default values that the fields should be initialized with
    */
    setDefaultValues(elements, defaultValues) {
        this.#defaultValues = defaultValues;
        
        elements.forEach(element => {
            if(element.hasAttribute("data-property")) { // Check if they have a data-property
                
                let property = element.dataset.property;
                if(defaultValues.hasOwnProperty(element.dataset.property)) { // Check if the defaultValue contains the property set for the element
                    // For new users defaultValues contains mostly null values
                    // ^^ set visible values to empty and internal values to 0 in these cases
                    element.value = defaultValues[property] != null ? defaultValues[property] : ''; 
                    element.dataset.value = defaultValues[property] != null ? defaultValues[property] : 0; 
                }
                else {
                    console.warn(element.id + ": data-property mismatch (or missing from defaultValues)");
                }
            }
            else {
                console.warn(element.id + ": data-property missing from element");
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

        let sanitizedValue = inputField.value.replace(',', '.'); // Replace commas, not properly supported
        sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, ''); // Remove any NaN values
        
        let firstDotIndex = sanitizedValue.indexOf(".");
        if(firstDotIndex !== -1) {
            // If the decimal has multiple dots: 0..334...44
            // replace the extra dots with '' and then combine the result with the value up until the first dot.
            // Example: With value 4.3..4. the first substring is 4. and the second becomes 34
            // Then they simply combine to 4.34
            sanitizedValue = sanitizedValue.substring(0, firstDotIndex + 1) + sanitizedValue.substring(firstDotIndex + 1).replace('.', '');
        }

        let i = 0; // This removes extra zeros at the start by counting until the "." or a 1-9
        while (i < sanitizedValue.length - 1 && sanitizedValue[i] === '0' && sanitizedValue[i + 1] !== '.') {
            i++;
        }
        sanitizedValue = sanitizedValue.substring(i); // Now "0" and "0." can be typed, but not "0023" or "00.23"

        
        let newValue = parseFloat(sanitizedValue);
        if (isNaN(newValue)) { // sanitizedValue can be empty, which leads to NaN
            inputField.value = inputField.dataset.value;
            return;
        }

        if (newValue >= inputField.min && newValue <= inputField.max) {
            inputField.value = sanitizedValue;
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

    /**
    * Cleans up values by setting them to the ```element.dataset.value```.
    * This is due to some fields potentially allowing "0." and to ensure "0023" or "00.234" are cleaned up properly
    * 
    * The method should be called after focus is lost on a field since input handling should
    * set ```element.dataset.value``` to only valid clean values (element.value is not as strict at input handling)
    * 
    * @param {HTMLInputElement} inputField - The input element that triggered the event
    * @param {boolean} allowEmpty - Whether the field is allowed to have an empty element.value
    */
    cleanUpOnFocusout(inputField, allowEmpty) {   
        if(!allowEmpty) {
            inputField.value = inputField.dataset.value;
        }
        else {
            // If the field is empty, don't change value
            // Otherwise cleanup value to internal value
            inputField.value = inputField.value !== "" ? inputField.dataset.value : inputField.value; 
        }
    }

    /**
    * Updates a value from the initial/default input values and stores it in localStorage inside the "inputData" object
    * @param {string} property - The property being updated & stored
    * @param value - The new value for the property
    */
    storeInputValue(property, value) {
        this.#defaultValues[property] = value;
        localStorage.setItem("inputData", JSON.stringify(this.#defaultValues));
    }
}