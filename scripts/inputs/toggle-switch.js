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
        this.#toggleSwitches.forEach(toggleSwitch => {

            // By default options have the left option selected
            // initialize by toggling some styling
            let leftOption = document.querySelector(`[data-owner="${toggleSwitch.id}"][data-value="${toggleSwitch.dataset.left}"]`);
            leftOption.classList.toggle("active");
            document.getElementById(toggleSwitch.dataset.thumb).style.left = "5px";
            
            // TODO: figure out how to move eventlistener to the attachEventListeners() method
            // The click has issues activating on the thumb using event delegation
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
        
        let thumb = document.getElementById(toggleSwitch.dataset.thumb); // The "thumb" (white thingie) associated with the toggleSwitch
        let left = toggleSwitch.dataset.left; // The value of the left side option in the toggle
        let right = toggleSwitch.dataset.right; // ^^ Same but right side
        
        // Options define data-owner which is the id of the switch that "owns" the options
        // They also have a data-value which is the value of that option
        // So select left & right options that belong to this switch:
        let leftOption = document.querySelector(`[data-owner="${toggleSwitch.id}"][data-value="${left}"]`);
        let rightOption = document.querySelector(`[data-owner="${toggleSwitch.id}"][data-value="${right}"]`);

        // Change active option:
        if(toggleSwitch.dataset.value == left) {
            toggleSwitch.dataset.value = right; // Set the value
            thumb.style.left = "calc(100% - 45% - 5px)"; // Move thumb (css animates this)
            leftOption.classList.toggle("active");
            rightOption.classList.toggle("active");
 
        } else {
            toggleSwitch.dataset.value = left;
            thumb.style.left = "5px";
            rightOption.classList.toggle("active");
            leftOption.classList.toggle("active");
        }
    }
}


