import { InputField } from '../../../scripts/inputs/inputfield.js';
import userEvent from '@testing-library/user-event';

let testContainer;

beforeEach(() => {

    testContainer = document.createElement('div');

    testContainer.innerHTML = `<input id="testInputField" data-type="decimal" data-value="0" type="text" min="0" max="9999">`;
    document.body.appendChild(testContainer);
});

afterEach(() => {
    document.body.removeChild(testContainer);
});


describe('test suite: testing input handling', () => {
    it('changes special characters automatically', async () => {

        const inputFieldHandler = new InputField();
        const inputElement = document.getElementById('testInputField');

        inputElement.addEventListener('input', () => {
            inputFieldHandler.handleInput(inputElement);
        });

        await userEvent.type(inputElement, '!"#¤%');

        expect(inputElement.value).toBe('0');
    });

    it('handles normal input', async () => {
        const inputField = new InputField();
        const inputElement = document.getElementById('testInputField');

        inputElement.addEventListener('input', () => {
            inputField.handleInput(inputElement);
        });

        await userEvent.type(inputElement, '999');
        expect(inputElement.value).toBe('999');
    });

    it('handles input containing special characters before numbers', async () => {

        const inputField = new InputField();
        const inputElement = document.getElementById('testInputField');

        inputElement.addEventListener('input', () => {
            inputField.handleInput(inputElement);
        });

        await userEvent.type(inputElement, '!"#¤%999');
        expect(inputElement.value).toBe('999');
    });

    it('handles input containing alphabets', async () => {

        const inputField = new InputField();
        const inputElement = document.getElementById('testInputField');

        inputElement.addEventListener('input', () => {
            inputField.handleInput(inputElement);
        });

        await userEvent.type(inputElement, 'kolmekymmentä');
        expect(inputElement.value).toBe('0');
    });

    it('handles input containing alphabets before numbers', async () => {

        const inputField = new InputField();
        const inputElement = document.getElementById('testInputField');

        inputElement.addEventListener('input', () => {
            inputField.handleInput(inputElement);
        });

        await userEvent.type(inputElement, 'kolmekymmentä30');
        expect(inputElement.value).toBe('30');
    });

    it('handles input containing negative values', async () => {

        const inputField = new InputField();
        const inputElement = document.getElementById('testInputField');

        inputElement.addEventListener('input', () => {
            inputField.handleInput(inputElement);
        });

        await userEvent.type(inputElement, '-10');
        expect(inputElement.value).toBe('10');
    });

});