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
    cy.get(`[role="button"][aria-label="${providerName}"]`).click()
)

Cypress.Commands.add(
  "withPlaylists",
  (providerName) =>
    cy.contains(providerName).parent().nextAll()
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
