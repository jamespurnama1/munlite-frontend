/// <reference path="../support/index.d.ts" />

// const navbarTab = ['Overview', 'Delegates', 'Motions', 'Caucus', 'Crisis'];

// describe('NavBar Test', () => {
//   before(() => {
//     cy.login();
//   });

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
