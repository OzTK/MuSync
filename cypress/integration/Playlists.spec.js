describe('Visiting the website and connecting a music provider', () => {
  it('successfully connects providers and make them available in the picker', () => {
    cy.visit('/')
    let providerPickerLength = 2

    cy.get('[role="button"]:contains(Connect)')
      .as('providers')
      .should('have.length', providerPickerLength)

    cy.get('@providers').each((b) => {
      const button = cy.wrap(b)

      button.click()

      button.should('contain', 'Disconnect')
        ++providerPickerLength
    })
  })

  it('displays playlists from a connected provider', () => {
    cy.visit('/').connectProvider('Spotify') // That will select it too
    cy.get('main').should(
      'not.contain',
      'Select a provider to load your playlists'
    )
    cy.get('main p')
      .as('playlists')
      .should('exist')
    cy.get('@playlists').should('have.length', 4)
  })
})