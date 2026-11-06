const password = process.env.PASSWORD || 'secret_sauce';

export const users = {
  standard: { username: process.env.STANDARD_USER || 'standard_user', password },
  lockedOut: { username: process.env.LOCKED_USER || 'locked_out_user', password },
  problem: { username: process.env.PROBLEM_USER || 'problem_user', password },
  performance: { username: process.env.PERF_USER || 'performance_glitch_user', password },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
};

export const checkoutInfo = { firstName: 'Jane', lastName: 'Doe', postalCode: '10001' };

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
};
