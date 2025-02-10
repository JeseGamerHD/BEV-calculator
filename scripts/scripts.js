/*Nykyisellä results-pagen rakenteella päivitetään kentät esim. updateValueForResult("Max operating range: " + maxOperatingRange.toFixed(2), "maxOperatingRange");
Jos results-pagella siirretään tuloksen numero-osuus omaan HTML-elementtiinsä, esim. div tai p jolla on id="maxOperatingRange"
voidaan kutsua ilman kovakoodattua merkkijonoa-> updateValueForResult(maxOperatingRange.toFixed(2), "maxOperatingRange");*/


class Calculator {
    constructor(values) {
        this.desiredRange = values.range;
        this.batteryCapacity = values.batteryCapacity;
        this.bevEnergyConsumption = values.bevEnergyConsumption;
        this.stateOfCharge = values.stateOfCharge;
        this.chargerPower = values.chargerPower;
        this.chargeCostEnergy = values.chargeCostEnergy;
        this.chargeCostTime = values.chargeCostTime;
        this.energyNeededForRange = 0;
    }
    
    setData(variable, value) {
        this[variable] = value;
        this.updateCalculations();
    }

    updateCalculations() {
        console.log("Updating calculations with values:", this);
        calcMaxOperatingRange(this.desiredRange, this.batteryCapacity, this.bevEnergyConsumption);
        this.energyNeededForRange = calcEnergyNeededForRange(this.desiredRange, this.bevEnergyConsumption, this.chargerPower);
        calcEnergytoFullCharge(this.batteryCapacity, this.stateOfCharge, this.chargerPower);
        calcChargeCostEnergy(this.chargeCostEnergy, this.energyNeededForRange);
        calcChargeCostTime(this.chargeCostTime, this.energyNeededForRange);
    }
}


export function calcMaxOperatingRange(desiredRange, batteryCapacity, bevEnergyConsumption) { //desiredRange tässä kohtaa vielä redundantti, sitä ei näytetä missään
    const maxOperatingRange = (batteryCapacity / bevEnergyConsumption) * 100; // in km
    
    if (desiredRange > maxOperatingRange) {
        console.warn("Warning: The desired range exceeds the vehicle's maximum possible range on a full charge.");
        updateChargesRequired(desiredRange, maxOperatingRange);
    } 
    updateValueForResult("Max operating range: " + maxOperatingRange.toFixed(2), "maxOperatingRange");

}

export function calcEnergyNeededForRange(range, bevEnergyConsumption, chargerPower) {
    const energyNeededForRange = (bevEnergyConsumption / 100) * range;
    calcChargeTimeForRange(energyNeededForRange, chargerPower);
    updateValueForResult("Energy needed for range: " + energyNeededForRange.toFixed(2), "energyNeededForRange");
    return energyNeededForRange; // Return the calculated value
}

export function calcEnergytoFullCharge(batteryCapacity, stateOfCharge, chargePower) {
    console.log("Calculating energy to full charge with:", { batteryCapacity, stateOfCharge, chargePower });
    const energyToFullCharge = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    calcChargeTimeForFullCharge(energyToFullCharge, chargePower);
    console.log(energyToFullCharge);
    updateValueForResult("Energy needed for full charge: " + energyToFullCharge.toFixed(2), "energyToFullCharge");
}

export function calcChargeTimeForRange(energyNeeded, bevChargePower) {
    const chargeTimeForRange = energyNeeded / bevChargePower; // in hours

    updateValueForResult("Charge time needed for range: " + chargeTimeForRange.toFixed(2), "chargeTimeForRange");
}
export function calcChargeTimeForFullCharge(energyNeeded, bevChargePower) {
    const chargeTimeForFullCharge = energyNeeded / bevChargePower; // in hours

    updateValueForResult("Charge time for full charge: "+ chargeTimeForFullCharge.toFixed(2), "chargeTimeForFullCharge");
}

export function calcChargeCostEnergy(price, energyNeeded) {
    const chargeCostEnergy = price * energyNeeded;

    updateValueForResult("Charge cost in €/kWh: " + chargeCostEnergy.toFixed(2), "chargeCostEnergy");
}

export function calcChargeCostTime(price, energyNeeded) {
    const chargeCostTime = price * energyNeeded;

    updateValueForResult("Charge cost in €/h: " + chargeCostTime.toFixed(2), "chargeCostTime");
}


export function updateValueForResult(newValue, resultid) {
    
    document.getElementById(resultid).innerHTML = newValue
}

function updateChargesRequired(desiredRange, maxOperatingRange) {
    const chargesRequired = Math.ceil(desiredRange / maxOperatingRange);
    updateValueForResult("Charges required: " + chargesRequired, "chargesRequired");
}

//OPTIONAL: Jos halutaan myös budjettitoiminnallisuus, voidaan kutsua tätä funktiota.
export function calcRangeFromBudget(budget, bevEnergyConsumption, bevChargePower, chargeCostEnergy) {
    const rangeFromBudget = (budget / chargeCostEnergy) * (bevChargePower / bevEnergyConsumption); // in km

    updateValueForResult("Range from budget: " + rangeFromBudget.toFixed(2), "rangeFromBudget");
}


export default Calculator;