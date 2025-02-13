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

    // TODO: Some kind of method for all input fields that handles the input
    // number, dropdown, toggle should be "easy" to modify 
    // rangeinput will require more effort to get working
    handleInput(inputField) {

    }
}