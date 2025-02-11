const toggleSwitches = document.querySelectorAll(".toggleInput-switch");

toggleSwitches.forEach(toggleSwitch => {

    document.getElementById(toggleSwitch.dataset.left).classList.add("active");
    document.getElementById(toggleSwitch.dataset.thumb).style.left = "10px";

    toggleSwitch.addEventListener("click", () => {

        let thumb = document.getElementById(toggleSwitch.dataset.thumb);
        let leftOption = toggleSwitch.dataset.left;
        let rightOption = toggleSwitch.dataset.right;
        
        if(toggleSwitch.dataset.selectedValue == leftOption) {
            toggleSwitch.dataset.selectedValue = rightOption;
            thumb.style.left = "10px";
            document.getElementById(rightOption).classList.toggle("active");
            document.getElementById(leftOption).classList.toggle("active");
            
        } else {
            toggleSwitch.dataset.selectedValue = leftOption;
            thumb.style.left = "calc(100% - 40% - 10px)";
            document.getElementById(leftOption).classList.toggle("active");
            document.getElementById(rightOption).classList.toggle("active");
        }

    });
});

document.addEventListener("input", (inputEvent) => {
    if(inputEvent.target.classList.contains("toggleInput-field")){
        let inputField = inputEvent.target;
        handleToggleInput(inputField);
        console.log(inputField.dataset.value);
    }
});

document.addEventListener("focusout", (focusoutEvent) => {
    if(focusoutEvent.target.classList.contains("toggleInput-field")){
        let inputField = focusoutEvent.target;

        if(inputField.value === "") {
            inputField.value = inputField.min;
        } else {
            inputField.value = parseFloat(inputField.value);
        }
    }
})

function handleToggleInput(inputField) {

    // Allow empty, just don't update any value
    // (User can backspace properly)
    if(inputField.value === "") {
        inputField.dataset.value = inputField.min;
        return;
    }

    let newValue = Number(parseFloat(inputField.value));
    if (newValue >= inputField.min && newValue <= inputField.max) {
        inputField.dataset.value = newValue;
    }
    else if(newValue > inputField.max) {
        inputField.value = inputField.max;
        inputField.dataset.value = inputField.max;
    }
    else {
        inputField.dataset.value = inputField.min;
    }
}


