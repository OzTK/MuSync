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
        cy.visit('/').connectProvider('Spotify').get('#playlist-provider-picker').select('Spotify');
        cy.get('main').should('not.contain', 'Select a provider to load your playlists');
        cy.get('main > ul').as('playlists').should('exist');
        cy.get('@playlists').children().should('have.length', 4);
    });

    describe('with a selected playlist', () => {
        before(() => {
            cy.visit('/').connectProvider('Spotify').selectPlaylist(1);
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

        it('takes back to the playlists when clicking the back button', () => {
            cy.get('#playlist-details  > .back-to-playlists').as('back').click();
            cy.get('@back').should('not.exist');
            cy.get('main > ul').as('playlists').should('exist');
            cy.get('@playlists').children().should('have.length', 4);
        });

        describe('when connecting another provider', () => {
            before(() => {
                cy.visit('/').connectProvider('Spotify').selectPlaylist(1).connectProvider('Deezer');
            });

            it('adds it to the compare provider lists', () => {
                cy.get('#playlist-details .provider-compare > select').children().should('have.length', 2);
            });

            it('enables the search button when selecting a provider', () => {
                cy.get('#playlist-details .provider-compare > select').select('Deezer');
                cy.get('#playlist-details .provider-compare > button').should('be.enabled');
            });
        });
    });
});