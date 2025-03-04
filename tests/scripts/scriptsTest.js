import { calcEnergyNeededForRange } from '../../scripts/scripts.js';

beforeEach(() => {
  document.querySelector('.js-test-container').innerHTML = `
        
  <div class="left-side">
      <h1>Distance</h1>
      <div id="maxOperatingRange" class="spaced-div">TEST</div>

      <h3>Charging Time</h3>
      <div id="chargeTimeForRange" class="spaced-div">Charge time needed for range: </div>
     
      <h3>Charging Costs</h3>
      <div id="chargeCostRange" class="spaced-div">Charge cost in €/kWh for desired range: </div>

      <h3>Number of Charges</h3>
      <div id="chargesRequired" class="spaced-div">TEST</div>

      <h3>Energy</h3>
      <div id="energyNeededForRange" class="js-test-energy" >Energy needed for range: </div>
  `;
});

afterEach(() => {
  document.querySelector('.js-test-container').innerHTML = ' ';
});

describe('test suite: calculating energy to be charged', () => {

  it('calculates energy required with valid information', () => {
    calcEnergyNeededForRange(200, 15, 20, 60, undefined);
     expect(document.querySelector('.js-test-energy').innerText).toContain('18.00 kWh');
  });

  it('returns energy: 0 when charging is not needed', () => {
    calcEnergyNeededForRange(100, 12, 100, 60, undefined);
    expect(document.querySelector('.js-test-energy').innerText).toContain('0 kWh');
  })

  it('calculates energy with values containing decimals', () => {
    calcEnergyNeededForRange(200, 13.7, 20, 57.5, undefined);
    expect(document.querySelector('.js-test-energy').innerText).toContain('15.90 kWh');
  })
}
);
