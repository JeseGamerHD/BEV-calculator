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
    }
}


export function calcMaxOperatingRange(desiredRange, batteryCapacity, bevEnergyConsumption, stateOfCharge) {
    const maxOperatingRange = (batteryCapacity / bevEnergyConsumption) * 100; // in km
    
    if (desiredRange > maxOperatingRange) {
        console.warn("Warning: The desired range exceeds the vehicle's maximum possible range on a full charge.");
        console.log("Desired range: ", desiredRange, "Max operating range: ", maxOperatingRange);
        updateChargesRequired(desiredRange, stateOfCharge, batteryCapacity, bevEnergyConsumption);
    } 
    updateValueForResult("Max operating range: " + maxOperatingRange.toFixed(2), "maxOperatingRange");
    updateChargesRequired(desiredRange, stateOfCharge, batteryCapacity, bevEnergyConsumption);
}

export function calcOperatingRange(batteryCapacity, bevEnergyConsumption, stateOfCharge) { 
    const operatingRange = (batteryCapacity / bevEnergyConsumption) * (stateOfCharge); // in km
    updateValueForResult("Operating range: " + operatingRange.toFixed(2), "currentOperatingRange");
}

export function getStateOfCharge(stateOfCharge) {
    updateValueForResult("State of charge: " + stateOfCharge.toFixed(2), "stateOfCharge");
} 

export function calcEnergyNeededForRange(range, bevEnergyConsumption, stateOfCharge, batteryCapacity, bevChargePower) {
    const energyNeededForRange = (bevEnergyConsumption / 100) * range;
    updateValueForResult("Energy needed for range: " + energyNeededForRange.toFixed(2), "energyNeededForRange");

    calcChargeTimeForRange(range, bevEnergyConsumption, stateOfCharge, batteryCapacity, bevChargePower);
    return energyNeededForRange;
}

export function calcEnergytoFullCharge(batteryCapacity, stateOfCharge, chargePower) {
    console.log("Calculating energy to full charge with:", { batteryCapacity, stateOfCharge, chargePower });
    const energyToFullCharge = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    calcChargeTimeForFullCharge(energyToFullCharge, chargePower);
    console.log(energyToFullCharge);
    updateValueForResult("Energy needed for full charge: " + energyToFullCharge.toFixed(2), "energyToFullCharge");
}

export function calcChargeTimeForRange(range, bevEnergyConsumption, stateOfCharge, batteryCapacity, bevChargePower) {
    const energyNeededForRange = (bevEnergyConsumption / 100) * range;
    const currentEnergy = (stateOfCharge / 100) * batteryCapacity;
    const energyToCharge = energyNeededForRange - currentEnergy;

    if (energyToCharge <= 0) {
        updateValueForResult("Charge time needed for range: 0", "chargeTimeForRange");
        return 0;
    }

    const chargeTimeForRange = energyToCharge / bevChargePower; // in hours
    updateValueForResult("Charge time needed for range: " + chargeTimeForRange.toFixed(2), "chargeTimeForRange");
    return chargeTimeForRange;
}

export function calcChargeTimeForFullCharge(energyNeeded, bevChargePower) {
    const chargeTimeForFullCharge = energyNeeded / bevChargePower; // in hours

    updateValueForResult("Charge time for full charge: "+ chargeTimeForFullCharge.toFixed(2), "chargeTimeForFullCharge");
}


export function calcChargeCostRange(price, energyNeeded, pricingModel, chargerPower = null) {
    let chargeCost;
    if (pricingModel === "energy") {
        chargeCost = price * energyNeeded;
        updateValueForResult("Charge cost in €/kWh for desired range: " + chargeCost.toFixed(2), "chargeCostRange");
        
    } else if (pricingModel === "time" && chargerPower !== null) {
        const chargeTime = energyNeeded / chargerPower; // Calculate charge time
        chargeCost = price * chargeTime;
        updateValueForResult("Charge cost in €/h for desired range: " + chargeCost.toFixed(2), "chargeCostRange");   
    }
}

export function calcChargeCostFullCharge(price, batteryCapacity, stateOfCharge, pricingModel, chargerPower = null) {
    const energyNeeded = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    let chargeCost;

    if (pricingModel === "energy") {
        chargeCost = price * energyNeeded;
        updateValueForResult("Charge cost in €/kWh for full charge: " + chargeCost.toFixed(2), "chargeCostFullCharge");
    } else if (pricingModel === "time" && chargerPower !== null) {
        const chargeTime = energyNeeded / chargerPower; // Calculate charge time
        chargeCost = price * chargeTime;
        updateValueForResult("Charge cost in €/h for full charge: " + chargeCost.toFixed(2), "chargeCostFullCharge");
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


function updateChargesRequired(desiredRange, stateOfCharge, batteryCapacity, bevEnergyConsumption) {
    const currentEnergy = (stateOfCharge / 100) * batteryCapacity;
    const energyNeededForRange = (bevEnergyConsumption / 100) * desiredRange;
    const energyToCharge = energyNeededForRange - currentEnergy;

    if (energyToCharge <= 0) {
        updateValueForResult(0, "chargesRequired");
        return 0;
    }

    const chargesRequired = Math.ceil(energyToCharge / batteryCapacity);
    updateValueForResult(chargesRequired, "chargesRequired");
    return chargesRequired;
}

//OPTIONAL: Jos halutaan myös budjettitoiminnallisuus, voidaan kutsua tätä funktiota.
export function calcRangeFromBudget(budget, bevEnergyConsumption, bevChargePower, chargeCostEnergy) {
    const rangeFromBudget = (budget / chargeCostEnergy) * (bevChargePower / bevEnergyConsumption); // in km

    updateValueForResult("Range from budget: " + rangeFromBudget.toFixed(2), "rangeFromBudget");
}


export default Calculator;