describe('Landing Page Test', () => {
  it('Render all components', () => {
    cy.visit('/delegates');

    cy.contains('h1', 'Delegates');
    cy.contains('button', 'Role Call');
    cy.contains('button', '+');

    // check modal if button clicked

    cy.get('table[class="table"]>tr[class="data"]').each(() => {
      cy.get('td[class="presence"]').should('exist');
      cy.get('td[class="name"]').should('exist');
      cy.get('img[class="img"]').should('exist');
    });
  });
});
