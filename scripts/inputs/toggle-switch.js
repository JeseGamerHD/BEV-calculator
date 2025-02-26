import { InputField } from "./inputfield.js";

export class ToggleInputHandler extends InputField {

    #calculator = null;
    #toggleSwitches = null;

    constructor(calculator) {
        super();    
        this.#calculator = calculator;
        this.#toggleSwitches = document.querySelectorAll(".toggleInput-switch");
        this.setDefaultValues(document.querySelectorAll(".toggleInput-field, .toggleInput-switch"), calculator);

        this.attachEventListeners();
        // TODO: figure out how to move eventlistener to the method
        // The click has issues activating on the thumb using event delegation
        this.#toggleSwitches.forEach(toggleSwitch => {
            document.getElementById(toggleSwitch.dataset.left).classList.add("active");
            document.getElementById(toggleSwitch.dataset.thumb).style.left = "5px";
            toggleSwitch.addEventListener("click", () => {
                this.toggleOptions(toggleSwitch);
                this.#calculator.setData(toggleSwitch.dataset.property, toggleSwitch.dataset.value);
            });
        });
    }

    attachEventListeners() {
        
        document.addEventListener("input", (inputEvent) => {
            if(inputEvent.target.classList.contains("toggleInput-field")){
                let inputField = inputEvent.target;
                this.handleInput(inputField);
                this.#calculator.setData(inputField.dataset.property, parseFloat(inputField.dataset.value));
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

    /**
    * Moves the "thumb" of the switch by toggling a .css class 
    * and sets the data-value to the selected option.
    * @param  {HTMLElement } toggleSwitch
    */
    toggleOptions(toggleSwitch) {
        let thumb = document.getElementById(toggleSwitch.dataset.thumb);
        let leftOption = toggleSwitch.dataset.left;
        let rightOption = toggleSwitch.dataset.right;
        
        if(toggleSwitch.dataset.value == leftOption) {
            toggleSwitch.dataset.value = rightOption;
            thumb.style.left = "calc(100% - 45% - 5px)";
            document.getElementById(leftOption).classList.toggle("active");
            document.getElementById(rightOption).classList.toggle("active");
            
        } else {
            toggleSwitch.dataset.value = leftOption;
            thumb.style.left = "5px";
            document.getElementById(rightOption).classList.toggle("active");
            document.getElementById(leftOption).classList.toggle("active");
        }
    }
}


