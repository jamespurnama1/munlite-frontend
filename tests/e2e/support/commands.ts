// -- This is a parent command --
Cypress.Commands.add('isNotInViewport', (element) => {
  cy.get(element).then(($el) => {
    // @ts-ignore
    const bottom = Cypress.$(cy.state('window')).height() as number;
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
  });
});

Cypress.Commands.add('isInViewport', (element) => {
  cy.get(element).then(($el) => {
    // @ts-ignore
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom as number);
    expect(rect.bottom).not.to.be.greaterThan(bottom as number);
    expect(rect.top).not.to.be.greaterThan(bottom as number);
    expect(rect.bottom).not.to.be.greaterThan(bottom as number);
  });
});

// -- set auth_token --
Cypress.Commands.add('login', () => {
  if (window.location.href) cy.visit('/login');
  cy.window().then((window: any) => {
      cy.request({
        method: 'POST', 
        url: `${Cypress.env('base_api')}/login`,
        body: {
          email: Cypress.env('email'),
          password: Cypress.env('password'),
        }
      })
        .its('body')
        .then((response: any) => {
          window.store.commit('setJWT', response.data.access_token);
        });
  });
});

Cypress.Commands.add('getConfID', () => {
  cy.window().then((window: any) => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('base_api')}/api/conference`,
      headers: {
        Authorization: `Bearer ${window.store.getters.jwt}`,
      },
    })
      .its('body')
      .then((response: any) => {
        return response.data[0]._id;
      });
  });
});
