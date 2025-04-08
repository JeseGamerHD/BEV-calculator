import { InputField } from "./inputfield.js";

export class ToggleInputHandler extends InputField {

    #calculator = null;

    constructor(calculator, initialValues) {
        super();    
        this.#calculator = calculator;
        let toggleSwitches = document.querySelectorAll(".toggleInput-switch");
        this.setDefaultValues(document.querySelectorAll(".toggleInput-field, .toggleInput-switch"), initialValues);
        this.attachEventListeners();

        // initialize the position of each toggle switch
        toggleSwitches.forEach(toggle => {
            this.initializeTogglePosition(toggle);
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
                this.storeInputValue(inputField.dataset.property, parseFloat(inputField.dataset.value));
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
                    this.storeInputValue(toggleSwitch.dataset.property, toggleSwitch.dataset.value);
                }
            }
        });
    }

    /**
    * Initializes the position of the toggle based on the value in toggleSwitch.dataset.value.
    * => Checks which "option" in the toggle has that same value and moves the thumb over it
    * @param  {HTMLElement } toggleSwitch
    */
    initializeTogglePosition(toggleSwitch) {
        
        let thumb = toggleSwitch.querySelector(".toggleInput-thumb");
        let leftOption = toggleSwitch.querySelector(".toggle-option.left");
        let rightOption = toggleSwitch.querySelector(".toggle-option.right");

        if(toggleSwitch.dataset.value == leftOption.dataset.value) {
            thumb.style.left = "5px";
            leftOption.classList.toggle("active");
        }
        else {
            thumb.style.left = "calc(100% - 45% - 5px)";
            rightOption.classList.toggle("active");
        }
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


