/**
* Class for storing the results from Calculator
*/
export class Results {
   
    /** How many times the car needs to be charged to reach desired range */
    chargeCount = null;
    
    /** The current operational range (km) with current SOC */
    currentRange = null;
    
    /** How much charging to 100% would cost */
    fullChargeCost = null;
   
    /** How much charging to 100% would cost (for option 2)*/
    fullChargeCostAlt = null;
    
    /** How long it takes to charge to 100%. Contains two values: hours and minutes */
    fullChargeTime =  {
        hours : null,
        minutes : null
    };

    /** How long it takes to charge to 100% (for option 2) */
    fullChargeTimeAlt =  {
        hours : null,
        minutes : null
    };
    
    /** How much energy (kWh) is needed to reach 100% */
    fullChargeEnergy = null;
    
    /** How much charging until desired range can be reached costs */
    rangeCost = null;
    
    /** How much charging until desired range can be reached costs (for option 2) */
    rangeCostAlt = null;
    
    /** How long the car needs to charge to reach desired range. Contains two values: hours and minutes. */
    rangeTime = {
        hours : null,
        minutes : null
    };

    /** How long the car needs to charge to reach desired range (for option 2). */
    rangeTimeAlt = {
        hours : null,
        minutes : null
    };
    
    /** How much energy (kWh) needs to be charged to reach destination */
    rangeEnergy = null;
}