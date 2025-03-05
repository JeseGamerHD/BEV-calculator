import {InputField} from '../../../scripts/inputs/inputfield.js';


describe('handling different inputs from input fields', () => {
  it('handles special characters', () => {


    //Spy on??
    {HTMLInputElement} inputField;

    inputField.dataset.property = 'desiredRange-input';
    inputField.dataset.value = '$@{[';
  
    console.log(handleInput(inputField));

   expect(document.getElementById('desiredRange-input').innerText).toEqual('');
  });
})