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

const calculator = new Calculator(BASE_VALUES);
calculator.updateCalculations();

let testContainer;

beforeEach(() => {

  testContainer = document.createElement('div');
  testContainer.innerHTML = `
        
 <div class="oikea-puoli-sivusta"> 
        
        <div class="left-side">
            <h1>Distance</h1>
            <div id="maxOperatingRange" class="spaced-div">TEST</div>

            <h3>Charging Time</h3>
            <div id="chargeTimeForRange" class="spaced-div js-test-charge-time-range">Charge time needed for range: </div>
           
            <h3>Charging Costs</h3>
            <div id="chargeCostRange" class="spaced-div">Charge cost in €/kWh for desired range: </div>

            <h3>Number of Charges</h3>
            <div id="chargesRequired" class="spaced-div">TEST</div>

            <h3>Energy</h3>
            <div id="energyNeededForRange" class="js-test-energy">Energy needed for range: </div>
        </div>
        

        <div class="middle">
            <h1>Until Full (SOC)</h1>
            <div id="fullCharge" class="spaced-div">100%</div>

            <h3>Charging Time</h3>
            <div id="chargeTimeForFullCharge" class="spaced-div">Charge time for full charge: </div>

            <h3>Charging Costs</h3>
            <div id="chargeCostFullCharge" class="spaced-div js-test-cost-fullcharge" >Charge cost in €/kWh for full charge: </div>

            <h3>Energy</h3>
            <div id="energyToFullCharge">Energy needed for full charge: </div>
        </div>


        <div class="right-side">
            <h1>State of Charge</h1>
            <div id="stateOfCharge" class="spaced-div">SOC: </div>

            <h3>Distance</h3>
            <div id="currentOperatingRange" class="js-test-current-operating-range">Operation range: </div>
        </div>
               
    </div>`;
  document.body.appendChild(testContainer);
});

afterEach(() => {
  document.body.removeChild(testContainer);
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

    calculator.stateOfCharge = 20;
    calculator.pricingModel = 'energy';
    calculator.energyPrice = 0;
    calculator.batteryCapacity = 57.5;
    calculator.updateCalculations();

    expect(document.getElementById('chargeCostFullCharge').textContent).toBe('0.00 €');
  });

  it('displays cost: 0 when time based cost is 0', () => {

    calculator.stateOfCharge = 20;
    calculator.pricingModel = 'time';
    calculator.energyPrice = 0;
    calculator.batteryCapacity = 57.5;
    calculator.chargerPower = 7.4;
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

  it('displays charge time: 0 when charging is not needed', () => {
    calculator.stateOfCharge = 100;
    calculator.desiredRange = 100;
    calculator.batteryCapacity = 52;
    calculator.bevEnergyConsumption = 20;
    calculator.updateCalculations();

    expect(document.getElementById('chargeTimeForRange').textContent).toBe('0 min');
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

describe('test suite: calculating operating range with current battery energy', () => {

  it('calculates range with valid information', () => {

    calculator.stateOfCharge = 5;
    calculator.batteryCapacity = 150;
    calculator.bevEnergyConsumption = 15;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toBe('50.00 km');
  });


  it('displays operating range: 0 when energy consumption is 0', () => {

    calculator.stateOfCharge = 5;
    calculator.batteryCapacity = 118;
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
    calculator.batteryCapacity = 57.5;
    calculator.bevEnergyConsumption = 13.7;
    calculator.updateCalculations();

    expect(document.getElementById('currentOperatingRange').textContent).toContain('0.00 km');
  })
});