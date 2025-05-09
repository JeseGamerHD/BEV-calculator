//File for testing dropdown menus and how their inputs are handled using user-event testing library.

import { DropdownInputHandler } from '../../../scripts/inputs/dropdown';
import Calculator from '../../../scripts/scripts';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';


//Sets base values as in main.js
const BASE_VALUES = {
  desiredRange: null,
  batteryCapacity: null,
  bevEnergyConsumption: null,
  stateOfCharge: 50,
  chargerPower: null,
  chargerPowerAlt: null,
  energyPrice: null,
  energyPriceAlt: null,
  pricingModel: "energy",
  pricingModelAlt: "energy",
};

const savedInputData = JSON.parse(localStorage.getItem("inputData")) || {};
const initialValues = {
  ...BASE_VALUES,
  ...savedInputData
};

let calculator;
let html;

beforeAll(() => {

  //Searches the current directory and path to prototype.html
  const currentDirectory = process.cwd();
  const htmlPath = path.resolve(currentDirectory, "prototype.html");

  //Reads the contents of prototype.html and adds it to DOM body
  html = fs.readFileSync(htmlPath, "utf8");
  document.body.innerHTML = html;

  //Initializes calculator and dropdowninputhandler with initial values
  calculator = new Calculator(initialValues);
  const dropdownInputHandler = new DropdownInputHandler(calculator, initialValues);

});

afterEach(() => {

  //Clears the contents of innerHTML
  document.body.innerHTML = html; 
});

describe('test suite: testing dropdown inputs',  () => {

  it('selects an option from dropdown menu', async () => {

    //Selects battery capacity dropdown menu
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));
    await userEvent.click(dropdownButton);

    //Selects option from dropdown menu
    const option = document.querySelector(('.dropdown-option[data-value="30"]'));
    await userEvent.click(option);
  
    //The selected option should be updated
    expect((document.getElementById('batteryCapacity-input')).value).toBe('Small Batteries (30 kWh)');
  });

  it('lets user enter a large number', async () => {
    
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));
    await userEvent.click(dropdownButton);

    const inputField = document.getElementById('batteryCapacity-input');
    await userEvent.type(inputField, '9999' );

    expect(inputField.value).toBe('9999');
  });

  
  it('lets user enter 0', async () => {
    
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));
    await userEvent.click(dropdownButton);

    const inputField = document.getElementById('batteryCapacity-input');
    await userEvent.type(inputField, '0' );

    expect(inputField.value).toBe('0');
    
  });
  
  it('changes a predefined value to entered value', async () => {
    
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));
    await userEvent.click(dropdownButton);

    const option = document.querySelector(('.dropdown-option[data-value="60"]'));
    await userEvent.click(option);
  
    const inputField = document.getElementById('batteryCapacity-input');
    expect(inputField.value).toBe('Mid-size Batteries (60 kWh)');

    await userEvent.click(dropdownButton);
    await userEvent.type(inputField, '20' )
    expect(inputField.value).toBe('20'); 
  });

  it('changes an entered value to predefined value', async () => {
    
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));
    await userEvent.click(dropdownButton);

    const inputField = document.getElementById('batteryCapacity-input');
    await userEvent.type(inputField, '10' )

    expect(inputField.value).toBe('10'); 

    await userEvent.click(dropdownButton);
    const option = document.querySelector(('.dropdown-option[data-value="45"]'));
    await userEvent.click(option);

    expect(inputField.value).toBe('Light Batteries (45 kWh)');
  });
});