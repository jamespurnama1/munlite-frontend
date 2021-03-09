/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    login(): Cypress.Chainable<void>;
    getConfID(): Cypress.Chainable<string>;
    isInViewport(element: HTMLElement): Cypress.Chainable<void>;
  }
}
