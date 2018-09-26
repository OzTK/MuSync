Cypress.Commands.add("withItems", (title, extraQuery) => {
  let items = cy.contains(title).nextAll()
  if (extraQuery) {
    items = items.find(extraQuery);
  }

  items.should('have.length.gt', 1);
  return items;
});

Cypress.Commands.add(
  "connectProvider",
  (providerName) =>
  cy.get('[role="button"]:contains(Connect)').find('img').then((imgs) => {
    if (imgs[0].alt !== providerName) {
      return;
    }

    const button = cy.wrap(imgs[0]).closest('[role="button"]');
    return button.click().then(() => providerName);
  })
)

Cypress.Commands.add(
  "selectProvider",
  (providerName) =>
  cy.get('[role="button"]:contains(Select)').find('img').then((imgs) => {
    if (imgs[0].alt !== providerName) {
      return;
    }

    const button = cy.wrap(imgs[0]).closest('[role="button"]');
    return button.click().then(() => providerName);
  })
)

Cypress.Commands.add(
  "selectPlaylist", {
    prevSubject: true
  },
  (provider, index) => {
    cy.get(`img[alt="${provider}"]`).parent().parent().contains("Disconnect").should('exist');
    cy.withItems("My playlists").then((items) => items[index].click());
  }
);