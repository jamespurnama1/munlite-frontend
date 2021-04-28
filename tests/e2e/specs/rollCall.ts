/// <reference path="../support/index.d.ts" />

describe('Roll Call Modal Test', () => {
  let id: string = '';
  before(() => {
    cy.login();
    cy.getConfID()
      .then((response: string) => id = response)
    console.log(id);
  });

  // beforeEach(() => {
  //   console.log(window.store);
  // });

  it('Render Modal', () => {
    cy.visit(`/delegates/${id}`);
    cy.get('button')
      .contains('Roll Call')
      .click();
    cy.contains('h2', 'Roll Call').should('be.visible');
  });

  it('Roll call then proceed to vote', () => {
    cy.get('button#continue').contains('Continue');
    // let dataLength = window.store.state.delegates.delegates;
    for (let i = 0; i < 53; i += 1) {
      cy.wait(500);
      cy.get('button').contains('Present').click();
    }
    cy.wait(850);
    cy.get('button').contains('Continue').click();
    cy.get('#select .selection:first-child .input').type((52).toString());
    cy.get('.input.red').type('1');
    cy.get('button').contains('Pass').click();
    cy.wait(1000);
    cy.url().should('contain', `/gsl/${id}`);
    });
  });
