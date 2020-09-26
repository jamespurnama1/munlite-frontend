import store from '../../../src/store/index';

describe('Read Vuex Store', () => {
  it('has delegates list', () => {
    expect(store.state.delegates[0].name).to.equal('Australia');
  });
});

describe('Roll Call Modal Test', () => {
  it('Render Modal', () => {
    cy.visit('/delegates');
    cy.get('button')
      .contains('Roll Call')
      .click();
    cy.contains('h2', 'Roll Call').should('be.visible');
  });
  it('Proceed to Vote', () => {
    store.state.delegates.forEach(() => {
      cy.get('button').contains('Present').click();
    });
    cy.contains('Yes').should('be.visible');
    cy.contains('No').should('be.visible');
    cy.get('button').should('be.disabled');
  });
  it('Proceed to last modal', () => {
    cy.get('#select .selection:first-child .input').type('7');
    cy.get('.input.red').type('4');
    cy.get('button').contains('Pass').click();
  });
  it('Redirects to GSL', () => {
    cy.wait(1000);
    cy.url().should('include', '/gsl');
  });
});
