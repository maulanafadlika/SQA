// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register'

beforeEach(() => {
  const blocked = ['**optimizely.com/**', '**doubleclick.net/**', '**google-analytics.com/**',
    '**analytics.google.com/**', '**adtrafficquality.google/**', '**openx.net/**',
    '**id5-sync.com/**', '**crwdcntrl.net/**']
  blocked.forEach(url => cy.intercept(url, { statusCode: 204, log: false }))
})