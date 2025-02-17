import { InputField } from "./inputfield.js";

export class NumberInputHandler extends InputField {

    #calculator = null;

    constructor(calculator) {
        super();
        this.#calculator = calculator;
        this.setDefaultValues(document.querySelectorAll(".numberInput-field"), calculator);
        this.attachEventListeners();
    }

    attachEventListeners() {
        
        document.addEventListener("input", (inputEvent) => {
            if(inputEvent.target.classList.contains("numberInput-field")) {
                let inputField = inputEvent.target;
                this.handleInput(inputField);
                
                this.#calculator.setData(inputField.dataset.property, inputField.dataset.value);
            }
        });
    }
}