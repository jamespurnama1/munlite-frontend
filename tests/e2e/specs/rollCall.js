// import store from '../../../src/store/index';

// describe('Read Vuex Store', () => {
//   it('has delegates list', () => {
//     expect(store.state.delegates[0].name).to.equal('Australia');
//   });
// });

describe('Roll Call Modal Test', () => {
  it('Render Modal', () => {
    cy.visit('/delegates');
    cy.get('button')
      .contains('Roll Call')
      .click();
    cy.contains('h2', 'Roll Call').should('be.visible');
  });
  it('Roll call and able to undo then proceed to vote', () => {
    cy.get('button#continue').should('be.disabled').contains('Continue');
    for (let i = 0; i < 11; i += 1) {
      cy.get('button').contains('Present').click();
    }
    cy.get('button#undo').click();
    cy.get('button').contains('Not Present').click();
    cy.get('button').contains('Continue').click();
  });
  it('Shows warning Dialogue', () => {
    cy.get('a#close').click();
    cy.get('button').contains('discard').should('be.visible');
    cy.get('button').contains('cancel').should('be.visible').click();
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
