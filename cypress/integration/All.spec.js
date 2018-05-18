describe('Visiting the website and connecting a music provider', () => {
    it('successfully connects providers and make them available in the picker', () => {
        cy.visit("/");
        let providerPickerLength = 1;

        cy.get('#playlist-provider-picker').as('providers').children().should('have.length', providerPickerLength);

        cy.get('.connect-buttons button').each((b) => {
            const button = cy.wrap(b);

            button.should('contain', 'Connect');
            button.click();

            button.should('contain', 'Disconnect');
            ++providerPickerLength;
        }).then(() => {
            cy.get('@providers').children().should('have.length', providerPickerLength);
        });
    });

    it('displays playlists from a connected provider', () => {
        cy.connectProvider('Spotify').get('#playlist-provider-picker').select('Spotify');
        cy.get('main').should('not.contain', 'Select a provider to load your playlists');
        cy.get('main > ul').as('playlists').should('exist');
        cy.get('@playlists').children().should('have.length', 4);
    });

    describe("with a selected playlist", () => {
        before(() => {
            cy.connectProvider('Spotify').selectPlaylist(1);
        });

        it('displays songs from a clicked playlist', () => {
            cy.get('#playlist-songs > li').should('have.length', 8);
        });

        it('shows a placeholder if no other provider is connected', () => {
            cy.get('#playlist-details .provider-compare > select').children().should('have.length', 1);
        });

        it('disables the search button when no other provider is connected', () => {
            cy.get('#playlist-details .provider-compare > button').should('be.disabled');
        });
    });
});