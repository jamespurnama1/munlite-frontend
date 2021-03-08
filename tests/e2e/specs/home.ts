/// <reference path="../support/index.d.ts" />

describe('Home Page UI', () => {
  before(() => {
    cy.login();
  });

  it('Render all components', () => {
    cy.visit('/');
  });
});
