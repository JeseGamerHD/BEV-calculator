/*This file contains the main logic for the calculator. It handles the calculations and updates the UI with the results.*/
import { Results } from "./results.js";

class Calculator {
    constructor(values) {
        this.desiredRange = values.desiredRange;
        this.batteryCapacity = values.batteryCapacity;
        this.bevEnergyConsumption = values.bevEnergyConsumption;
        this.stateOfCharge = values.stateOfCharge;
        this.chargerPower = values.chargerPower;
        this.chargerPowerAlt = values.chargerPowerAlt;
        this.energyPrice = values.energyPrice;
        this.energyPriceAlt = values.energyPriceAlt;
        this.energyNeededForRange = 0;
        this.pricingModel = values.pricingModel;
        this.pricingModelAlt = values.pricingModelAlt;
        this.alt = false;
        this.results = new Results(); // Results are stored and updated to this object
    }
    
    setData(variable, value) {
        this[variable] = value;
        this.updateCalculations();
    }

    /**
    * Returns the **numeric** results of the calculations in a Results class object
    * @returns {Results} results
    */
    getResults() {
        return this.results;
    }

    toggleComparison() {
        this.alt = !this.alt;
        this.updateCalculations();
    }

    updateCalculations() {
        console.log("Updating calculations with values:", this);
        
        // Calculate primary values
        this.calcMaxOperatingRange();
        this.calcEnergyNeededForRange(false);
        this.calcEnergytoFullCharge(false);
        this.calcChargeCostRange(false);
        this.calcChargeCostFullCharge(false);
        this.calcOperatingRange();
        this.setStateOfCharge();
        this.setDesiredRange();
        
        // Calculate alternative values for comparison if toggle is active
        if(this.alt) {
            this.calcEnergyNeededForRange(true);
            this.calcEnergytoFullCharge(true);
            this.calcChargeCostRange(true);
            this.calcChargeCostFullCharge(true);
            
            // Update comparison bars
            this.updateComparisonBars("comparisonBarRangeTime1", "comparisonBarRangeTime2", "chargeTimeForRangeOption1", "chargeTimeForRangeOption2");
            this.updateComparisonBars("comparisonBarRangeCost1", "comparisonBarRangeCost2", "chargeCostForRangeOption1", "chargeCostForRangeOption2");
            this.updateComparisonBars("comparisonBarFullChargeTime1", "comparisonBarFullChargeTime2", "chargeTimeForFullChargeOption1", "chargeTimeForFullChargeOption2");
            this.updateComparisonBars("comparisonBarFullChargeCost1", "comparisonBarFullChargeCost2", "chargeCostForFullChargeOption1", "chargeCostForFullChargeOption2");
        }
    }
    // Calculates the maximum operating range based on battery capacity and energy consumption
    // and updates the charges required for the desired range.
    calcMaxOperatingRange() {
        const maxOperatingRange = (this.batteryCapacity / this.bevEnergyConsumption) * 100; // in km
    
        this.updateChargesRequired();
        return maxOperatingRange;
    }
    // Calculates the current operating range based on battery capacity, energy consumption, and state of charge.
    calcOperatingRange() {
        if (this.bevEnergyConsumption === 0 || this.bevEnergyConsumption === null) {
            console.log("Error: BEV energy consumption is 0. Cannot calculate operating range.");
            this.updateValueForResult("0 km", "currentOperatingRange");
            this.results.currentRange = 0;
            return;
        }

        const operatingRange = (this.batteryCapacity / this.bevEnergyConsumption) * (this.stateOfCharge); // in km
        if(operatingRange === null || isNaN(operatingRange)) {
            this.updateValueForResult("0" + " km", "currentOperatingRange");
            this.results.currentRange = 0;
            return operatingRange;
        } else {
            this.updateValueForResult(operatingRange.toFixed(0) + " km", "currentOperatingRange");
            this.results.currentRange = operatingRange.toFixed(2);
            return operatingRange;
        }
    }
    // Updates the state of charge display in the UI.
    setStateOfCharge() {
        this.updateValueForResult(this.stateOfCharge.toFixed(0) + " %", "stateOfCharge");
    }
    // Updates the desired range (Distance) display in the UI.
    setDesiredRange() {
        if(this.desiredRange === null) {
            this.updateValueForResult(0 + " km", "desiredRange");
        } else {
            this.updateValueForResult(this.desiredRange + " km", "desiredRange");
        }
    }

    /** Getter for charger power  
    *   @returns {chargerPower} chargerPower*/
    getChargerPower() {
        if(this.chargerPower === null) {
            return 0;
        }
        return this.chargerPower.toFixed(1);
    }
    /** Getter for charger power alternative
     *  @returns {chargerPowerAlt} chargerPowerAlt*/
    getChargerPowerAlt() {
        if(this.chargerPowerAlt === null) {
            return 0;
        }
        return this.chargerPowerAlt.toFixed(1);
    }
    /** Getter for energy price
     * *  @returns {energyPrice} energyPrice*/
    getEnergyPrice() {
        let model = "";
        if (this.pricingModel === "energy") {
            model = "€/kWh";
        } else if (this.pricingModel === "time") {
            model = "€/h";
        }

        let energyPrice = this.energyPrice === null ? 0 : this.energyPrice.toFixed(2);
        return  energyPrice + " " + model;
    }
    /** Getter for energy price alternative
     * *  @returns {energyPriceAlt} energyPriceAlt*/
    getEnergyPriceAlt() {
        let model = "";
        if (this.pricingModelAlt === "energy") {
            model = "€/kWh";
        } else if (this.pricingModelAlt === "time") {
            model = "€/h";
        }
        let energyPrice = this.energyPriceAlt === null ? 0 : this.energyPriceAlt.toFixed(2);
        return energyPrice + " " + model;
    }
    // Calculates the energy needed for the desired range and updates the UI
    // Calls calcChargeTimeForRange
    calcEnergyNeededForRange(isAlt) {
        const energyNeededForRange = (this.bevEnergyConsumption / 100) * this.desiredRange;
        const currentEnergy = (this.stateOfCharge / 100) * this.batteryCapacity;
        const energyToCharge = energyNeededForRange - currentEnergy;
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        if (energyToCharge <= 0) {
            if (!isAlt) {
                this.updateValueForResult("0.00 kWh", "energyNeededForRange");
            }
            this.calcChargeTimeForRange(0, isAlt);
            this.results.rangeEnergy = 0;
            return 0;
        }
        
        if (!isAlt) {
            this.updateValueForResult(energyToCharge.toFixed(2) + " kWh", "energyNeededForRange");
        }
        
        this.calcChargeTimeForRange(energyToCharge, isAlt);
        this.results.rangeEnergy = energyToCharge;
        return energyToCharge;
    }
    // Calculates the energy needed to fully charge the battery and updates the UI
    // Calls calcChargeTimeForFullCharge
    calcEnergytoFullCharge(isAlt) {
        const energyToFullCharge = this.batteryCapacity - ((this.stateOfCharge / 100) * this.batteryCapacity);
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        this.calcChargeTimeForFullCharge(energyToFullCharge, isAlt);
        
        if (!isAlt) {
            this.updateValueForResult(energyToFullCharge.toFixed(2) + " kWh", "energyToFullCharge");
        }
        
        this.results.fullChargeEnergy = energyToFullCharge;
        return energyToFullCharge;
    }
    // Calculates the charge time for a given range and updates the UI
    calcChargeTimeForRange(energyToCharge, isAlt) {
        
        if(!isAlt) { // set to zero so wont have to put these in every if else segment
            this.results.rangeTime.hours = 0; // At the bottom values are assigned
            this.results.rangeTime.minutes = 0;
        } else {
            this.results.rangeTimeAlt.hours = 0;
            this.results.rangeTimeAlt.minutes = 0;
        }
        
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        // Get the localization keys to update messages in the UI based on locale
        const notNeededMessage = document.querySelector('[data-localization="results.chargingTime.notNeeded"]')?.textContent || "Charging not needed";
        const chargerNotSetMessage = document.querySelector('[data-localization="results.chargingCosts.chargerNotSet"]')?.textContent || "Charger power not set";
        const batteryNotSetMessage = document.querySelector('[data-localization="results.chargingTime.batteryNotSet"]')?.textContent || "Battery capacity not set";
        const consumptionNotSetMessage = document.querySelector('[data-localization="results.chargingTime.consumptionNotSet"]')?.textContent || "Consumption not set";
        // Check if battery capacity is valid
        if (this.batteryCapacity <= 0) {
            console.log("Error: Cannot calculate charge time for range. Battery capacity is not set.");
            if (!isAlt) {
                this.updateValueForResult(batteryNotSetMessage, "chargeTimeForRange");
                this.updateValueForResult(batteryNotSetMessage, "chargeTimeForRangeOption1");
                this.updateValueForResult("", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(batteryNotSetMessage, "chargeTimeForRangeOption2");
                this.updateValueForResult("", "chargerPowerOption2-1");
            }
            return 0;
        }
        
        if (this.bevEnergyConsumption <= 0) {
            if (!isAlt) {
                this.updateValueForResult(consumptionNotSetMessage, "chargeTimeForRange");
                this.updateValueForResult(consumptionNotSetMessage, "chargeTimeForRangeOption1");
                this.updateValueForResult("", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(consumptionNotSetMessage, "chargeTimeForRangeOption2");
                this.updateValueForResult("", "chargerPowerOption2-1");
            }
            return 0;
        }

        if ((chargerPower === 0 || chargerPower === null) && energyToCharge > 0) {
            console.log("Error: Cannot calculate charge time for range. Charge power is missing.");
            if (!isAlt) {
                this.updateValueForResult(chargerNotSetMessage, "chargeTimeForRange");
                this.updateValueForResult(chargerNotSetMessage, "chargeTimeForRangeOption1");
                this.updateValueForResult("", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(chargerNotSetMessage, "chargeTimeForRangeOption2");
                this.updateValueForResult("", "chargerPowerOption2-1");
            }
            return 0;
        }
        
        if (energyToCharge <= 0) {
            
            if (!isAlt) {
                this.updateValueForResult(notNeededMessage, "chargeTimeForRange");
                this.updateValueForResult(notNeededMessage, "chargeTimeForRangeOption1");
                this.updateValueForResult("", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(notNeededMessage, "chargeTimeForRangeOption2");
                this.updateValueForResult("", "chargerPowerOption2-1");
            }
            return 0;
        }
        
        const chargeTimeForRange = energyToCharge / chargerPower; // in hours
        const hours = Math.floor(chargeTimeForRange);
        const minutes = Math.round((chargeTimeForRange - hours) * 60);

        if (hours === 0 && minutes === 0) {
            if (!isAlt) {
                this.updateValueForResult("<1 min", "chargeTimeForRange");
                this.updateValueForResult("<1 min", "chargeTimeForRangeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult("<1 min", "chargeTimeForRangeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-1");
            }
            return chargeTimeForRange;
        }
        // **** //
        if (hours > 0) {
            if (!isAlt) {
                this.updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRange");
                this.updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRangeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRangeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-1");
            }
        } else {
            if (!isAlt) {
                this.updateValueForResult(`${minutes} min`, "chargeTimeForRange");
                this.updateValueForResult(`${minutes} min`, "chargeTimeForRangeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(`${minutes} min`, "chargeTimeForRangeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-1");
            }
        }

        if(!isAlt) {
            this.results.rangeTime.hours = hours;
            this.results.rangeTime.minutes = minutes;
        } else {
            this.results.rangeTimeAlt.hours = hours;
            this.results.rangeTimeAlt.minutes = minutes;
        }
        
        return chargeTimeForRange;
    }

    // Calculates the charge time for a full charge and updates the UI
    calcChargeTimeForFullCharge(energyNeeded, isAlt) {
        
        if(!isAlt) { // set to zero so wont have to put these in every if else segment
            this.results.fullChargeTime.hours = 0; // At the bottom values are assigned
            this.results.fullChargeTime.minutes = 0;
        } else {
            this.results.fullChargeTimeAlt.hours = 0;
            this.results.fullChargeTimeAlt.minutes = 0;
        }
        // Get the localization keys to update messages in the UI based on locale
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        const notNeededMessage = document.querySelector('[data-localization="results.chargingTime.notNeeded"]')?.textContent || "Charging not needed";
        const chargerNotSetMessage = document.querySelector('[data-localization="results.chargingCosts.chargerNotSet"]')?.textContent || "Charger power not set";   
        const batteryNotSetMessage = document.querySelector('[data-localization="results.chargingTime.batteryNotSet"]')?.textContent || "Battery capacity not set"; 
        
        // Check if battery capacity is valid
        if (this.batteryCapacity <= 0) {
            console.log("Error: Cannot calculate charge time for full charge. Battery capacity is not set.");
            if (!isAlt) {
                this.updateValueForResult(batteryNotSetMessage, "chargeTimeForFullCharge");
                this.updateValueForResult(batteryNotSetMessage, "chargeTimeForFullChargeOption1");
                this.updateValueForResult("", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult(batteryNotSetMessage, "chargeTimeForFullChargeOption2");
                this.updateValueForResult("", "chargerPowerOption2-2");
            }
            return 0;
        }
        
        if ((chargerPower === 0 || chargerPower === null) && energyNeeded > 0) {
            console.log("Error: BEV charge power is 0. Cannot calculate charge time for full charge.");
            if (!isAlt) {
                this.updateValueForResult(chargerNotSetMessage, "chargeTimeForFullCharge");
                this.updateValueForResult(chargerNotSetMessage, "chargeTimeForFullChargeOption1");
                this.updateValueForResult("", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult(chargerNotSetMessage, "chargeTimeForFullChargeOption2");
                this.updateValueForResult("", "chargerPowerOption2-2");
                
            }
            return 0;
        }
        if (energyNeeded <= 0) {
            
            if (!isAlt) {
                this.updateValueForResult(notNeededMessage, "chargeTimeForFullCharge");
                this.updateValueForResult(notNeededMessage, "chargeTimeForFullChargeOption1");
                this.updateValueForResult("", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult(notNeededMessage, "chargeTimeForFullChargeOption2");
                this.updateValueForResult("", "chargerPowerOption2-2");
            }
            return 0;
        }

        const chargeTimeForFullCharge = energyNeeded / chargerPower; // in hours
        const hours = Math.floor(chargeTimeForFullCharge);
        const minutes = Math.round((chargeTimeForFullCharge - hours) * 60);
        
        if (hours === 0 && minutes === 0) {
            if (!isAlt) {
                this.updateValueForResult("<1 min", "chargeTimeForFullCharge");
                this.updateValueForResult("<1 min", "chargeTimeForFullChargeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult("<1 min", "chargeTimeForFullChargeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-2");
            }
            return chargeTimeForFullCharge;
        }
        
        if (hours > 0) {
            if (!isAlt) {
                this.updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullCharge");
                this.updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullChargeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullChargeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-2");
            }
        } else {
            if (!isAlt) {
                this.updateValueForResult(`${minutes} min`, "chargeTimeForFullCharge");
                this.updateValueForResult(`${minutes} min`, "chargeTimeForFullChargeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult(`${minutes} min`, "chargeTimeForFullChargeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-2");
            }
        }

        if(!isAlt) { // Store results
            this.results.fullChargeTime.hours = hours;
            this.results.fullChargeTime.minutes = minutes;
        } else {
            this.results.fullChargeTimeAlt.hours = hours;
            this.results.fullChargeTimeAlt.minutes = minutes;
        }
        
        return chargeTimeForFullCharge;
    }
    // Calculates the charge cost for a given range and updates the UI
    calcChargeCostRange(isAlt) {
        const price = isAlt ? this.energyPriceAlt : this.energyPrice;
        const pricingModel = isAlt ? this.pricingModelAlt : this.pricingModel;
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        // Get the localization keys to update messages in the UI based on locale
        const priceNotSetMessage = document.querySelector('[data-localization="results.chargingCosts.priceNotSet"]')?.textContent || "Price not set";
        const chargerNotSetMessage = document.querySelector('[data-localization="results.chargingCosts.chargerNotSet"]')?.textContent || "Charger power not set";
        const notNeededMessage = document.querySelector('[data-localization="results.chargingTime.notNeeded"]')?.textContent || "Charging not needed";
        const consumptionNotSetMessage = document.querySelector('[data-localization="results.chargingTime.consumptionNotSet"]')?.textContent || "Consumption not set";
        // Calculate energy needed
        const energyNeededForRange = (this.bevEnergyConsumption / 100) * this.desiredRange;
        const currentEnergy = (this.stateOfCharge / 100) * this.batteryCapacity;
        const energyToCharge = Math.max(0, energyNeededForRange - currentEnergy);
        
        let chargeCost = 0;
        this.results.rangeCost = isAlt ? this.results.rangeCost : 0;
        this.results.rangeCostAlt = isAlt ? 0 : this.results.rangeCost;
        
        if(this.bevEnergyConsumption <= 0) {
            if (!isAlt) {
                this.updateValueForResult(consumptionNotSetMessage, "chargeCostRange");
                this.updateValueForResult(consumptionNotSetMessage, "chargeCostForRangeOption1");
                this.updateValueForResult("", "energyPriceOption1-1");
            } else {
                this.updateValueForResult(consumptionNotSetMessage, "chargeCostForRangeOption2");
                this.updateValueForResult("", "energyPriceOption2-1");
            }
            return 0;
        }
        if (energyToCharge <= 0) {
            if (!isAlt) {
                this.updateValueForResult(notNeededMessage, "chargeCostRange");
                this.updateValueForResult(notNeededMessage, "chargeCostForRangeOption1");
                this.updateValueForResult("", "energyPriceOption1-1");
            } else {
                this.updateValueForResult(notNeededMessage, "chargeCostForRangeOption2");
                this.updateValueForResult("", "energyPriceOption2-1");
            }
            return 0;
        }
        
        // Check if price is valid (not 0, NaN, undefined, etc.)
        if (!price || isNaN(price) || price <= 0) {
            if (!isAlt) {
                this.updateValueForResult(priceNotSetMessage, "chargeCostRange");
                this.updateValueForResult(priceNotSetMessage, "chargeCostForRangeOption1");
                this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-1");
            } else {
                this.updateValueForResult(priceNotSetMessage, "chargeCostForRangeOption2");
                this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-1");
            }
            return 0;
        }
        
        // Check for valid pricing model
        if (pricingModel === "energy") {
            chargeCost = price * energyToCharge;      
        } else if (pricingModel === "time") {
            // Check if charger power is valid (not 0, NaN, undefined, etc.)
            if (!chargerPower || isNaN(chargerPower) || chargerPower <= 0) {
                if (!isAlt) {
                    this.updateValueForResult(chargerNotSetMessage, "chargeCostRange");
                    this.updateValueForResult(chargerNotSetMessage, "chargeCostForRangeOption1");
                    this.updateValueForResult("", "energyPriceOption1-1");
                } else {
                    this.updateValueForResult(chargerNotSetMessage, "chargeCostForRangeOption2");
                    this.updateValueForResult("", "energyPriceOption2-1");
                }
                return 0;
            }

            const chargeTime = energyToCharge / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
        } else {
            if (!isAlt) {
                this.updateValueForResult("Pricing model is missing", "chargeCostRange");
                this.updateValueForResult("Pricing model is missing", "chargeCostForRangeOption1");
                this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-1");
            } else {
                this.updateValueForResult("Pricing model is missing", "chargeCostForRangeOption2");
                this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-1");
            }
            return 0;
        }
        
        // Add a final NaN check before displaying the result
        if (isNaN(chargeCost)) {
            console.error("Error: Calculated charge cost is NaN", {
                price, pricingModel, chargerPower, energyToCharge
            });
            chargeCost = 0;
        }
        
        // Update UI with results
        if (!isAlt) {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostRange");
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption1");
            this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-1");
            this.results.rangeCost = chargeCost.toFixed(2);
        } else {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption2");
            this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-1");
            this.results.rangeCostAlt = chargeCost.toFixed(2);
        }
        
        return chargeCost;
    }
    // Calculates the charge cost for a full charge and updates the UI
    calcChargeCostFullCharge(isAlt) {
        const price = isAlt ? this.energyPriceAlt : this.energyPrice;
        const pricingModel = isAlt ? this.pricingModelAlt : this.pricingModel;
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        // Get the localization keys to update messages in the UI based on locale
        const priceNotSetMessage = document.querySelector('[data-localization="results.chargingCosts.priceNotSet"]')?.textContent || "Price not set";
        const chargerNotSetMessage = document.querySelector('[data-localization="results.chargingCosts.chargerNotSet"]')?.textContent || "Charger power not set";
        const notNeededMessage = document.querySelector('[data-localization="results.chargingTime.notNeeded"]')?.textContent || "Charging not needed";
        const batteryNotSetMessage = document.querySelector('[data-localization="results.chargingTime.batteryNotSet"]')?.textContent || "Battery capacity not set";
        // Check if battery capacity is valid
        if (this.batteryCapacity <= 0) {
            if (!isAlt) {
                this.updateValueForResult(batteryNotSetMessage, "chargeCostFullCharge");
                this.updateValueForResult(batteryNotSetMessage, "chargeCostForFullChargeOption1");
                this.updateValueForResult("", "energyPriceOption1-2");
            } else {
                this.updateValueForResult(batteryNotSetMessage, "chargeCostForFullChargeOption2");
                this.updateValueForResult("", "energyPriceOption2-2");
            }
            return 0;
        }
        const energyNeeded = this.batteryCapacity - ((this.stateOfCharge / 100) * this.batteryCapacity);
        let chargeCost = 0;
        this.results.fullChargeCost = isAlt ? this.results.fullChargeCost : 0;
        this.results.fullChargeCostAlt = isAlt ? 0 : this.results.fullChargeCost;
        
        if (energyNeeded <= 0) {
            if (!isAlt) {
                this.updateValueForResult(notNeededMessage, "chargeCostFullCharge");
                this.updateValueForResult(notNeededMessage, "chargeCostForFullChargeOption1");
                this.updateValueForResult("", "energyPriceOption1-2");
            } else {
                this.updateValueForResult(notNeededMessage, "chargeCostForFullChargeOption2");
                this.updateValueForResult("", "energyPriceOption2-2");
            }
            return 0;
        }

        if (price === 0 || price === undefined || price === null) {
            if (!isAlt) {
                this.updateValueForResult(priceNotSetMessage, "chargeCostFullCharge");
                this.updateValueForResult(priceNotSetMessage, "chargeCostForFullChargeOption1");
                this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-2");
            } else {
                this.updateValueForResult(priceNotSetMessage, "chargeCostForFullChargeOption2");
                this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-2");
            }
            return 0;
        }

        if (pricingModel === "energy") {
            chargeCost = price * energyNeeded;
        } else if (pricingModel === "time") {
            // Check if charger power is valid (not 0, NaN, undefined, etc.)
            if (!chargerPower || isNaN(chargerPower) || chargerPower <= 0) {      
                if (!isAlt) {
                    this.updateValueForResult(chargerNotSetMessage, "chargeCostFullCharge");
                    this.updateValueForResult(chargerNotSetMessage, "chargeCostForFullChargeOption1");
                    this.updateValueForResult("", "energyPriceOption1-2");
                } else {
                    this.updateValueForResult(chargerNotSetMessage, "chargeCostForFullChargeOption2");
                    this.updateValueForResult("", "energyPriceOption2-2");
                }
                return 0;
            }
            
            const chargeTime = energyNeeded / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
        } else {
            console.log("Error: Cannot calculate charge cost for full charge. Pricing model is missing.");
            if (!isAlt) {
                this.updateValueForResult("0 €", "chargeCostFullCharge");
                this.updateValueForResult("0 €", "chargeCostForFullChargeOption1");
                this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-2");
            } else {
                this.updateValueForResult("0 €", "chargeCostForFullChargeOption2");
                this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-2");
            }
            return 0;
        }
        
        if (!isAlt) {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostFullCharge");
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption1");
            this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-2");
            this.results.fullChargeCost = chargeCost.toFixed(2);
        } else {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption2");
            this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-2");
            this.results.fullChargeCostAlt = chargeCost.toFixed(2);
        }
              
        return chargeCost;
    }
    // Updates the UI in case multiple charges are needed for the desired range
    updateChargesRequired() {
        // Calculate maximum range with a full battery
        const maxOperatingRange = (this.batteryCapacity / this.bevEnergyConsumption) * 100; // in km
        
        // Calculate how much energy we currently have
        const currentEnergy = (this.stateOfCharge / 100) * this.batteryCapacity;
        const energyNeededForRange = (this.bevEnergyConsumption / 100) * this.desiredRange;
        const energyToCharge = energyNeededForRange - currentEnergy;

        if (this.batteryCapacity <= 0) {
            this.results.chargeCount = 0;
            document.getElementById("header-span").style.display = "none";
            return 0;
        }
        // If desired range is higher than max range on a full battery,
        // we need multiple full charges to reach the target
        if (this.desiredRange > maxOperatingRange) {
            // Calculate how many full charges are needed for the desired range
            const fullChargesNeeded = Math.ceil(this.desiredRange / maxOperatingRange);
            console.log("Desired range exceeds max range. Need multiple charges:", 
                { desiredRange: this.desiredRange, maxRange: maxOperatingRange, fullChargesNeeded });
            
            // Display the info to the user
            document.getElementById("header-span").style.display = "block";
            this.results.chargeCount = fullChargesNeeded;
            return fullChargesNeeded;
        } else {
            // Standard calculation for when desired range is within max range capability
            const chargesRequired = Math.ceil(energyToCharge / this.batteryCapacity);
            console.log("Current energy: ", currentEnergy, "Energy needed for range: ", energyNeededForRange, "Energy to charge: ", energyToCharge, "Charges required: ", chargesRequired);
            
            if (chargesRequired > 1) {
                document.getElementById("header-span").style.display = "block";
            } else {
                document.getElementById("header-span").style.display = "none";
            }
            this.results.chargeCount = chargesRequired;
            return chargesRequired;
        }
    }
    
    // Updates the comparison bars in the UI based on the values of two elements
    // Used to update the comparison bars for charging time and cost
    updateComparisonBars(bar1ID, bar2ID, value1ID, value2ID) {
        const bar1 = document.getElementById(bar1ID);
        const bar2 = document.getElementById(bar2ID);
        
        if (!bar1 || !bar2) {
            console.error("Error: Comparison bars not found.", { bar1ID, bar2ID });
            return;
        }
        
        const value1Element = document.getElementById(value1ID);
        const value2Element = document.getElementById(value2ID);
        
        if (!value1Element || !value2Element) {
            console.error("Error: Value elements not found.", { value1ID, value2ID });
            return;
        }
        
        // Retrieve and parse the values from the specified elements
        const value1 = this.parseValue(value1Element.textContent);
        const value2 = this.parseValue(value2Element.textContent);
        
        if (isNaN(value1) || isNaN(value2)) {
            bar1.style.background = `rgb(255, 0, 255)`;
            bar2.style.background = `rgb(208,252,68)`;
            return;
        }

        if (value1 > value2 && value1 !== 0) {
            const bar2Width = (value2 / value1) * 100;
            bar1.style.background = `#ff00ff`;
            bar2.style.background = `linear-gradient(to right, rgb(208,252,68) 0%,rgb(208,252,68) ${bar2Width}%, rgb(0, 83, 151) ${bar2Width}%, rgb(0, 83, 151) 100%)`;
        } else if (value1 < value2 && value2 !== 0) {
            const bar1Width = (value1 / value2) * 100;
            bar1.style.background = `linear-gradient(to right, rgb(255, 0, 255) 0%,rgb(255, 0, 255) ${bar1Width}%, rgb(0, 83, 151) ${bar1Width}%, rgb(0, 83, 151) 100%)`;
            bar2.style.background = `#D0FC44`;
        } else {
            // If the values are equal or both are 0, fill both bars to the same color
            bar1.style.background = `rgb(255, 0, 255)`;
            bar2.style.background = `rgb(208,252,68)`;
        }
    }
    /** Helper function for updateComparisonBars to parse the values from the text content of the elements
     * @returns {number} number parsed value in minutes or kWh
     * @param {string} valueStr - The string to parse, e.g. "1h 34min", "6.90", "0.40", "€6.90"
     */
    parseValue(valueStr) {
        // Remove currency symbols and trim whitespace
        let cleanedStr = valueStr.replace(/[€$£]/g, '').trim();

        // Handle time formats like "1h 34min", "41 min"
        let timeMatch = cleanedStr.match(/(?:(\d+)\s*h)?\s*(\d+)\s*min/);
        if (timeMatch) {
            let hours = timeMatch[1] ? parseInt(timeMatch[1], 10) : 0;
            let minutes = parseInt(timeMatch[2], 10);
            return hours * 60 + minutes; // Convert to total minutes
        }

        // Handle regular numeric values like "6.90", "0.40"
        let numMatch = cleanedStr.match(/\d+(\.\d+)?/);
        if (numMatch) {
            return parseFloat(numMatch[0]);
        }

        // Return NaN if parsing fails
        return NaN;
    }
    /** Updates the value for a given result id in the UI
     * @param {string}  newValue - The new value to set for the result element
     * @param {string} resultid - The id of the result element to update */
    updateValueForResult(newValue, resultid) {
        if(newValue === null || resultid === null) {
            console.log("Error: updateValueForResult() requires both a value and a result id.");
            console.log("Value: ", newValue, "Result id: ", resultid);
            return;
        } else {
            try{
                document.getElementById(resultid).textContent = newValue;
            } catch (error) {
                console.log("Error: Could not update value for result id: ", resultid);
                console.log(error);
            }
        } 
    }
}

export default Calculator;