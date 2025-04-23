/* File for integration tests where values of result ids in HTML are tested when updating calculator values. 
*/

import Calculator from '../../scripts/scripts.js';
import fs from 'fs';
import path from 'path';

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

let calculator;

beforeAll(() => {

  //Searches the current directory and path to prototype.html
  const currentDirectory = process.cwd();
  const htmlPath = path.resolve(currentDirectory, "prototype.html");

  //Reads the contents of prototype.html and adds it to DOM body
  const html = fs.readFileSync(htmlPath, "utf8");
  document.body.innerHTML = html;
});

beforeEach(() => {
  //Sets default values to calculator object
  calculator = new Calculator(BASE_VALUES);
});

describe('test suite: displays max. operating range correctly', () => {

  it('displays valid desired range as max operating range', () => {

    calculator.desiredRange = 275;
    calculator.updateCalculations();

    expect(document.getElementById('desiredRange').textContent).toBe('275 km');
  });

  it('displays desired range: 0 km as max operating range: 0 km', () => {

    calculator.desiredRange = 0;
    calculator.updateCalculations();

    expect(document.getElementById('desiredRange').textContent).toBe('0 km');
  });

  it('displays desired range: 999 km as max operating range: 999 km', () => {

    calculator.desiredRange = 999;
    calculator.updateCalculations();

    expect(document.getElementById('desiredRange').textContent).toBe('999 km');
  });
});

describe('test suite: calculating charge time for range', () => {

  it('calculates charge time with valid information', () => {
    calculator.stateOfCharge = 40;
    calculator.desiredRange = 500;
    calculator.batteryCapacity = 60;
    calculator.bevEnergyConsumption = 15;
    calculator.chargerPower = 50;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForRange').textContent).toBe('1 h 1 min');
  });

  it('displays charging is not needed when SOC 100%', () => {
    calculator.stateOfCharge = 100;
    calculator.desiredRange = 100;
    calculator.batteryCapacity = 52;
    calculator.bevEnergyConsumption = 20;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForRange').textContent).toBe('Charging not needed');
  });

  it('calculates charge time with values containing decimals', () => {

    calculator.stateOfCharge = 20;
    calculator.desiredRange = 150;
    calculator.batteryCapacity = 52.5;
    calculator.bevEnergyConsumption = 13.5;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForRange').textContent).toBe('1 h 19 min');
  });

  it('displays charge time <1 min' , () => { 

    calculator.desiredRange = 350;
    calculator.stateOfCharge = 50;
    calculator.batteryCapacity = 118;
    calculator.bevEnergyConsumption = 17;
    calculator.chargerPower = 150;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForRange').textContent).toBe('<1 min');

  });
});

describe('test suite: calculating charge cost for range', () => {

  it('calculates cost for range with time-based price', () => {

    calculator.stateOfCharge = 40;
    calculator.desiredRange = 300;
    calculator.bevEnergyConsumption = 17.3;
    calculator.batteryCapacity = 118;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.10;
    calculator.chargerPower = 11;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toContain('0.04 €');
  });

  it('calculates cost for range with time-based price with values containing decimals', () => {

    calculator.stateOfCharge = 40;
    calculator.desiredRange = 300;
    calculator.bevEnergyConsumption = 17.3;
    calculator.batteryCapacity = 57.5;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.15;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toContain('0.59 €');
  });

  it('calculates cost for range with energy-based price', () => {

    calculator.stateOfCharge = 30;
    calculator.desiredRange = 275;
    calculator.bevEnergyConsumption = 15;
    calculator.batteryCapacity = 118;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.60;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toContain('3.51 €');
  });

  it('calculates cost for range with energy-based price with values containing decimals', () => {

    calculator.stateOfCharge = 30;
    calculator.desiredRange = 275;
    calculator.bevEnergyConsumption = 17.3;
    calculator.batteryCapacity = 57.5;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.20;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toContain('6.07 €');
  });

  it('displays price is not set when energy based cost is 0', () => {

    calculator.desiredRange = 255;
    calculator.stateOfCharge = 50;
    calculator.batteryCapacity = 70;
    calculator.bevEnergyConsumption = 20;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('Price not set');
  });

  it('displays price is not set when time based cost is 0', () => {

    calculator.desiredRange = 255;
    calculator.stateOfCharge = 20;
    calculator.batteryCapacity = 70;
    calculator.bevEnergyConsumption = 20;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('Price not set');
  });

  it('displays charging not needed when it is not necessary (time-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.desiredRange = 100;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 13.6;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('Charging not needed');
  });

  it('displays charging is not needed when it is not necessary (energy-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.desiredRange = 50;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 11.6;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('Charging not needed');
  });
});
describe('test suite: calculating energy to be charged for required range', () => {

  it('calculates energy required with valid information', () => {

    calculator.desiredRange = 200;
    calculator.stateOfCharge = 20;
    calculator.batteryCapacity = 60;
    calculator.bevEnergyConsumption = 15;
    calculator.updateCalculations();

    expect(document.getElementById('energyNeededForRange').textContent).toBe('18.00 kWh');
  });

  it('displays energy: 0 when charging is not needed', () => {

    calculator.stateOfCharge = 100;
    calculator.desiredRange = 100;
    calculator.batteryCapacity = 60;
    calculator.bevEnergyConsumption = 12;
    calculator.updateCalculations();

    expect(document.getElementById('energyNeededForRange').textContent).toBe('0.00 kWh');
  });

  it('calculates energy with values containing decimals', () => {

    calculator.stateOfCharge = 20;
    calculator.desiredRange = 200;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 13.7;
    calculator.updateCalculations();

    expect(document.getElementById('energyNeededForRange').textContent).toBe('15.90 kWh');
  });

  it('calculates energy with SOC = 0%', () => {

    calculator.stateOfCharge = 0;
    calculator.desiredRange = 100;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 13.7;
    calculator.updateCalculations();

    expect(document.getElementById('energyNeededForRange').textContent).toBe('13.70 kWh');
  });
});

describe('test suite: calculating charge time when charging to full', () => {

  it('calculates charge time with valid information', () => {
    calculator.stateOfCharge = 40;
    calculator.batteryCapacity = 60;
    calculator.chargerPower = 50;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForFullCharge').textContent).toBe('43 min');
  });

  it('displays charging is not needed when SOC 100%', () => {

    calculator.batteryCapacity = 72;
    calculator.stateOfCharge = 100;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForFullCharge').textContent).toBe('Charging not needed');
  });

  it('calculates charge time with values containing decimals', () => {

    calculator.stateOfCharge = 20;
    calculator.batteryCapacity = 52.5;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForFullCharge').textContent).toBe('5 h 41 min');
  });

  it('displays that charge power is not set when charging required and charger power is unknown', () => {
    calculator.stateOfCharge = 20;
    calculator.batteryCapacity = 60;
    calculator.chargerPower = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForFullCharge').textContent).toBe('Charge power not set');
  });

  it('displays charge time <1 min', () => {
    calculator.stateOfCharge = 99;
    calculator.batteryCapacity = 60;
    calculator.chargerPower = 200;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForFullCharge').textContent).toBe('<1 min');
  });

});

describe('test suite: calculating cost of charging to full', () => {

  it('calculates cost based on energy based price with valid information', () => {

    calculator.stateOfCharge = 30;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 60;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('8.40 €');
  });

  it('calculates cost based on time based price with valid information', () => {

    calculator.stateOfCharge = 40;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.10;
    calculator.batteryCapacity = 60;
    calculator.chargerPower = 11;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('0.33 €');
  });

  it('calculates energy based cost with values containing decimals', () => {

    calculator.stateOfCharge = 20;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.25;
    calculator.batteryCapacity = 57.5;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('11.50 €');
  });

  it('calculates time based cost with values containing decimals', () => {

    calculator.stateOfCharge = 20;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.37;
    calculator.batteryCapacity = 57.5;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('2.30 €');
  });

  it('displays that price is not set when energy based cost is 0', () => {

    calculator.stateOfCharge = 10;
    calculator.batteryCapacity = 55;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('Price not set');
  });

  it('displays that price is not set when time based cost is 0', () => {

    calculator.stateOfCharge = 5;
    calculator.batteryCapacity = 60;
    calculator.pricingModel = 'time';
    calculator.chargerPower = 11;
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('Price not set');
  });

  it('displays charging not needed when it is not needed (time-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('Charging not needed');
  });

  it('displays charging not needed when it is not needed (energy-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('Charging not needed');
  });
});

describe('test suite: calculating energy to full charge', () => {
  it('calculates energy to full charge with valid information', () => {

    calculator.stateOfCharge = 40;
    calculator.pricingModel = 'energy';
    calculator.batteryCapacity = 60;
    calculator.updateCalculations();

    expect(document.getElementById('energyToFullCharge').textContent).toContain('36.00 kWh');
  });

  it('calculates energy to full charge with values containing decimals', () => {

    calculator.stateOfCharge = 30;
    calculator.batteryCapacity = 53.5;
    calculator.updateCalculations();

    expect(document.getElementById('energyToFullCharge').textContent).toContain('37.45 kWh');
  });

  it('calculates energy to full charge when SOC is 0 %', () => {

    calculator.stateOfCharge = 0;
    calculator.batteryCapacity = 53.5;
    calculator.updateCalculations();

    expect(document.getElementById('energyToFullCharge').textContent).toContain('53.50 kWh');
  });

  it('displays 0 when energy to full charge is not needed', () => {

    calculator.stateOfCharge = 100;
    calculator.batteryCapacity = 118;
    calculator.updateCalculations();

    expect(document.getElementById('energyToFullCharge').textContent).toContain('0 kWh');
  });
});

describe('test suite: calculating operating range with current battery energy', () => {

  it('calculates range with valid information', () => {

    calculator.stateOfCharge = 5;
    calculator.batteryCapacity = 150;
    calculator.bevEnergyConsumption = 15;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toBe('50 km');
  });


  it('displays operating range: 0 when energy consumption is 0', () => {

    calculator.bevEnergyConsumption = 0;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toBe('0 km');
  });

  it('calculates range with values containing decimals', () => {

    calculator.stateOfCharge = 10;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 13.7;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toBe('42 km');
  });

  it('displays range: 0 when SOC is 0', () => {

    calculator.stateOfCharge = 0;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toContain('0 km');
  });
});

describe('test suite: displays current SOC correctly', () => {

  it('displays valid SOC', () => {

    calculator.stateOfCharge = 40;
    calculator.updateCalculations();

    expect(document.getElementById('stateOfCharge').textContent).toBe('40 %');
  });

  it('displays SOC: 0 %', () => {

    calculator.stateOfCharge = 0;
    calculator.updateCalculations();

    expect(document.getElementById('stateOfCharge').textContent).toBe('0 %');
  });
});


// TODO: Fix errors even though tests pass/fail correctly, probably due to jsdom manipulation timing
// Currently those "errors" clutter the console making potential real issues hard to see
// setTimeout with calculator.updateCalculations and expect inside it works, but not good for test performance

// Another option that seems promising is to mock elements, though this is not "easy" due to calculator calling same methods multiple times
// This works, but needs logic for checking result only on the correct id:
// At start of file: import {jest} from '@jest/globals'
// Inside test:
// const mockElement = {textContent: ""};
// const mockGetElementById = jest.fn(() => mockElement);
// global.document.getElementById = mockGetElementById;
// calculator.desiredRange = 200;
// calculator.stateOfCharge = 20;
// calculator.batteryCapacity = 60;
// calculator.bevEnergyConsumption = 15;
// calculator.updateCalculations();
// expect(mockElement.textContent).toBe('18.00 kWh');
// jest.restoreAllMocks();
// ^^^ The above will fail since the id used in the mock is the last one used inside calculator