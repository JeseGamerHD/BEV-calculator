import { InputField } from "./inputfield.js";

export class ToggleInputHandler extends InputField {

    #calculator = null;

    constructor(calculator) {
        super();    
        this.#calculator = calculator;
        let toggleWrappers = document.querySelectorAll(".toggleInput-wrapper");
        this.setDefaultValues(document.querySelectorAll(".toggleInput-field, .toggleInput-switch"), calculator);
        this.attachEventListeners();

        // By default options have the left option selected
        // initialize by toggling some styling
        toggleWrappers.forEach(wrapper => {
            let leftOption = wrapper.querySelector(".toggle-option.left");
            leftOption.classList.toggle("active");
            wrapper.querySelector(".toggleInput-thumb").style.left = "5px";
        });
    }

    attachEventListeners() {
        
        document.addEventListener("input", (inputEvent) => {
            let wrapper = inputEvent.target.closest(".toggleInput-wrapper"); // If clicking inside the wrapper, this finds the wrapper element. When clicking outside it returns null.
            if(wrapper != null && inputEvent.target.classList.contains("toggleInput-field")) {
                let inputField = inputEvent.target;
                this.handleInput(inputField);
                this.#calculator.setData(inputField.dataset.property, parseFloat(inputField.dataset.value));
            }
        });

        document.addEventListener("focusout", (focusoutEvent) => {
            let wrapper = focusoutEvent.target.closest(".toggleInput-wrapper");
            if(wrapper != null && focusoutEvent.target.classList.contains("toggleInput-field")) {
                let inputField = focusoutEvent.target;
                this.cleanUpOnFocusout(inputField, true);
            }
        });

        document.addEventListener("click", (clickEvent) => {
            let wrapper = clickEvent.target.closest(".toggleInput-wrapper");
            if(wrapper != null) {
                // Switch consists of multiple overlapping parts
                // Need to get toggleSwitch like this and do the check, otherwise runs on every element
                // inside the wrapper
                let toggleSwitch = wrapper.querySelector(".toggleInput-switch");
                if(toggleSwitch.contains(clickEvent.target)) {
                    this.toggleOptions(toggleSwitch);
                    this.#calculator.setData(toggleSwitch.dataset.property, toggleSwitch.dataset.value);
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

        let thumb = toggleSwitch.querySelector(".toggleInput-thumb");
        let leftOption = toggleSwitch.querySelector(".toggle-option.left"); // toggle-option's also have left or right class
        let rightOption = toggleSwitch.querySelector(".toggle-option.right");

        // Switch active option:
        if(toggleSwitch.dataset.value == leftOption.dataset.value) {
            toggleSwitch.dataset.value = rightOption.dataset.value;
            thumb.style.left = "calc(100% - 45% - 5px)"; // Move thumb (css animates this)
            leftOption.classList.toggle("active");
            rightOption.classList.toggle("active");
        }
        else {
            toggleSwitch.dataset.value = leftOption.dataset.value;
            thumb.style.left = "5px";
            rightOption.classList.toggle("active");
            leftOption.classList.toggle("active");
        }
    }
}


