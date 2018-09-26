describe('with a selected playlist', () => {
  before(() => {
    cy.visit('/')
      .connectProvider('Spotify')
      .selectPlaylist(1)
  })

  it('displays songs from a clicked playlist', () => {
    cy.withItems('Songs').should('have.length', 8)
  })

  it('shows a placeholder if no other provider is connected', () => {
    cy.contains('-- Connect provider --')
      .parent()
      .children()
      .should('have.length', 1)
  })

  it('disables the search button when no other provider is connected', () => {
    cy.get('[role="button"]')
      .contains('search')
      .should('have.class', 'transparency-128')
  })

  it('takes back to the playlists when clicking the back button', () => {
    cy.contains('<< back').click()
    cy.contains('<< back').should('not.exist')
    cy.withItems('My playlists').should('have.length', 4)
  })
})