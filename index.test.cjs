// Minimal CommonJS test stub
const myModule = require('./index.cjs');
const { test, expect } = require('@jest/globals');

test('myModule returns expected string', () => {
  expect(myModule()).toBe('Hello from template CJS');
});
