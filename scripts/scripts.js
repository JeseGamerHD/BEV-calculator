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

    updateCalculations() {
        console.log("Updating calculations with values:", this);
        // Calculate all values
        calcMaxOperatingRange(this.desiredRange, this.batteryCapacity, this.bevEnergyConsumption, this.stateOfCharge);
        this.energyNeededForRange = calcEnergyNeededForRange(this.desiredRange, this.bevEnergyConsumption, this.stateOfCharge, this.batteryCapacity, this.chargerPower, this.alt = false);
        calcEnergytoFullCharge(this.batteryCapacity, this.stateOfCharge, this.chargerPower, this.alt = false);
        calcChargeCostRange(this.energyPrice, this.energyNeededForRange, this.pricingModel, this.chargerPower, this.alt = false);
        calcChargeCostFullCharge(this.energyPrice, this.batteryCapacity, this.stateOfCharge, this.pricingModel, this.chargerPower, this.alt = false);
        calcOperatingRange(this.batteryCapacity, this.bevEnergyConsumption, this.stateOfCharge);
        getStateOfCharge (this.stateOfCharge);
        getDesiredRange(this.desiredRange);
        //Calculate alternative values for comparison
        this.energyNeededForRange = calcEnergyNeededForRange(this.desiredRange, this.bevEnergyConsumption, this.stateOfCharge, this.batteryCapacity, this.chargerPowerAlt, this.alt = true);
        calcEnergytoFullCharge(this.batteryCapacity, this.stateOfCharge, this.chargerPowerAlt, this.alt = true);
        calcChargeCostRange(this.energyPriceAlt, this.energyNeededForRange, this.pricingModelAlt, this.chargerPowerAlt, this.alt = true);
        calcChargeCostFullCharge(this.energyPriceAlt, this.batteryCapacity, this.stateOfCharge, this.pricingModelAlt, this.chargerPowerAlt, this.alt = true);
    }
}


export function calcMaxOperatingRange(desiredRange, batteryCapacity, bevEnergyConsumption, stateOfCharge) {
    if (bevEnergyConsumption === 0) {
        console.log("Error: BEV energy consumption is 0. Cannot calculate maxOperatingRange & ChargesRequired.");
        updateValueForResult("Consumption has to be above 0", "chargesRequired");
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
        updateValueForResult("Consumption has to be above 0" + " km", "currentOperatingRange");
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

        const chargeTimeForRange = energyToCharge / bevChargePower; // in hours
        const hours = Math.floor(chargeTimeForRange);
        const minutes = Math.round((chargeTimeForRange - hours) * 60);
        if (hours > 0) {
                updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRange");
                updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRangeOption1");     
        } else {
                updateValueForResult(`${minutes} min`, "chargeTimeForRange");
                updateValueForResult(`${minutes} min`, "chargeTimeForRangeOption1");    
        }
    } else if (alt && bevChargePower !== 0) {
        const chargeTimeForRange = energyToCharge / bevChargePower; // in hours
        const hours = Math.floor(chargeTimeForRange);
        const minutes = Math.round((chargeTimeForRange - hours) * 60);
        if (hours > 0) {
            updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRangeOption2");
        } else {
            updateValueForResult(`${minutes} min`, "chargeTimeForRangeOption2");
        }
    } else {
        console.log("Error: Cannot calculate charge time for range. Charge power is missing.");
        updateValueForResult("Charge power must be above 0", "chargeTimeForRange");
        updateValueForResult("Charge power must be above 0", "chargeTimeForRangeOption1");
        updateValueForResult("Charge power must be above 0", "chargeTimeForRangeOption2");
    }

    

   
    
    return chargeTimeForRange;
}

export function calcChargeTimeForFullCharge(energyNeeded, bevChargePower, alt) {
    if (bevChargePower === 0) {
        console.log("Error: BEV charge power is 0. Cannot calculate charge time for full charge.");
        updateValueForResult("Charge power has to be above 0", "chargeTimeForFullCharge");
        updateValueForResult("Charge power has to be above 0", "chargeTimeForFullChargeOption1");
        updateValueForResult("Charge power has to be above 0", "chargeTimeForFullChargeOption2");
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
            updateValueForResult("Charger power must be above 0", "chargeCostRange");
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
            updateValueForResult("Charger power must be above 0", "chargeCostForRangeOption2");
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
            updateValueForResult("Charger power must be above 0", "chargeCostFullCharge");
            updateValueForResult("Charger power must be above 0", "chargeCostForFullChargeOption1");
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
            updateValueForResult("Charger power must be above 0", "chargeCostForFullChargeOption2");
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
            document.getElementById(resultid).innerHTML = newValue
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
        updateValueForResult("Battery capacity has to be above 0", "chargesRequired");
        return
    } else {
        const chargesRequired = Math.ceil(energyToCharge / batteryCapacity);
        updateValueForResult(chargesRequired, "chargesRequired");
        return chargesRequired;
    }
    
}

//OPTIONAL: Jos halutaan myös budjettitoiminnallisuus, voidaan kutsua tätä funktiota.
export function calcRangeFromBudget(budget, bevEnergyConsumption, bevChargePower, chargeCostEnergy) {
    if (chargeCostEnergy !== 0 && bevEnergyConsumption !== 0) {
        const rangeFromBudget = (budget / chargeCostEnergy) * (bevChargePower / bevEnergyConsumption); // in km
        updateValueForResult("Range from budget: " + rangeFromBudget.toFixed(2), "rangeFromBudget");
    } else {
        console.log("Error: Cannot calculate range from budget. Charge cost or consumption is missing.");
        updateValueForResult("Charge cost and consumption must be above 0", "rangeFromBudget");
    }
      
}


export default Calculator;