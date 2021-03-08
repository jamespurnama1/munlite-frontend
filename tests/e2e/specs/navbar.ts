/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

// const navbarTab = ['Overview', 'Delegates', 'Motions', 'Caucus', 'Crisis'];

// describe('NavBar Test', () => {
//   it('Render all navigation tab', () => {
//     cy.visit('/');

//     for (let i = 0; i < navbarTab.length; i += 1) {
//       cy.contains('a', navbarTab[i]).click();
//       if (navbarTab[i] !== 'Overview') {
//         const toLowerCase = navbarTab[i].toLowerCase();
//         cy.url().should('include', `/${toLowerCase}`);
//       }
//     }
//   });
// });
