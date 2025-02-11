document.addEventListener("input", (inputEvent) => {
    if(inputEvent.target.classList.contains("numberInput-field")) {
        let inputField = inputEvent.target;
        handleNumberInput(inputField);         
    }
});

function handleNumberInput(inputField) {
    
    // Allow empty, just don't update any value
    // (User can backspace properly)
    if(inputField.value === "") {
        inputField.dataset.value = inputField.min;
        return;
    }

    // Parse after checking for empty (empty would otherwise become NaN)
    let newValue = parseInt(inputField.value);
    // let newValue = new Number(inputField.value);
    
    // Check if user is trying to type non numeric values
    if (isNaN(newValue)) {
        if (inputField.oldValue === undefined) { // Check if no previous value (first time typing)
            inputField.oldValue = "";
            inputField.value = "";
        }
        else { // Keep value at previous valid value
            inputField.value = inputField.oldValue;
        }
        return;
    }

    // User is typing a valid number, check if within min/max
    // Set actual dataset values here
    if (newValue >= inputField.min && newValue <= inputField.max) {
        inputField.value = newValue;
        inputField.dataset.value = newValue;
    }
    else if(newValue > inputField.max) {
        inputField.value = inputField.max;
        inputField.dataset.value = inputField.max;
    }
    else {
        inputField.value = inputField.min;
        inputField.dataset.value = inputField.min;
    }
}