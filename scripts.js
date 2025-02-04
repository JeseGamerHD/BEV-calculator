/*Nykyisellä results-pagen rakenteella päivitetään kentät esim. updateValueForResult("Max operating range: " + maxOperatingRange.toFixed(2), "maxOperatingRange");
Jos results-pagella siirretään tuloksen numero-osuus omaan HTML-elementtiinsä, esim. div tai p jolla on id="maxOperatingRange"
voidaan kutsua ilman kovakoodattua merkkijonoa-> updateValueForResult(maxOperatingRange.toFixed(2), "maxOperatingRange");*/

//TODO: Mietitään miten otetaan parametrit funktioille input-puolelta ja missä kohdissa niitä kutsutaan.
function calcMaxOperatingRange(desiredRange, batteryCapacity, bevEnergyConsumption) {
    const maxOperatingRange = (batteryCapacity / bevEnergyConsumption) * 100; // in km
    
    if (desiredRange > maxOperatingRange) {
        console.warn("Warning: The desired range exceeds the vehicle's maximum possible range on a full charge.");
        console.log(`Adjusting desired range to the maximum possible range: ${maxOperatingRange.toFixed(2)} km`);
        desiredRange = maxOperatingRange;
    } 
    updateValueForResult("Max operating range: " + maxOperatingRange.toFixed(2), "maxOperatingRange");

}

function calcEnergyNeededForRange(range, bevEnergyConsumption) {
    const energyNeededForRange = (bevEnergyConsumption / 100) * range;

    updateValueForResult("Energy needed for range: " + energyNeededForRange.toFixed(2), "energyNeededForRange");  
}

function calcEnergytoFullCharge(batteryCapacity, stateOfCharge) {
    const energyToFullCharge = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);

    updateValueForResult("Energy needed for full charge: " + energyToFullCharge.toFixed(2), "energyToFullCharge");
}

function calcChargeTimeForRange(energyNeeded, bevChargePower) {
    const chargeTimeForRange = energyNeeded / bevChargePower; // in hours

    updateValueForResult("Charge time needed for range: " + chargeTimeForRange.toFixed(2), "chargeTimeForRange");
}

function calcChargeTimeForFullCharge(energyNeeded, bevChargePower) {
    const chargeTimeForFullCharge = energyNeeded / bevChargePower; // in hours

    updateValueForResult("Charge time for full charge: "+ chargeTimeForFullCharge.toFixed(2), "chargeTimeForFullCharge");
}

function calcChargeCostEnergy(price, energyNeeded) {
    const chargeCostEnergy = price * energyNeeded;

    updateValueForResult("Charge cost in €/kWh: " + chargeCostEnergy.toFixed(2), "chargeCostEnergy");
}

function calcChargeCostTime(price, energyNeeded) {
    const chargeCostTime = price * energyNeeded;

    updateValueForResult("Charge cost in €/h: " + chargeCostTime.toFixed(2), "chargeCostTime");
}


function updateValueForResult(newValue, resultid) {
    
    document.getElementById(resultid).innerHTML = newValue
}
