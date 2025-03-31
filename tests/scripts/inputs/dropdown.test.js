import { DropdownInputHandler } from '../../../scripts/inputs/dropdown';
import Calculator from '../../../scripts/scripts';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';

const BASE_VALUES = {
  desiredRange: 250,
  batteryCapacity: 60,
  bevEnergyConsumption: 15,
  stateOfCharge: 50,
  chargerPower: 22,
  chargerPowerAlt: 50,
  energyPrice: 0.2,
  energyPriceAlt: 0.2,
  pricingModel: "energy",
  pricingModelAlt: "energy",
};

const savedInputData = JSON.parse(localStorage.getItem("inputData")) || {};
const initialValues = {
  ...BASE_VALUES,
  ...savedInputData
};

let calculator;

beforeAll(() => {

  //Searches the current directory and path to prototype.html
  const currentDirectory = process.cwd();
  const htmlPath = path.resolve(currentDirectory, "prototype.html");

  //Reads the contents of prototype.html and adds it to DOM body
  const html = fs.readFileSync(htmlPath, "utf8");
  document.body.innerHTML = html;

  calculator = new Calculator(initialValues);
  const dropdownInputHandler = new DropdownInputHandler(calculator, initialValues);
});

describe('test suite: testing dropdown inputs',  () => {

  it('selects an option from dropdown menu', async () => {

    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));

    await userEvent.click(dropdownButton);

    const option = document.querySelector(('.dropdown-option[data-value="30"]'));

    await userEvent.click(option);
  
    expect((document.getElementById('batteryCapacity-input')).value).toBe('Small Batteries (30 kWh)');
  });

  it('lets user enter a large number', async () => {
    
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));

    await userEvent.click(dropdownButton);

    const inputField = document.getElementById('batteryCapacity-input');

    await userEvent.type(inputField, '9999' )
    expect((document.getElementById('batteryCapacity-input')).value).toBe('9999');
  });

  //TODO: Figure out why the test below fails. Is it because saving the values?
  
  /*
  it('lets user enter 0', async () => {
    
    const dropdownButton = document.querySelector(('[data-options="batteryCapacity-options"]'));

    await userEvent.click(dropdownButton);

    const inputField = document.getElementById('batteryCapacity-input');

    await userEvent.type(inputField, '0' )
    expect((document.getElementById('batteryCapacity-input')).value).toBe('0');
    
  });
  */
});