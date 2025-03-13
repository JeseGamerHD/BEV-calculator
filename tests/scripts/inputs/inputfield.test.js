import { fireEvent } from "@testing-library/dom";

let testContainer;

beforeEach(() => {

  testContainer = document.createElement('div');

  testContainer.innerHTML = `<div class="input-area-container">
            <div class="input-area-wrapper">
                <div class="numberInput-container">
                    <div class="numberInput-title-wrapper">
                        <h3 class="numberInput-title">Distance (km)</h3>
                        <div class="tooltip-container">
                            <div class="tooltip">The distance to your destination / The total length of your trip.</div>
                        </div>
                    </div>
                    <div class="numberInput-field-wrapper">
                        <input class="numberInput-field" id="desiredRange-input" data-type="integer" type="text" min="0" max="9999" data-property="desiredRange" placeholder="Enter target range (optional)">
                    </div>
                </div>
        
                <div class="rangeInput-container">
                    <h3 class="rangeInput-title"><strong>State of Charge</strong> (SOC)</h3>
                    <div class="rangeInput-field-wrapper">
                        <input class="rangeInput-field" id="SOC-field" data-type="integer" type="text" data-target="SOC-slider" min="0" max="100" data-property="stateOfCharge">
                        <span class="rangeInput-field-symbol">%</span>
                    </div> 
                    <input class="rangeInput" id="SOC-slider" type="range" min="0" max="100" data-target="SOC-field" data-property="stateOfCharge">
                </div>
    
                <span class="divider-line"></span>
        
                <div class="dropdownInput-container">
                    <div class="dropdown-title-wrapper">
                        <h3 class="dropdown-title"><strong>Battery Capacity</strong> (kWh)</h3>
                        <button class="dropdown-button" data-options="batteryCapacity-options"></button>
                    </div>
                    <div class="dropdown-wrapper">
                        <input class="dropdownInput-field" id="batteryCapacity-input" data-property="batteryCapacity" data-options="batteryCapacity-options" data-type="decimal" type="text" min="0" max="9999" placeholder="Enter or select battery capacity">             
                        <div class="dropdown-content" id="batteryCapacity-options">
                            <div class="dropdown-option" data-value="30" data-target="batteryCapacity-input">Small Batteries (30 kWh)</div>
                            <div class="dropdown-option" data-value="45" data-target="batteryCapacity-input">Light Batteries (45 kWh)</div>
                            <div class="dropdown-option" data-value="60" data-target="batteryCapacity-input">Mid-size Batteries (60 kWh)</div>
                            <div class="dropdown-option" data-value="85" data-target="batteryCapacity-input">Mid-size+ Batteries (85 kWh)</div>
                            <div class="dropdown-option" data-value="120" data-target="batteryCapacity-input">Large Batteries (120 kWh)</div>
                            <div class="dropdown-option" data-value="150" data-target="batteryCapacity-input">Extra Large Batteries (150 kWh)</div>
                        </div>
                    </div>
                </div>
        
                <div class="dropdownInput-container">
                    <div class="dropdown-title-wrapper">
                        <h3 class="dropdown-title"><strong>Energy Consumption</strong> (kWh / 100 km)</h3>
                        <button class="dropdown-button" data-options="energyConsumption-options"></button>
                    </div>
                    <div class="dropdown-wrapper">
                        <input class="dropdownInput-field" id="energyConsumption-input" data-property="bevEnergyConsumption" data-options="energyConsumption-options" data-type="decimal" type="text" min="0" max="999" placeholder="Enter or select energy consumption">             
                        <div class="dropdown-content" id="energyConsumption-options">
                            <div class="dropdown-option" data-value="12" data-target="energyConsumption-input">Small & City Cars (12 kWh/100 km)</div>
                            <div class="dropdown-option" data-value="15" data-target="energyConsumption-input">Light Vehicles (15 kWh/100 km)</div>
                            <div class="dropdown-option" data-value="19" data-target="energyConsumption-input">Mid-size Cars (19 kWh /100 km)</div>
                            <div class="dropdown-option" data-value="22" data-target="energyConsumption-input">Mid-size SUVs (22 kWh /100 km)</div>
                            <div class="dropdown-option" data-value="25" data-target="energyConsumption-input">Trucks & Large SUVs (25 kWh /100 km)</div>
                            <div class="dropdown-option" data-value="30" data-target="energyConsumption-input">Large Trucks (30 kWh /100 km)</div>
                        </div>
                    </div>
                </div>
    
                <span class="divider-line"></span>
        
                <div class="dropdownInput-container">
                    <div class="dropdown-title-wrapper">
                        <h3 class="dropdown-title">OPTION 1: <strong>Charge Power</strong> (kW)</h3>
                        <button class="dropdown-button" data-options="chargePower-options"></button>
                    </div>
                    <div class="dropdown-wrapper">
                        <input class="dropdownInput-field" id="chargePower-input" data-property="chargerPower" data-options="chargePower-options" data-type="decimal" type="text" min="0" max="999" placeholder="Enter or select charge power">             
                        <div class="dropdown-content" id="chargePower-options">
                            <div class="dropdown-option" data-value="1.4" data-target="chargePower-input">[AC] Slow Charging (1.4 kW)</div>
                            <div class="dropdown-option" data-value="3" data-target="chargePower-input">[AC] Slow Charging (3 kW)</div>
                            <div class="dropdown-option" data-value="7.4" data-target="chargePower-input">[AC] Medium-speed Charging (7.4 kW)</div>
                            <div class="dropdown-option" data-value="22" data-target="chargePower-input">[AC] Fast Charging (22 kW)</div>
                            <div class="dropdown-option" data-value="50" data-target="chargePower-input">[DC] Slow Charging (50 kW)</div>
                            <div class="dropdown-option" data-value="100" data-target="chargePower-input">[DC] Medium-speed Charging (100 kW)</div>
                            <div class="dropdown-option" data-value="150" data-target="chargePower-input">[DC] Fast Charging (150 kW)</div>
                            <div class="dropdown-option" data-value="250" data-target="chargePower-input">[DC] Ultra Fast Charging (250 kW)</div>
                        </div>
                    </div>
                </div>
        
                <div class="toggleInput-container">
                    <div class="toggleInput-title-wrapper">
                        <h3>Price</h3>
                        <div class="tooltip-container">
                            <div class="tooltip">The price of electricity or the hourly rate set by the charger operator.</div>
                        </div>
                    </div>
                    <div class="toggleInput-wrapper">
                        <input class="toggleInput-field" data-type="decimal" type="text" min="0" max="999" data-property="energyPrice" step="0.01" placeholder="Enter price"></input>
                        <div class="toggleInput-switch" id="pricing-toggle" data-property="pricingModel" data-left="energy" data-right="time" data-thumb="pricing-thumb">
                            <!--data-left & data-right: the data-value of the left/right toggle-option that belongs to this switch -->
                            <div class="toggleInput-track">
                                <div class="toggleInput-thumb" id="pricing-thumb"></div>
                            </div>
                            <div class="toggleInput-content">
                                <!--data-owner: the toggleInput-switch that the options belong to -->
                                <!-- Used for toggling css classes on the right options -->
                                <span class="toggle-option" data-owner="pricing-toggle" data-value="energy">€/kWh</span>
                                <span class="toggle-option" data-owner="pricing-toggle" data-value="time">€/h</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button id="addChargerPriceComparison">+ Add Option</button>

                <div class="chargerPricingAlt-wrapper" id="chargerPricingAlt-wrapper" style="visibility: none;">
                    <div class="dropdownInput-container">
                        <div class="dropdown-title-wrapper">
                            <h3 class="dropdown-title">OPTION 2: <strong>Charge Power</strong> (kW)</h3>
                            <button class="removeComparison" id="removeChargerPriceComparison" title="Removes the alternate charge power & pricing">Remove</button>
                            <span class="filler"></span>
                            <button class="dropdown-button" data-options="chargePower-options-alt"></button>
                        </div>
                        <div class="dropdown-wrapper">
                            <input class="dropdownInput-field" id="chargePower-input-alt" data-property="chargerPowerAlt" data-options="chargePower-options-alt" data-type="decimal" type="text" min="0" max="999" placeholder="Enter or select charge power">             
                            <div class="dropdown-content" id="chargePower-options-alt">
                                <div class="dropdown-option" data-value="1.4" data-target="chargePower-input-alt">[AC] Slow Charging (1.4 kW)</div>
                                <div class="dropdown-option" data-value="3" data-target="chargePower-input-alt">[AC] Slow Charging (3 kW)</div>
                                <div class="dropdown-option" data-value="7.4" data-target="chargePower-input-alt">[AC] Medium-speed Charging (7.4 kW)</div>
                                <div class="dropdown-option" data-value="22" data-target="chargePower-input-alt">[AC] Fast Charging (22 kW)</div>
                                <div class="dropdown-option" data-value="50" data-target="chargePower-input-alt">[DC] Slow Charging (50 kW)</div>
                                <div class="dropdown-option" data-value="100" data-target="chargePower-input-alt">[DC] Medium-speed Charging (100 kW)</div>
                                <div class="dropdown-option" data-value="150" data-target="chargePower-input-alt">[DC] Fast Charging (150 kW)</div>
                                <div class="dropdown-option" data-value="250" data-target="chargePower-input-alt">[DC] Ultra Fast Charging (250 kW)</div>
                            </div>
                        </div>
                    </div>
            
                    <div class="toggleInput-container">
                        <div class="toggleInput-title-wrapper">
                            <h3>Price</h3>
                        </div>
                        <div class="toggleInput-wrapper">
                            <input class="toggleInput-field" data-type="decimal" type="text" min="0" max="999" data-property="energyPriceAlt" step="0.01" placeholder="Enter price"></input>
                            <div class="toggleInput-switch" id="pricing-toggle-alt" data-property="pricingModelAlt" data-value="energy" data-left="energy" data-right="time" data-thumb="pricing-thumb-alt">
                                <!--data-left & data-right: the data-value of the left/right toggle-option that belongs to this switch -->
                                <div class="toggleInput-track">
                                    <div class="toggleInput-thumb" id="pricing-thumb-alt"></div>
                                </div>
                                <div class="toggleInput-content">
                                    <!--data-owner: the toggleInput-switch that the options belong to -->
                                    <!-- Used for toggling css classes on the right options -->
                                    <span class="toggle-option" data-owner="pricing-toggle-alt" data-value="energy">€/kWh</span>
                                    <span class="toggle-option" data-owner="pricing-toggle-alt" data-value="time">€/h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
                
        </div> 
  `;
  document.body.appendChild(testContainer);
});

afterEach(() => {
  document.body.removeChild(testContainer);
});

//TODO: figure which function to trigger an event is the best choice, needs to be tested more
describe('testing special characters as inputs', () => {
  it('changes special characters automatically', () => {

    const input = document.getElementById('desiredRange-input');

    fireEvent.input(input, { target: { value: '!"#¤%' } });

    expect(document.getElementById('desiredRange-input').textContent).toBe('');
  });

});