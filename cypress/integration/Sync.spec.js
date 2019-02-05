describe('when connecting a second provider', () => {
    before(() => {
        cy.visit('/')
          .connectProvider('Spotify')
          .connectProvider('Deezer')
        cy.contains('Next')
          .click()
          .withPlaylists('Spotify').first().click()
        cy.contains('Next').click()
    })

    it('Picks another provider', () => {
        cy.get('img[alt=Deezer]').click()
        cy.contains('GO!').should('exist')
    })

    it('Transfers the playlist successfully', () => {
        cy.contains('GO!').click()
        cy.contains('Your playlist was transferred successfully!').should('exist')
    })

    it('Goes back to the playlists', () => {
        cy.contains('Back to playlists').click()
        cy.contains('Your playlist was transferred successfully!').should('not.be.visible')
    })
})
