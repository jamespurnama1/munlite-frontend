describe('Roll Call Modal Test', () => {
  it('Render Modal', () => {
    cy.visit('/delegates');
    cy.get('button')
      .contains('Roll Call')
      .click();
    cy.contains('h2', 'Roll Call').should('be.visible');
  });
  it('Roll call and able to scroll then proceed to vote', () => {
    cy.get('button#continue').should('be.disabled').contains('Continue');
    for (let i = 0; i < 10; i += 1) {
      cy.get('button').contains('Present').click();
    }
    cy.get('button').contains('Not Present').click();
    cy.get('.card').contains('NZL').click();
    cy.get('.active .card').should('contain', 'NZL');
    cy.get('.stackOverflow').trigger('mousedown').should('contain', 'USA');
    cy.get('button').contains('Continue').click();
  });
  it('Proceed to last modal', () => {
    cy.wait(5000);
    cy.get('#select .selection:first-child .input').type('7');
    cy.wait(5000);
    cy.get('.input.red').type('4');
    cy.wait(5000);
    cy.get('button').contains('Pass').click();
  });
  it('Redirects to GSL', () => {
    cy.wait(1000);
    cy.url().should('include', '/gsl');
  });
});
