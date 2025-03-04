import { calcEnergyNeededForRange } from '../../scripts/scripts.js';

describe('test suite: calculating energy needed for range', () => {
  it('calculates energy required with valid information', () => {
    expect(calcEnergyNeededForRange(200, 15, 20, 60, undefined)).toEqual(18);
  });
  
  it('displays 0 when charging is not needed', () => {
    expect(calcEnergyNeededForRange(100, 12, 100, 60, undefined)).toEqual(0);
  })
}
);