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
        this.energyPrice = values.energyPrice;
        this.energyNeededForRange = 0;
        this.pricingModel = values.pricingModel;
    }
    
    setData(variable, value) {
        this[variable] = value;
        this.updateCalculations();
    }

    updateCalculations() {
        console.log("Updating calculations with values:", this);
        calcMaxOperatingRange(this.desiredRange, this.batteryCapacity, this.bevEnergyConsumption, this.stateOfCharge);
        this.energyNeededForRange = calcEnergyNeededForRange(this.desiredRange, this.bevEnergyConsumption, this.stateOfCharge, this.batteryCapacity, this.chargerPower);
        calcEnergytoFullCharge(this.batteryCapacity, this.stateOfCharge, this.chargerPower);
        calcChargeCostRange(this.energyPrice, this.energyNeededForRange, this.pricingModel, this.chargerPower);
        calcChargeCostFullCharge(this.energyPrice, this.batteryCapacity, this.stateOfCharge, this.pricingModel, this.chargerPower);
        calcOperatingRange(this.batteryCapacity, this.bevEnergyConsumption, this.stateOfCharge);
        getStateOfCharge (this.stateOfCharge);
        getDesiredRange(this.desiredRange);
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

export function calcEnergyNeededForRange(range, bevEnergyConsumption, stateOfCharge, batteryCapacity, bevChargePower) {
    const energyNeededForRange = (bevEnergyConsumption / 100) * range;
    const currentEnergy = (stateOfCharge / 100) * batteryCapacity;
    const energyToCharge = energyNeededForRange - currentEnergy;

    if (energyToCharge <= 0) {
        updateValueForResult("0 kWh", "energyNeededForRange");
        calcChargeTimeForRange(0, bevChargePower);
        return 0;
    }

    updateValueForResult(energyToCharge.toFixed(2) + " kWh", "energyNeededForRange");
    calcChargeTimeForRange(energyToCharge, bevChargePower);
    return energyToCharge;
}

export function calcEnergytoFullCharge(batteryCapacity, stateOfCharge, chargePower) {
    console.log("Calculating energy to full charge with:", { batteryCapacity, stateOfCharge, chargePower });
    const energyToFullCharge = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    calcChargeTimeForFullCharge(energyToFullCharge, chargePower);
    console.log(energyToFullCharge);
    updateValueForResult(energyToFullCharge.toFixed(2) + " kWh", "energyToFullCharge");
}

export function calcChargeTimeForRange(energyToCharge, bevChargePower) {
    if (energyToCharge <= 0) {
        updateValueForResult("0 min", "chargeTimeForRange");
        return 0;
    }

    const chargeTimeForRange = energyToCharge / bevChargePower; // in hours
    const hours = Math.floor(chargeTimeForRange);
    const minutes = Math.round((chargeTimeForRange - hours) * 60);
    if (hours > 0) {
        updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForRange");
    } else {
        updateValueForResult(`${minutes} min`, "chargeTimeForRange");
    }
    
    return chargeTimeForRange;
}

export function calcChargeTimeForFullCharge(energyNeeded, bevChargePower) {
    if (bevChargePower === 0) {
        console.log("Error: BEV charge power is 0. Cannot calculate charge time for full charge.");
        updateValueForResult("Charge power has to be above 0", "chargeTimeForFullCharge");
        return;
    }

    const chargeTimeForFullCharge = energyNeeded / bevChargePower; // in hours
    const hours = Math.floor(chargeTimeForFullCharge);
    const minutes = Math.round((chargeTimeForFullCharge - hours) * 60);
    if (hours > 0) {
        updateValueForResult(`${hours} h ${minutes} min`, "chargeTimeForFullCharge");
    } else {
        updateValueForResult(`${minutes} min`, "chargeTimeForFullCharge");
    }
    return chargeTimeForFullCharge;
}


export function calcChargeCostRange(price, energyNeeded, pricingModel, chargerPower) {
    let chargeCost;
    if (pricingModel === "energy" && chargerPower !== 0) {
        chargeCost = price * energyNeeded;
        updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostRange");
        
    } else if (pricingModel === "time" && chargerPower !== 0) {
        const chargeTime = energyNeeded / chargerPower; // Calculate charge time
        chargeCost = price * chargeTime;
        updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostRange");   
    } else {
        console.log("Error: Cannot calculate charge cost for range. Pricing model or charger power is missing.");
        updateValueForResult("Charger power must be above 0", "chargeCostRange");
    }
}

export function calcChargeCostFullCharge(price, batteryCapacity, stateOfCharge, pricingModel, chargerPower) {
    const energyNeeded = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    let chargeCost;

    if (pricingModel === "energy" && chargerPower !== 0) {
        chargeCost = price * energyNeeded;
        updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostFullCharge");
    } else if (pricingModel === "time" && chargerPower !== 0) {
        const chargeTime = energyNeeded / chargerPower; // Calculate charge time
        chargeCost = price * chargeTime;
        updateValueForResult(chargeCost.toFixed(2) + " €", "chargeCostFullCharge");
    }
    else {
        console.log("Error: Cannot calculate charge cost for FullCharge. Pricing model or charger power is missing.");
        updateValueForResult("Charger power must be above 0", "chargeCostFullCharge");
    }
    return chargeCost;
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