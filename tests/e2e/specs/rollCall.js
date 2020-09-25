const getStore = () => cy.window().its('app.$store');

it('has delegates list', () => {
  getStore()
    .its('state')
    .should('have.keys', ['delegates']);
});

describe('Roll Call Modal Test', () => {
  it('Render Modal', () => {
    cy.visit('/rollcall');
    cy.contains('Roll Call').should('be.visible');
    cy.scrollTo(0, 500);
    cy.isInViewport('#rollcall');
  });
  it('Proceed to Vote', () => {
    getStore.delegates.state.forEach(() => {
      cy.contains('Present').click();
    });
  });
  it('Proceed to last modal', () => {
    cy.get('#yesVote').type(getStore.delegates.state.length);
    cy.contains('pass').click();
  });
});
