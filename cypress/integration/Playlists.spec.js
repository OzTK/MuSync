describe('Connecting a music provider and displaying its playlists', () => {
  before(() => {
    cy.visit('/#access_token=123456789&token_type=Bearer&expires_in=3600').connectProvider('Deezer')
    cy.contains('Next').click()
  })

  // it('displays playlists from a connected provider', () => {
  //   cy.contains('Pick the playlists you want to transfer').should('exist')
  //   cy.contains('Spotify')
  //     .should('exist')
  //     .parent()
  //     .parent()
  //     .children('label')
  //     .should('have.length', 4)
  // })

  // it('selects playlists when clicking on them', () => {
  //   cy.contains('Spotify').parent().parent().children('label').as('playlists')
  //
  //   cy.get('@playlists').each((p) => {
  //     cy.wrap(p)
  //       .click()
  //       .find('[role="checkbox"]')
  //       .should('contain', '[X]')
  //   })
  // })
})
