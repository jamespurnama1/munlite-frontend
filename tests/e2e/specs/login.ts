/// <reference path="../support/index.d.ts" />

describe('Login Page', () => {
  it('Show Error text', () => {
    cy.visit('/login');
    cy.get('input[type="email"]')
      .clear()
      .type(Cypress.env('email'))
      .type('{enter}');
    cy.get('.errmsg').should('be.visible'); 
  });
  it('Logs in', () => {
    cy.visit('/login');
    cy.get('input[type="email"]')
      .clear()
      .type(Cypress.env('email'));
    cy.get('input[type="password"]')
      .clear()
      .type(Cypress.env('password'))
      .type('{enter}');
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
  });
});
