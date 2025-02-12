export class ToggleInputHandler {

    #calculator = null;
    #toggleSwitches = null;

    constructor(calculator) {
        this.#calculator = calculator;
        this.#toggleSwitches = document.querySelectorAll(".toggleInput-switch");

        this.initializeFields(document.querySelectorAll(".toggleInput-field"));

        this.#toggleSwitches.forEach(toggleSwitch => {
            document.getElementById(toggleSwitch.dataset.left).classList.add("active");
            document.getElementById(toggleSwitch.dataset.thumb).style.left = "10px";
            toggleSwitch.addEventListener("click", () => {
                this.toggleOptions(toggleSwitch);
            });
        });
        
        document.addEventListener("input", (inputEvent) => {
            if(inputEvent.target.classList.contains("toggleInput-field")){
                let inputField = inputEvent.target;
                this.handleToggleInput(inputField);
        
                // UPDATE CALC
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
        });
    }

    initializeFields(inputFields) {

        inputFields.forEach(field => {
            let property = field.dataset.property;
            field.value = this.#calculator[property];
            field.dataset.value = this.#calculator[property];
        });
    }

    handleToggleInput(inputField) {
        // Allow empty, just don't update any value
        // (User can backspace properly)
        if (inputField.value === "") {
            inputField.dataset.value = inputField.min;
            return;
        }

        let newValue = Number(parseFloat(inputField.value));
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

    toggleOptions(toggleSwitch) {
        
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
    }
}


