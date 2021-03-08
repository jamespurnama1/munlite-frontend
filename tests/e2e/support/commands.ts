// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('isNotInViewport', (element) => {
  cy.get(element).then(($el) => {
    // @ts-ignore
    const bottom = Cypress.$(cy.state('window')).height() as number;
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
  });
});

Cypress.Commands.add('isInViewport', (element) => {
  cy.get(element).then(($el) => {
    // @ts-ignore
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom as number);
    expect(rect.bottom).not.to.be.greaterThan(bottom as number);
    expect(rect.top).not.to.be.greaterThan(bottom as number);
    expect(rect.bottom).not.to.be.greaterThan(bottom as number);
  });
});
