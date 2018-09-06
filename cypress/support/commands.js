Cypress.Commands.add("withItems", (title) => {
  console.log(title);
  const items = cy.contains(title).nextAll();
  items.should('have.length.gt', 1);
  return items;
});

Cypress.Commands.add(
  "connectProvider",
  (providerName) =>
  cy.get('[role="button"]').contains('Connect').parent().find('img').then((img) => {
    if (img[0].alt !== providerName) {
      return;
    }

    const button = cy.wrap(img).closest('[role="button"]');
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
    cy.withItems("My playlists").then((items) => items[index].click());
  }
);