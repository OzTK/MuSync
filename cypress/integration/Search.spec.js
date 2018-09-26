describe('when connecting a second provider', () => {
    before(() => {
        cy.visit('/')
            .connectProvider('Spotify')
            .connectProvider('Deezer')
            .selectProvider('Spotify')
            .selectPlaylist(1)
    })

    const compareSelector = () =>
        cy.contains('Sync with:')
        .next()
        .children('select')
        .as('compareSelect')

    it('adds it to the compare provider lists', () => {
        compareSelector()
            .children()
            .should('have.length', 2)
        cy.get('@compareSelect')
            .children()
            .last()
            .should('have.text', 'Deezer')
    })

    it('enables the search button when selecting a provider', () => {
        compareSelector().select('Deezer')
        cy.get('[role="button"]')
            .contains('search')
            .should('not.have.class', 'transparency-128')
    })

    it('searches the selected provider for matching songs', () => {
        compareSelector().select('Deezer')
        cy.get('[role="button"]')
            .contains('search')
            .click()
        cy.withItems("Songs", '.fa-check').should('have.length', 8)
    })
})