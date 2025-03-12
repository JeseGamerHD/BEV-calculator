/*Nykyisellä results-pagen rakenteella päivitetään kentät esim. updateValueForResult("Max operating range: " + maxOperatingRange.toFixed(2), "maxOperatingRange");
Jos results-pagella siirretään tuloksen numero-osuus omaan HTML-elementtiinsä, esim. div tai p jolla on id="maxOperatingRange"
voidaan kutsua ilman kovakoodattua merkkijonoa-> updateValueForResult(maxOperatingRange.toFixed(2), "maxOperatingRange");*/


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
        // Calculate all values
        calcMaxOperatingRange(this.desiredRange, this.batteryCapacity, this.bevEnergyConsumption, this.stateOfCharge);
        this.energyNeededForRange = calcEnergyNeededForRange(this.desiredRange, this.bevEnergyConsumption, this.stateOfCharge, this.batteryCapacity, this.chargerPower, false);
        calcEnergytoFullCharge(this.batteryCapacity, this.stateOfCharge, this.chargerPower, false);
        calcChargeCostRange(this.energyPrice, this.energyNeededForRange, this.pricingModel, this.chargerPower, false);
        calcChargeCostFullCharge(this.energyPrice, this.batteryCapacity, this.stateOfCharge, this.pricingModel, this.chargerPower, false);
        calcOperatingRange(this.batteryCapacity, this.bevEnergyConsumption, this.stateOfCharge);
        getStateOfCharge (this.stateOfCharge);
        getDesiredRange(this.desiredRange);
        
        // Calculate alternative values for comparison if comparison is active
        if(this.alt) {
            this.energyNeededForRange = calcEnergyNeededForRange(this.desiredRange, this.bevEnergyConsumption, this.stateOfCharge, this.batteryCapacity, this.chargerPowerAlt, this.alt);
            calcEnergytoFullCharge(this.batteryCapacity, this.stateOfCharge, this.chargerPowerAlt, this.alt);
            calcChargeCostRange(this.energyPriceAlt, this.energyNeededForRange, this.pricingModelAlt, this.chargerPowerAlt, this.alt);
            calcChargeCostFullCharge(this.energyPriceAlt, this.batteryCapacity, this.stateOfCharge, this.pricingModelAlt, this.chargerPowerAlt, this.alt);
            //Update comparison bars
            updateComparisonBars("comparisonBarRangeTime1", "comparisonBarRangeTime2", "chargeTimeForRangeOption1", "chargeTimeForRangeOption2");
            updateComparisonBars("comparisonBarRangeCost1", "comparisonBarRangeCost2", "chargeCostForRangeOption1", "chargeCostForRangeOption2");
            updateComparisonBars("comparisonBarFullChargeTime1", "comparisonBarFullChargeTime2", "chargeTimeForFullChargeOption1", "chargeTimeForFullChargeOption2");
            updateComparisonBars("comparisonBarFullChargeCost1", "comparisonBarFullChargeCost2", "chargeCostForFullChargeOption1", "chargeCostForFullChargeOption2");
        }
    }
}


export function calcMaxOperatingRange(desiredRange, batteryCapacity, bevEnergyConsumption, stateOfCharge) {
    if (bevEnergyConsumption === 0) {
        console.log("Error: BEV energy consumption is 0. Cannot calculate maxOperatingRange & ChargesRequired.");
        updateValueForResult("0", "chargesRequired");
        return;
    }
    const maxOperatingRange = (batteryCapacity / bevEnergyConsumption) * 100; // in km
    
    if (desiredRange > maxOperatingRange) {
        console.warn("Warning: The desired range exceeds the vehicle's maximum possible range on a full charge.");
        console.log("Desired range: ", desiredRange, "Max operating range: ", maxOperatingRange);
        updateChargesRequired(desiredRange, stateOfCharge, batteryCapacity, bevEnergyConsumption);
    } 
    //updateValueForResult(maxOperatingRange.toFixed(2) + " km", "maxOperatingRange");
    updateChargesRequired(desiredRange, stateOfCharge, batteryCapacity, bevEnergyConsumption);
}

export function calcOperatingRange(batteryCapacity, bevEnergyConsumption, stateOfCharge) { 
    if (bevEnergyConsumption === 0) {
        console.log("Error: BEV energy consumption is 0. Cannot calculate operating range.");
        updateValueForResult("0" + " km", "currentOperatingRange");
        return;
    }
    const operatingRange = (batteryCapacity / bevEnergyConsumption) * (stateOfCharge); // in km
    updateValueForResult(operatingRange.toFixed(2) + " km", "currentOperatingRange");
}

export function getStateOfCharge(stateOfCharge) {
    updateValueForResult(stateOfCharge.toFixed(0) + " %", "stateOfCharge");
} 

export function getDesiredRange(desiredRange) {
    updateValueForResult(desiredRange + " km", "desiredRange");
}

export function calcEnergyNeededForRange(range, bevEnergyConsumption, stateOfCharge, batteryCapacity, bevChargePower, alt) {
    const energyNeededForRange = (bevEnergyConsumption / 100) * range;
    const currentEnergy = (stateOfCharge / 100) * batteryCapacity;
    const energyToCharge = energyNeededForRange - currentEnergy;

    if (energyToCharge <= 0) {
        updateValueForResult("0 kWh", "energyNeededForRange");
        calcChargeTimeForRange(0, bevChargePower, alt);
        return 0;
    }

    
    updateValueForResult(energyToCharge.toFixed(2) + " kWh", "energyNeededForRange");
    calcChargeTimeForRange(energyToCharge, bevChargePower, alt);
    return energyToCharge;
    
}

export function calcEnergytoFullCharge(batteryCapacity, stateOfCharge, chargePower, alt) {
    console.log("Calculating energy to full charge with:", { batteryCapacity, stateOfCharge, chargePower, alt });
    const energyToFullCharge = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    calcChargeTimeForFullCharge(energyToFullCharge, chargePower, alt);
    console.log(energyToFullCharge);
    updateValueForResult(energyToFullCharge.toFixed(2) + " kWh", "energyToFullCharge");
}

export function calcChargeTimeForRange(energyToCharge, bevChargePower, alt) {
    if (!alt && bevChargePower !== 0) {
        if (energyToCharge <= 0) {
            updateValueForResult("0 min", "chargeTimeForRange");
            updateValueForResult("0 min", "chargeTimeForRangeOption1");
            updateValueForResult("0 min", "chargeTimeForRangeOption2");
            return;
        }

        var chargeTimeForRange1 = energyToCharge / bevChargePower; // in hours
        const hours = Math.floor(chargeTimeForRange1);
        const minutes = Math.round((chargeTimeForRange1 - hours) * 60);
        if (hours > 0) {
                updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRange");
                updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRangeOption1");     
        } else {
                updateValueForResult(`${minutes} min`, "chargeTimeForRange");
                updateValueForResult(`${minutes} min`, "chargeTimeForRangeOption1");    
        }
    } else if (alt && bevChargePower !== 0) {
        var chargeTimeForRange2 = energyToCharge / bevChargePower; // in hours
        const hours = Math.floor(chargeTimeForRange2);
        const minutes = Math.round((chargeTimeForRange2 - hours) * 60);
        if (hours > 0) {
            updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRangeOption2");
        } else {
            updateValueForResult(`${minutes} min`, "chargeTimeForRangeOption2");
        }
    } else { // TODO: Cause of bug? Sets values to zero even when first option has values
        console.log("Error: Cannot calculate charge time for range. Charge power is missing.");
        updateValueForResult("0", "chargeTimeForRange");
        updateValueForResult("0", "chargeTimeForRangeOption1");
        updateValueForResult("0", "chargeTimeForRangeOption2");
    }
    

    

   
    
    return chargeTimeForRange1, chargeTimeForRange2;
}

export function calcChargeTimeForFullCharge(energyNeeded, bevChargePower, alt) {
    if (bevChargePower === 0) {
        console.log("Error: BEV charge power is 0. Cannot calculate charge time for full charge.");
        updateValueForResult("0", "chargeTimeForFullCharge");
        updateValueForResult("0", "chargeTimeForFullChargeOption1");
        updateValueForResult("0", "chargeTimeForFullChargeOption2");
        return;
    }

    const chargeTimeForFullCharge = energyNeeded / bevChargePower; // in hours
    const hours = Math.floor(chargeTimeForFullCharge);
    const minutes = Math.round((chargeTimeForFullCharge - hours) * 60);
    if (hours > 0) {
        if (!alt) {
            updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullCharge");
            updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullChargeOption1");
        } else{
            updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullChargeOption2");
        }
        
    } else {
        if (!alt) {
            updateValueForResult(`${minutes} min`, "chargeTimeForFullCharge");
            updateValueForResult(`${minutes} min`, "chargeTimeForFullChargeOption1");
        } else {
            updateValueForResult(`${minutes} min`, "chargeTimeForFullChargeOption2");
        }
        
    }
    return chargeTimeForFullCharge;
}

// TODO: ? Make a variable out of alt instead of passing it around (or move functions inside Calculator class and use this.alt as the variable)
// Could clean up a lot of code since this function could simply calculate the "option 1" always
// and then check if alt is active and calculate the second option.
// ^^ Same thing with calcChargeCostFullCharge.
// Finally in updateCalculations there would be no need to call these functions twice, only a check before the updateComparisonBars.
export function calcChargeCostRange(price, energyNeeded, pricingModel, chargerPower, alt) {
    let chargeCost;
    if (!alt) {
        if (pricingModel === "energy" && chargerPower !== 0) {
            chargeCost = price * energyNeeded;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostRange");
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption1");
            
        } else if (pricingModel === "time" && chargerPower !== 0) {
            const chargeTime = energyNeeded / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostRange");
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption1");   
        } else {
            console.log("Error: Cannot calculate charge cost for range. Pricing model or charger power is missing.");
            updateValueForResult("0", "chargeCostRange");
        }
    } else {
        if (pricingModel === "energy" && chargerPower !== 0) {
            chargeCost = price * energyNeeded;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption2");
        } else if (pricingModel === "time" && chargerPower !== 0) {
            const chargeTime = energyNeeded / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForRangeOption2");
        } else {
            console.log("Error: Cannot calculate charge cost for range. Pricing model or charger power is missing.");
            updateValueForResult("0", "chargeCostForRangeOption2");
        }
    }
    
    
}

export function calcChargeCostFullCharge(price, batteryCapacity, stateOfCharge, pricingModel, chargerPower, alt) {
    const energyNeeded = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    let chargeCost;
    if (!alt) {
        if (pricingModel === "energy" && chargerPower !== 0) {
            chargeCost = price * energyNeeded;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostFullCharge");
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption1");
        } else if (pricingModel === "time" && chargerPower !== 0) {
            const chargeTime = energyNeeded / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostFullCharge");
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption1");
        }
        else {
            console.log("Error: Cannot calculate charge cost for FullCharge. Pricing model or charger power is missing.");
            updateValueForResult("0", "chargeCostFullCharge");
            updateValueForResult("0", "chargeCostForFullChargeOption1");
        }
    } else {
        if (pricingModel === "energy" && chargerPower !== 0) {
            chargeCost = price * energyNeeded;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption2");
        } else if (pricingModel === "time" && chargerPower !== 0) {
            const chargeTime = energyNeeded / chargerPower; // Calculate charge time
            chargeCost = price * chargeTime;
            updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostForFullChargeOption2");
        } else {
            console.log("Error: Cannot calculate charge cost for FullCharge. Pricing model or charger power is missing.");
            updateValueForResult("0", "chargeCostForFullChargeOption2");
        }
        return chargeCost;
    }
}

export function updateValueForResult(newValue, resultid) {
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


export function updateChargesRequired(desiredRange, stateOfCharge, batteryCapacity, bevEnergyConsumption) {
    const currentEnergy = (stateOfCharge / 100) * batteryCapacity;
    const energyNeededForRange = (bevEnergyConsumption / 100) * desiredRange;
    const energyToCharge = energyNeededForRange - currentEnergy;

    if (energyToCharge <= 0) {
        updateValueForResult(0, "chargesRequired");
        return 0;
    }
    if (batteryCapacity === 0) {
        console.log("Error: Battery capacity is 0. Cannot calculate charges required.");
        updateValueForResult("0", "chargesRequired");
        return
    } else {
        const chargesRequired = Math.ceil(energyToCharge / batteryCapacity);
        updateValueForResult(chargesRequired, "chargesRequired");
        return chargesRequired;
    }
    
}

export function updateComparisonBars(bar1ID, bar2ID, value1ID, value2ID) {
    const bar1 = document.getElementById(bar1ID);
    const bar2 = document.getElementById(bar2ID);
    
    // Retrieve and parse the values from the specified elements
    const value1 = parseValue(document.getElementById(value1ID).textContent);
    const value2 = parseValue(document.getElementById(value2ID).textContent);


    if (value1 > value2 && value1 !== 0) {
        const bar2Width = (value2 / value1) * 100;
        bar1.style.background = `#ff00ff`;
        bar2.style.background = `linear-gradient(to right, rgb(255, 0, 255) 0%,rgb(255, 0, 255) ${bar2Width}%, rgb(0, 83, 151) ${bar2Width}%, rgb(0, 83, 151) 100%)`;
    } else if (value1 < value2 && value2 !== 0) {
        const bar1Width = (value1 / value2) * 100;
        bar1.style.background = `linear-gradient(to right, rgb(255, 0, 255) 0%,rgb(255, 0, 255) ${bar1Width}%, rgb(0, 83, 151) ${bar1Width}%, rgb(0, 83, 151) 100%)`;
        bar2.style.background = `#ff00ff`;
    } else {
        // If the values are equal or both are 0, fill both bars to the same color
        bar1.style.background = `rgb(255, 0, 255)`;
        bar2.style.background = `rgb(255, 0, 255)`;
    }
}

/**
 * Parses a value string and converts it to a numeric value.
 * Handles values in the format "1h 34min", "41 min", "6.90 €", "0.40 €", etc.
 * @param {string} valueStr - The value string to parse.
 * @returns {number} - The parsed numeric value.
 */
function parseValue(valueStr) {
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

export default Calculator;