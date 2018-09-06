describe('Visiting the website and connecting a music provider', () => {
    it('successfully connects providers and make them available in the picker', () => {
        cy.visit("/");
        let providerPickerLength = 1;

        cy.contains('-- Connect provider --')
            .parent().as('providers')
            .children().should('have.length', providerPickerLength);

        cy.get('[role="button"]').contains('Connect').each((b) => {
            const button = cy.wrap(b).parent();

            button.should('contain', 'Connect');
            button.click();

            button.should('contain', 'Disconnect');
            ++providerPickerLength;
        }).then(() => {
            cy.get('@providers').children().should('have.length', providerPickerLength);
        });
    });

    it('displays playlists from a connected provider', () => {
        cy.visit('/')
            .connectProvider('Spotify')
            .get('select')
            .contains('-- Select a provider --')
            .parent()
            .select('Spotify');
        cy.get('main').should('not.contain', 'Select a provider to load your playlists');
        cy.get('main p').as('playlists').should('exist');
        cy.get('@playlists').should('have.length', 4);
    });

    describe('with a selected playlist', () => {
        before(() => {
            cy.visit('/').connectProvider('Spotify').selectPlaylist(1);
        });

        it('displays songs from a clicked playlist', () => {
            cy.withItems('Songs').should('have.length', 8);
        });

        it('shows a placeholder if no other provider is connected', () => {
            cy.contains('-- Connect provider --')
                .parent()
                .children()
                .should('have.length', 1);
        });

        it('disables the search button when no other provider is connected', () => {
            cy.get('[role="button"]').contains('search').should('have.class', 'transparency-128');
        });

        it('takes back to the playlists when clicking the back button', () => {
            cy.contains('<< back').click();
            cy.contains('<< back').should('not.exist');
            cy.withItems("My playlists").should('have.length', 4)
        });

        describe('when connecting another provider', () => {
            before(() => {
                cy.visit('/')
                    .connectProvider('Spotify')
                    .selectPlaylist(1)
                    .connectProvider('Deezer');
            });

            it('adds it to the compare provider lists', () => {
                cy.contains('Import to:')
                    .next().children('select').as('compareSelect')
                    .children()
                    .should('have.length', 2);
                cy.get('@compareSelect').children().last().should('have.text', 'Deezer')
            });

            it('enables the search button when selecting a provider', () => {
                cy.contains('Import to:')
                    .next().children('select').as('compareSelect')
                    .select('Deezer');
                cy.get('[role="button"]').contains('search').should('not.have.class', 'transparency-128');
            });
        });
    });
});