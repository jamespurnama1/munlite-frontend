/// <reference path="../support/index.d.ts" />

describe('Landing Page Test', () => {
  before(() => {
    cy.login();
  });

  it('Render all components', () => {
    cy.visit('/delegates');

    cy.contains('h1', 'Delegates');
    cy.contains('button', 'Roll Call');
    cy.get('div[class="button"]').click();
    cy.get('input').should('exist');

    // check modal if button clicked

    cy.get('div[class="table-data"]>div[class="data"]').each(() => {
      cy.get('p[class="presence"]').should('exist');
      cy.get('p[class="name"]').should('exist');
      cy.get('img[class="img"]').should('exist');
    });

    cy.get('div[class="info"]>div[class="info-data"]').each(() => {
      cy.get('p[class="data"]').should('exist');
    });
  });
});
