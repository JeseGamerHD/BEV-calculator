import { calcEnergyNeededForRange, calcChargeTimeForRange } from '../../scripts/scripts.js';

describe('test suite: calculating energy to be charged', () => {
  it('calculates energy required with valid information', () => {
    expect(calcEnergyNeededForRange(200, 15, 20, 60, undefined)).toEqual(18);
  });
  
  it('returns 0 when charging is not needed', () => {
    expect(calcEnergyNeededForRange(100, 12, 100, 60, undefined)).toEqual(0);
  })

  it('calculates energy with values containing decimals', () => {
    expect(calcEnergyNeededForRange(200, 13.7, 20, 57.5, undefined)).toEqual(15.9);
  })
}
);
