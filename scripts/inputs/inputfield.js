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
    * Allows the user to empty the field, but does not allow NaN values.
    * Also blocks values below ```inputField.min``` and above ```inputField.max``` by setting the value to the limit being crossed.
    * 
    * Currently only fields with input ```type="number"``` support decimals.
    * @param {HTMLInputElement} inputField - The input element that triggered the event
    */
    handleInput(inputField) {

        // Allow empty, set data-value to MIN
        // (User can backspace properly, text field is empty, but internally has MIN)
        if(inputField.value === "") {
            inputField.dataset.value = inputField.min;
            return;
        }

        let newValue = parseFloat(inputField.value);

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
            inputField.dataset.value = inputField.min;
        }
    }
}