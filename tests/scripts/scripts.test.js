import Calculator from '../../scripts/scripts.js';

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

let calculator;
let testContainer;

beforeEach(() => {

  testContainer = document.createElement('div');
  testContainer.innerHTML = `
        
        <div class="oikea-puoli-sivusta"> 
        
            <div class="left-side">
                <h1 data-localization="results.distance.title">Distance</h1>
                <div id="desiredRange" class="spaced-div">TEST</div>

                <div class="header-wrapper">
                    <h3 data-localization="results.chargingTime.title">Charging Time</h3>
                    <h3 id="header-span" class="header-span" data-localization="results.chargingTime.multipleCharges">Multiple charges</h3>
                </div>
                    
                    <div id="chargeTimeForRange" class="spaced-div single-option">Charge time needed for range: </div>
                    <div style="display: none;" data-localization="results.chargingTime.notNeeded">Charging not needed</div>
                <div id="chargeTimeComparisonContainer" class="multiple-options" style="display: none;">
                    <div class="optionTextWrapper">
                        <div id="chargeTimeForRangeOption1" data-localization="results.chargingTime.option1">Charge time for range option 1: </div>
                        <div class="option-span" id="chargerPowerOption1-1">22 kW</div>
                    </div>
                    <div id="comparisonBarRangeTime1" class="comparison-bar spaced-div"></div>
                    
                    <div class="optionTextWrapper">
                        <div id="chargeTimeForRangeOption2" data-localization="results.chargingTime.option2">Charge time for range option 2: </div>
                        <div class="option-span" id="chargerPowerOption2-1">50 kW</div>
                    </div>
                    <div id="comparisonBarRangeTime2" class="comparison-bar spaced-div"></div>
                </div>
               
                <h3 data-localization="results.chargingCosts.title">Charging Costs</h3>
                <div id="chargeCostRange" class="spaced-div single-option" data-localization="results.chargingCosts.forRange">Charge cost in €/kWh for desired range: </div>

                <div id="chargeCostComparisonContainer" class="multiple-options" style="display: none;">
                    <div class="optionTextWrapper">
                        <div id="chargeCostForRangeOption1" data-localization="results.chargingCosts.option1">Charge cost in €/kWh for range option 1: </div>
                        <div class="option-span" id="energyPriceOption1-1">0.2 €/kWh</div>
                    </div>
                    <div id="comparisonBarRangeCost1" class="comparison-bar spaced-div"></div>

                    <div class="optionTextWrapper">
                        <div id="chargeCostForRangeOption2" data-localization="results.chargingCosts.option2">Charge cost in €/kWh for range option 2: </div>
                        <div class="option-span" id="energyPriceOption2-1">0.2 €/kWh</div>
                    </div>
                    <div id="comparisonBarRangeCost2" class="comparison-bar spaced-div"></div>
                </div>
    
                <h3 data-localization="results.energy.title">Energy</h3>
                <div id="energyNeededForRange" data-localization="results.energy.forRange">Energy needed for range: </div>
            </div>
              
            <div class="middle">
                <h1 data-localization="results.untilFull.title">Until Full (SOC)</h1>
                <div id="fullCharge" class="spaced-div" data-localization="results.untilFull.fullCharge">100%</div>
    
                <h3 data-localization="results.untilFull.chargingTime.title">Charging Time</h3>
                <div id="chargeTimeForFullCharge" class="spaced-div single-option" data-localization="results.untilFull.chargingTime.forFull">Charge time for full charge: </div>

                <div id="chargeTimeComparisonContainerFullCharge" class="multiple-options" style="display: none;">
                    <div class="optionTextWrapper">
                        <div id="chargeTimeForFullChargeOption1" data-localization="results.untilFull.chargingTime.option1">Charge time for full charge option 1: </div>
                        <div class="option-span" id="chargerPowerOption1-2">22 kW</div>
                    </div>
                    <div id="comparisonBarFullChargeTime1" class="comparison-bar spaced-div"></div>

                    <div class="optionTextWrapper">
                        <div id="chargeTimeForFullChargeOption2" data-localization="results.untilFull.chargingTime.option2">Charge time for full charge option 2: </div>
                        <div class="option-span" id="chargerPowerOption2-2">50 kW</div>
                    </div>
                    
                    <div id="comparisonBarFullChargeTime2" class="comparison-bar spaced-div"></div>
                </div>
    
                <h3 data-localization="results.untilFull.chargingCosts.title">Charging Costs</h3>
                <div id="chargeCostFullCharge" class="spaced-div single-option" data-localization="results.untilFull.chargingCosts.forFull">Charge cost in €/kWh for full charge: </div>
            
                <div id="chargeCostComparisonContainerFullCharge" class="multiple-options" style="display: none;">
                    <div class="optionTextWrapper">
                        <div id="chargeCostForFullChargeOption1" data-localization="results.untilFull.chargingCosts.option1">Charge cost in €/kWh for full charge option 1: </div>
                        <div class="option-span" id="energyPriceOption1-2">0.2 €/kWh</div>
                    </div>
                    <div id="comparisonBarFullChargeCost1" class="comparison-bar spaced-div"></div>

                    <div class="optionTextWrapper">
                        <div id="chargeCostForFullChargeOption2" data-localization="results.untilFull.chargingCosts.option2">Charge cost in €/kWh for full charge option 2: </div>
                        <div class="option-span" id="energyPriceOption2-2">0.2 €/kWh</div>
                    </div>
                    <div id="comparisonBarFullChargeCost2" class="comparison-bar spaced-div"></div>
                </div>
    
                <h3 data-localization="results.untilFull.energy.title">Energy</h3>
                <div id="energyToFullCharge" data-localization="results.untilFull.energy.forFull">Energy needed for full charge: </div>
            </div>
    
            <div class="right-side">
                <h1 data-localization="results.stateOfCharge.title">State of Charge</h1>
                <div id="stateOfCharge" class="spaced-div" data-localization="results.stateOfCharge.soc">SOC: </div>
    
                <h3 data-localization="results.operatingRange.title">Distance</h3>
                <div id="currentOperatingRange" data-localization="results.operatingRange.range">Operation range: </div>
            </div>
                   
        </div>`;

  document.body.appendChild(testContainer);
  calculator = new Calculator(BASE_VALUES);
});

afterEach(() => {
  document.body.removeChild(testContainer);
  calculator = null;
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

    expect(document.getElementById('energyNeededForRange').textContent).toBe('0 kWh');
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

  it('displays cost: 0 when energy based cost is 0', () => {

    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when time based cost is 0', () => {

    calculator.pricingModel = 'time';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (time-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (energy-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('0.00 €');
  });

  /* Test this in inputs?
  it('displays 0 when using time based pricing, but charge power is not provided', () => {
      calcChargeCostFullCharge(0.10, 60, 40, 'time', null);
  
      expect(document.getElementById('chargeCostFullCharge').textContent).toContain('0');
  
    });
 
    */

});



describe('test suite: calculating operating range with current battery energy', () => {

  it('calculates range with valid information', () => {

    calculator.stateOfCharge = 5;
    calculator.batteryCapacity = 150;
    calculator.bevEnergyConsumption = 15;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toBe('50.00 km');
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

    expect(document.getElementById('currentOperatingRange').textContent).toBe('41.97 km');
  });

  it('displays range: 0 when SOC is 0', () => {

    calculator.stateOfCharge = 0;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toContain('0.00 km');
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

  it('displays cost: 0 when energy based cost is 0', () => {

    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when time based cost is 0', () => {

    calculator.pricingModel = 'time';
    calculator.energyPrice = 0;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (time-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.desiredRange = 100;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 13.6;
    calculator.chargerPower = 7.4;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (energy-based price)', () => {

    calculator.stateOfCharge = 100;
    calculator.desiredRange = 50;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0.20;
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 11.6;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostRange').textContent).toBe('0.00 €');
  });
});