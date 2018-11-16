describe('Connecting a music provider and displaying its playlists', () => {
  before(() => {
    cy.visit('/')
      .connectProvider('Deezer')
      .connectProvider('Spotify')
    cy.contains('NEXT').click()
  })

  it('displays playlists from a connected provider', () => {
    cy.contains('Pick a playlist you want to transfer').should('exist')
    cy.contains('Spotify')
      .should('exist')
      .parent()
      .nextAll('div')
      .should('have.length', 4)
  })

  it('selects a playlist when clicking on it', () => {
    cy.contains('Spotify').parent().nextAll('div').as('playlists')

    cy.get('@playlists').first().click()
    cy.contains('Transfer playlist').parent().parent().find('p').should('contain', 'Chouchou')
  })

  it('deselect the playlist when clicking in the overlay', () => {
    cy.get('.fr > .hf').click()
    cy.contains('Transfer playlist').should('not.exist')
  })
})
