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
    }
    
    setData(variable, value) {
        this[variable] = value;
        this.updateCalculations();
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
    
    calcMaxOperatingRange() {
        if (this.bevEnergyConsumption === 0) {
            console.log("Error: BEV energy consumption is 0. Cannot calculate maxOperatingRange & ChargesRequired.");
            this.updateValueForResult("0", "chargesRequired");
            return;
        }
        const maxOperatingRange = (this.batteryCapacity / this.bevEnergyConsumption) * 100; // in km
        
        if (this.desiredRange > maxOperatingRange) {
            console.warn("Warning: The desired range exceeds the vehicle's maximum possible range on a full charge.");
            console.log("Desired range: ", this.desiredRange, "Max operating range: ", maxOperatingRange);
        }
        
        this.updateChargesRequired();
        return maxOperatingRange;
    }
    
    calcOperatingRange() {
        if (this.bevEnergyConsumption === 0) {
            console.log("Error: BEV energy consumption is 0. Cannot calculate operating range.");
            this.updateValueForResult("0 km", "currentOperatingRange");
            return;
        }
        const operatingRange = (this.batteryCapacity / this.bevEnergyConsumption) * (this.stateOfCharge); // in km
        this.updateValueForResult(operatingRange.toFixed(2) + " km", "currentOperatingRange");
        return operatingRange;
    }
    
    setStateOfCharge() {
        this.updateValueForResult(this.stateOfCharge.toFixed(0) + " %", "stateOfCharge");
    }
    
    setDesiredRange() {
        this.updateValueForResult(this.desiredRange + " km", "desiredRange");
    }
    getChargerPower() {
        return this.chargerPower.toFixed(1);
    }
    getChargerPowerAlt() {
        return this.chargerPowerAlt.toFixed(1);
    }
    getEnergyPrice() {
        let model = "";
        if (this.pricingModel === "energy") {
            model = "€/kWh";
        } else if (this.pricingModel === "time") {
            model = "€/h";
        }
        return this.energyPrice.toFixed(2) + " " + model;
    }
    getEnergyPriceAlt() {
        let model = "";
        if (this.pricingModelAlt === "energy") {
            model = "€/kWh";
        } else if (this.pricingModelAlt === "time") {
            model = "€/h";
        }
        return this.energyPriceAlt.toFixed(2) + " " + model;
    }

    calcEnergyNeededForRange(isAlt) {
        const energyNeededForRange = (this.bevEnergyConsumption / 100) * this.desiredRange;
        const currentEnergy = (this.stateOfCharge / 100) * this.batteryCapacity;
        const energyToCharge = energyNeededForRange - currentEnergy;
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        if (energyToCharge <= 0) {
            if (!isAlt) {
                this.updateValueForResult("0 kWh", "energyNeededForRange");
            }
            this.calcChargeTimeForRange(0, isAlt);
            return 0;
        }
        
        if (!isAlt) {
            this.updateValueForResult(energyToCharge.toFixed(2) + " kWh", "energyNeededForRange");
        }
        
        this.calcChargeTimeForRange(energyToCharge, isAlt);
        return energyToCharge;
    }
    
    calcEnergytoFullCharge(isAlt) {
        const energyToFullCharge = this.batteryCapacity - ((this.stateOfCharge / 100) * this.batteryCapacity);
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        this.calcChargeTimeForFullCharge(energyToFullCharge, isAlt);
        
        if (!isAlt) {
            this.updateValueForResult(energyToFullCharge.toFixed(2) + " kWh", "energyToFullCharge");
        }
        
        return energyToFullCharge;
    }
    
    calcChargeTimeForRange(energyToCharge, isAlt) {
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        // Get the localization key for "Charging not needed"
        const notNeededMessage = document.querySelector('[data-localization="results.chargingTime.notNeeded"]')?.textContent || "Charging not needed";

        if (chargerPower === 0) {
            console.log("Error: Cannot calculate charge time for range. Charge power is missing.");
            if (!isAlt) {
                this.updateValueForResult("0 min", "chargeTimeForRange");
                this.updateValueForResult("0 min", "chargeTimeForRangeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult("0 min", "chargeTimeForRangeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-1");
            }
            return 0;
        }
        
        if (energyToCharge <= 0) {
            
            if (!isAlt) {
                this.updateValueForResult(notNeededMessage, "chargeTimeForRange");
                this.updateValueForResult(notNeededMessage, "chargeTimeForRangeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-1");
            } else {
                this.updateValueForResult(notNeededMessage, "chargeTimeForRangeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-1");
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
        
        return chargeTimeForRange;
    }
    
    calcChargeTimeForFullCharge(energyNeeded, isAlt) {
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        // Get the localization key for "Charging not needed"
        const notNeededMessage = document.querySelector('[data-localization="results.chargingTime.notNeeded"]')?.textContent || "Charging not needed";
            
        if (chargerPower === 0) {
            console.log("Error: BEV charge power is 0. Cannot calculate charge time for full charge.");
            if (!isAlt) {
                this.updateValueForResult("0 min", "chargeTimeForFullCharge");
                this.updateValueForResult("0 min", "chargeTimeForFullChargeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult("0 min", "chargeTimeForFullChargeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-2");
            }
            return 0;
        }
        if (energyNeeded <= 0) {
            
            if (!isAlt) {
                this.updateValueForResult(notNeededMessage, "chargeTimeForFullCharge");
                this.updateValueForResult(notNeededMessage, "chargeTimeForFullChargeOption1");
                this.updateValueForResult(this.getChargerPower() + " kW", "chargerPowerOption1-2");
            } else {
                this.updateValueForResult(notNeededMessage, "chargeTimeForFullChargeOption2");
                this.updateValueForResult(this.getChargerPowerAlt() + " kW", "chargerPowerOption2-2");
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
        
        return chargeTimeForFullCharge;
    }
    
    calcChargeCostRange(isAlt) {
        const price = isAlt ? this.energyPriceAlt : this.energyPrice;
        const pricingModel = isAlt ? this.pricingModelAlt : this.pricingModel;
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        // Calculate energyNeededForRange
        const energyNeededForRange = (this.bevEnergyConsumption / 100) * this.desiredRange;
        const currentEnergy = (this.stateOfCharge / 100) * this.batteryCapacity;
        const energyToCharge = Math.max(0, energyNeededForRange - currentEnergy);
        
        let chargeCost = 0;
        
        if (chargerPower === 0) {
            console.log("Error: Cannot calculate charge cost for range. Charger power is missing.");
            if (!isAlt) {
                this.updateValueForResult("0 €", "chargeCostRange");
                this.updateValueForResult("0 €", "chargeCostForRangeOption1");
                this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-1");
            } else {
                this.updateValueForResult("0 €", "chargeCostForRangeOption2");
                this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-1");
            }
            return 0;
        }
        
        if (pricingModel === "energy") {
            chargeCost = price * energyToCharge;
        } else if (pricingModel === "time") {
            const chargeTime = energyToCharge / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
        } else {
            console.log("Error: Cannot calculate charge cost for range. Pricing model is missing.");
            if (!isAlt) {
                this.updateValueForResult("0 €", "chargeCostRange");
                this.updateValueForResult("0 €", "chargeCostForRangeOption1");
                this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-1");
            } else {
                this.updateValueForResult("0 €", "chargeCostForRangeOption2");
                this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-1");
            }
            return 0;
        }
        
        if (!isAlt) {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostRange");
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption1");
            this.updateValueForResult(this.getEnergyPrice(), "energyPriceOption1-1");
        } else {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption2");
            this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-1");
        }
        
        return chargeCost;
    }
    
    calcChargeCostFullCharge(isAlt) {
        const price = isAlt ? this.energyPriceAlt : this.energyPrice;
        const pricingModel = isAlt ? this.pricingModelAlt : this.pricingModel;
        const chargerPower = isAlt ? this.chargerPowerAlt : this.chargerPower;
        
        const energyNeeded = this.batteryCapacity - ((this.stateOfCharge / 100) * this.batteryCapacity);
        let chargeCost = 0;
        
        if (chargerPower === 0) {
            console.log("Error: Cannot calculate charge cost for full charge. Charger power is missing.");
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
        
        if (pricingModel === "energy") {
            chargeCost = price * energyNeeded;
        } else if (pricingModel === "time") {
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
        } else {
            this.updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption2");
            this.updateValueForResult(this.getEnergyPriceAlt(), "energyPriceOption2-2");
        }
        
        return chargeCost;
    }
    
    updateChargesRequired() {
        const currentEnergy = (this.stateOfCharge / 100) * this.batteryCapacity;
        const energyNeededForRange = (this.bevEnergyConsumption / 100) * this.desiredRange;
        const energyToCharge = energyNeededForRange - currentEnergy;

        
            const chargesRequired = Math.ceil(energyToCharge / this.batteryCapacity);
            if (chargesRequired > 1) {
                document.getElementById("header-span").style.display = "block";
            } else {
                document.getElementById("header-span").style.display = "none";
            }
            return chargesRequired;
        
    }
    
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