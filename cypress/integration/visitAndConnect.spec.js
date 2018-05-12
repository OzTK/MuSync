describe('Visiting the website and connecting a music provider', () => {
    it('Connects Spotify properly', () => {
        cy.visit('http://localhost:8000');
        cy
            .contains('Connect Spotify')
            .as('connectSpotify')
            .click();

        cy.get('@connectSpotify').should('contain', 'Disconnect Spotify');
        cy.get('#playlist-provider-picker').children().should('have.length', 2);
    });
});