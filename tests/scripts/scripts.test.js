import { calcEnergyNeededForRange, calcChargeCostFullCharge, calcOperatingRange } from '../../scripts/scripts.js';

let testContainer;

beforeEach(() => {

  testContainer = document.createElement('div');
  testContainer.className = 'js-test-container';
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
    calcEnergyNeededForRange(200, 15, 20, 60, undefined);
    expect(document.getElementById('energyNeededForRange').textContent).toBe('18.00 kWh');
  });

  it('displays energy: 0 when charging is not needed', () => {
    calcEnergyNeededForRange(100, 12, 100, 60, undefined);
    expect(document.getElementById('energyNeededForRange').textContent).toContain('0 kWh');
  });

  it('calculates energy with values containing decimals', () => {
    calcEnergyNeededForRange(200, 13.7, 20, 57.5, undefined);
    expect(document.getElementById('energyNeededForRange').textContent).toContain('15.90 kWh');
  });

  it('calculates energy with SOC = 0%', () => {
    calcEnergyNeededForRange(100, 13.7, 0, 57.5, undefined);
    expect(document.getElementById('energyNeededForRange').textContent).toContain('13.70 kWh');
  });
});

describe('test suite: calculating cost of charging to full', () => {

  it('calculates cost based on energy based price with valid information', () => {

    calcChargeCostFullCharge(0.20, 60, 30, 'energy', null);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('8.40 €');
  });

  it('calculates cost based on time based price with valid information', () => {

    calcChargeCostFullCharge(0.10, 60, 40, 'time', 11);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('0.33 €');
  });

  it('calculates energy based cost with values containing decimals', () => {

    calcChargeCostFullCharge(0.25, 57.5, 20, 'energy', null);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('11.50 €');
  });

  it('calculates time based cost with values containing decimals', () => {

    calcChargeCostFullCharge(0.37, 57.5, 20, 'time', 7.4);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('2.30 €');

  });

  it('displays cost: 0 when energy based cost is 0', () => {

    calcChargeCostFullCharge(0, 57.5, 20, 'energy', 7.4);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('0.00 €');
  });

  it('displays cost: 0 when time based cost is 0', () => {

    calcChargeCostFullCharge(0, 57.5, 20, 'time', 7.4);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (time-based price)', () => {

    calcChargeCostFullCharge(0.20, 57.5, 100, 'time', 7.4);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (energy-based price)', () => {

    calcChargeCostFullCharge(0.20, 57.5, 100, 'energy', 7.4);
    expect(document.getElementById('chargeCostFullCharge').textContent).toContain('0.00 €');
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
    calcEnergyNeededForRange(500, 15, 40, 60, 50);

    expect(document.getElementById('chargeTimeForRange').textContent).toContain('1 h 1 min');
  });

  it('displays charge time: 0 when charging is not needed', () => {
    calcEnergyNeededForRange(100, 20, 100, 52, null);

    expect(document.getElementById('chargeTimeForRange').textContent).toContain('0 min');
  });

  it('calculates charge time with values containing decimals', () => {
    calcEnergyNeededForRange(150, 13.5, 20, 52.5, 7.4);

    expect(document.getElementById('chargeTimeForRange').textContent).toContain('1 h 19 min');
  });
});

describe('test suite: calculating operating range with current battery energy', () => {

  it('calculates range with valid information', () => {
    calcOperatingRange(150, 15, 5);

    expect(document.getElementById('currentOperatingRange').textContent).toContain('50.00 km');
  });

 
   it('displays operating range: 0 when energy consumption is 0', () => {
     calcOperatingRange(118, 0, 5);
 
     expect(document.getElementById('currentOperatingRange').textContent).toContain('0 km');
 
   });

  it('calculates range with values containing decimals', () => {
    calcOperatingRange(57.5, 13.7, 10);

    expect(document.getElementById('currentOperatingRange').textContent).toContain('41.97 km');
  });

  it('displays range: 0 when SOC is 0', () => {
    calcOperatingRange(57.5, 13.7, 0);

    expect(document.getElementById('currentOperatingRange').textContent).toContain('0.00 km');
  })
});