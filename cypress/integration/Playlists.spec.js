describe('Connecting a music provider and displaying its playlists', () => {
  before(() => {
    cy.visit('/')
      .connectProvider('Deezer')
      .connectProvider('Spotify')
    cy.contains('Next').click()
  })

  it('displays playlists from a connected provider', () => {
    cy.contains('Playlists')
      .parent()
      .next()
      .get('div[role=button]')
      .should('have.length', 8)
  })

  it('selects a playlist when clicking on it', () => {
    cy.contains('Playlists')
      .parent()
      .next()
      .get('div[role=button]')
      .as('playlists')

    cy.get('@playlists').first().click()
    cy.contains('Transfer playlist').parent().parent().find('p').should('contain', 'Chouchou')
  })

  it('deselect the playlist when clicking in the overlay', () => {
    cy.get('.fr > .hf').click()
    cy.contains('Transfer playlist').should('not.exist')
  })
})
