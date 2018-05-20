Cypress.Commands.add(
  "connectProvider",
  (providerName) =>
  cy.get('.connect-buttons button').contains(providerName).click().then(() => {
    return providerName;
  })
);

Cypress.Commands.add(
  "selectPlaylist", {
    prevSubject: true
  },
  (provider, index) => {
    cy.get('#playlist-provider-picker').select(provider);
    cy.get(`main > ul > li:nth-of-type(${index})`).click();
  }
);