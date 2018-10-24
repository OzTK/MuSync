describe('Visiting the website and connecting music providers', () => {
  it('successfully connects providers and updates the view', () => {
    cy.visit('/')
    let providerPickerLength = 2

    cy.contains('Connect your favorite music providers')
      .parent()
      .next()
      .find('[role="button"]')
      .as('providers')
      .should('have.length', providerPickerLength)

    cy.get('@providers').each((b) => {
      const button = cy.wrap(b)

      button.click().find('img').last().should('have.attr', 'alt', 'Connected')
    })
  })
})