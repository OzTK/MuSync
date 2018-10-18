describe('when connecting a second provider', () => {
    before(() => {
        cy.visit('/').connectProvider('Spotify')
        cy.contains('Next')
            .click()
            .withPlaylists('Spotify').click({
                multiple: true
            })
        cy.contains('Sync').click()
    })

    it('Runs the sync', () => {
        cy.contains('Syncing your playlists').should('exist')
    })
})