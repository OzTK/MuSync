Cypress.Commands.add("withItems", () => {
  const items = cy.get('main > .el > .column > .row:nth-of-type(2) p');
  items.should('have.length.gt', 1);
  return items;
});

Cypress.Commands.add(
  "connectProvider",
  (providerName) =>
  cy.get('.se-button').contains('Connect').parent().find('img').then((img) => {
    if (img[0].alt !== providerName) {
      return;
    }

    const button = cy.wrap(img).closest('.se-button');
    return button.click().then(() => providerName);
  })
);

Cypress.Commands.add(
  "selectPlaylist", {
    prevSubject: true
  },
  (provider, index) => {
    cy.get('main select').as('prov-picker').select(provider);
    cy.get('@prov-picker').should('have.value', provider);
    cy.withItems().then((items) => items[index].click());
  }
);