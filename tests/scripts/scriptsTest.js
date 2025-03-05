import { calcEnergyNeededForRange, calcChargeCostFullCharge, calcOperatingRange } from '../../scripts/scripts.js';

beforeEach(() => {
  document.querySelector('.js-test-container').innerHTML = `
        
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
});

afterEach(() => {
  document.querySelector('.js-test-container').innerHTML = ' ';
});

describe('test suite: calculating energy to be charged for required range', () => {

  it('calculates energy required with valid information', () => {
    calcEnergyNeededForRange(200, 15, 20, 60, undefined);
    expect(document.querySelector('.js-test-energy').innerText).toContain('18.00 kWh');
  });


  //Need to change tests to these
  it('calculates energy required with valid information', () => {
    calcEnergyNeededForRange(200, 15, 20, 60, undefined);
    expect(document.getElementById('energyNeededForRange').innerText).toContain('18.00 kWh');
  });

  it('displays energy: 0 when charging is not needed', () => {
    calcEnergyNeededForRange(100, 12, 100, 60, undefined);
    expect(document.querySelector('.js-test-energy').innerText).toContain('0 kWh');
  });

  it('calculates energy with values containing decimals', () => {
    calcEnergyNeededForRange(200, 13.7, 20, 57.5, undefined);
    expect(document.querySelector('.js-test-energy').innerText).toContain('15.90 kWh');
  });

  it('calculates energy with SOC = 0%', () => {
    calcEnergyNeededForRange(100, 13.7, 0, 57.5, undefined);
    expect(document.querySelector('.js-test-energy').innerText).toContain('13.70 kWh');
  });
});

describe('test suite: calculating cost of charging to full', () => {

  it('calculates cost based on energy based price with valid information', () => {

    calcChargeCostFullCharge(0.20, 60, 30, 'energy', null);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('8.40 €');
  });

  it('calculates cost based on time based price with valid information', () => {

    calcChargeCostFullCharge(0.10, 60, 40, 'time', 11);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('0.33 €');
  });

  it('calculates energy based cost with values containing decimals', () => {

    calcChargeCostFullCharge(0.25, 57.5, 20, 'energy', null);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('11.50 €');
  });

  it('calculates time based cost with values containing decimals', () => {

    calcChargeCostFullCharge(0.37, 57.5, 20, 'time', 7.4);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('2.30 €');

  });

  it('displays cost: 0 when energy based cost is 0', () => {

    calcChargeCostFullCharge(0, 57.5, 20, 'energy', 7.4);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('0.00 €');
  });

  it('displays cost: 0 when time based cost is 0', () => {

    calcChargeCostFullCharge(0, 57.5, 20, 'time', 7.4);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (time-based price)', () => {

    calcChargeCostFullCharge(0.20, 57.5, 100, 'time', 7.4);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('0.00 €');
  });

  it('displays cost: 0 when charging is not needed (energy-based price)', () => {

    calcChargeCostFullCharge(0.20, 57.5, 100, 'energy', 7.4);

    expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('0.00 €');
  });

  /*
  
  The code does not handle situations like these.
 
  it('returns error when using time based pricing, but charge power is not provided', () => {
     calcChargeCostFullCharge(0.10, 60, 40, 'time', null);
 
     expect(document.querySelector('.js-test-cost-fullcharge').innerText).toContain('error');
 
   });
   */
});

describe('test suite: calculating charge time for range', () => {

  it('calculates charge time with valid information', () => {
    calcEnergyNeededForRange(500, 15, 40, 60, 50);

    expect(document.querySelector('.js-test-charge-time-range').innerText).toContain('1 h 1 min');
  });

  it('displays charge time: 0 when charging is not needed', () => {
    calcEnergyNeededForRange(100, 20, 100, 52, null);

    expect(document.querySelector('.js-test-charge-time-range').innerText).toContain('0 min');
  });

  it('calculates charge time with values containing decimals', () => {
    calcEnergyNeededForRange(150, 13.5, 20, 52.5, 7.4);

    expect(document.querySelector('.js-test-charge-time-range').innerText).toContain('1 h 19 min');
  });
});

describe('test suite: calculating operating range with current battery energy', () => {

  it('calculates range with valid information', () => {
    calcOperatingRange(150, 15, 5);

    expect(document.querySelector('.js-test-current-operating-range').innerText).toContain('50.00 km');
  });

  /* The code does not handle situations like these.
 
   it('displays an error when energy consumption is 0', () => {
     calcOperatingRange(150, 0, 5);
 
     expect(document.querySelector('.js-test-current-operating-range').innerText).toContain('error');
 
   });
   */

  it('calculates range with values containing decimals', () => {
    calcOperatingRange(57.5, 13.7, 10);

    expect(document.querySelector('.js-test-current-operating-range').innerText).toContain('41.97 km');
  });

  it('displays range: 0 when charging is not needed', () => {
    calcOperatingRange(57.5, 13.7, 0);

    expect(document.querySelector('.js-test-current-operating-range').innerText).toContain('0.00 km');
  })
});