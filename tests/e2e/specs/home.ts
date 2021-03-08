/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

describe('Home Page UI', () => {
  it('Render all components', () => {
    cy.visit('/home');
  });
});
