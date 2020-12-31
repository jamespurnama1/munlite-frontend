// describe('Landing Page Test', () => {
//   it('Render all components', () => {
//     cy.visit('/overview');

//     cy.get('h1').should('exist');
//     cy.get('div[class="left"]').find('img').should('be.visible');

//     cy.contains('p', 'Rules');
//     cy.contains('p', 'Majority');
//     cy.contains('p', 'DR Votes');
//     cy.contains('p', 'Quorum');
//     cy.contains('p', 'Rounding');

//     cy.contains('p', 'Chair');
//     cy.get('div[class="chair-list"]>div[class="chair-data"]').each(() => {
//       cy.get('div[class="chair-img"]').should('exist');
//       cy.get('p[class="chair-name"]').should('exist');
//       cy.get('p[class="chair-email"]').should('exist');
//     });
//   });
// });
