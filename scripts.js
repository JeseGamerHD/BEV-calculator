// Function to calculate charging details
function calculateEVCharging(desiredRange=200, stateOfCharge=50, batteryCapacity=60, bevChargePower=11, bevEnergyConsumption=15, energyBasedPricing=0.5, timeBasedPricing=2) {
    
    const maxPossibleRange = (batteryCapacity / bevEnergyConsumption) * 100; // in km

    if (desiredRange > maxPossibleRange) {
        console.warn("Warning: The desired range exceeds the vehicle's maximum possible range on a full charge.");
        console.log(`Adjusting desired range to the maximum possible range: ${maxPossibleRange.toFixed(2)} km`);
        desiredRange = maxPossibleRange;
    }

    
    const energyNeededForRange = (bevEnergyConsumption / 100) * desiredRange;
    const energyToFullCharge = batteryCapacity - ((stateOfCharge / 100) * batteryCapacity);
    const chargeTimeForRange = energyNeededForRange / bevChargePower; // in hours
    const chargeTimeForFullCharge = energyToFullCharge / bevChargePower; // in hours

    //
    const chargeCostEnergy = energyBasedPricing * energyNeededForRange;
    const chargeCostTime = timeBasedPricing * energyNeededForRange; 
    

    // Update results div on page
    document.getElementById("results").innerHTML = `
        <strong>EV Laskuri tulokset:</strong><br>
        Kilowatit halutulle rangelle: ${energyNeededForRange.toFixed(2)} kWh<br>
        Kilowatit täyteen akkuun: ${energyToFullCharge.toFixed(2)} kWh<br>
        Latausaika: ${chargeTimeForRange.toFixed(2)} hours<br>
        Latauksen kustannus (energia): €${chargeCostEnergy.toFixed(2)}<br>
        Latauksen kustannus (aika): €${chargeCostTime.toFixed(2)}
    `;
    
    //Palautetaan objekti jota voidaan käyttää tietojen sijoittamiseen html puolella
    //Esim document.getElementById("testi").innerHTML = results.energyNeededForRange
    return {
        energyNeededForRange: energyNeededForRange.toFixed(2),
        energyToFullCharge: energyToFullCharge.toFixed(2),
        chargeTimeForRange: chargeTimeForRange.toFixed(2),
        chargeTimeForFullCharge: chargeTimeForFullCharge.toFixed(2),
        chargeCostEnergy: chargeCostEnergy.toFixed(2),
        chargeCostTime: chargeCostTime.toFixed(2),
        
    };
}


function updateValuesAndCalculate() {
    // Read values from inputs
    const desiredRange = parseFloat(document.getElementById("rangeInput").value);
    const stateOfCharge = parseFloat(document.getElementById("socInput").value);

    // Update output labels
    document.getElementById("rangeamount").value = desiredRange;
    document.getElementById("socamount").value = stateOfCharge;

    // Call the calculation function with updated values 
    results = calculateEVCharging(desiredRange, stateOfCharge);

    document.getElementById("testi").innerHTML = results.energyNeededForRange
}