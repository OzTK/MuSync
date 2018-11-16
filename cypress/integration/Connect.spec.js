describe('Visiting the website and connecting music providers', () => {
  let serviceCount = 2

  before(() => {
    cy.visit('/')
  })

  beforeEach(() => {
    cy.contains('Connect your favorite music providers')
      .parent()
      .next()
      .find('[role="button"]')
      .as('providers')
  })

  it(`has ${serviceCount} services`, () => {
    cy.get('@providers').should('have.length', serviceCount)
  })

  it('successfully connects Deezer if navigating to the page with a token', () => {
    cy.visit('/?service=Deezer#access_token=123456789&token_type=Bearer&expires_in=3600')
    cy.get('@providers')
      .get(`[aria-label="Deezer"]`)
      .find('img')
      .last()
      .should('have.attr', 'alt', 'Connected')
  })

  it('successfully connects Spotify if navigating to the page with a token', () => {
    cy.visit('/?service=Spotify#access_token=123456789&token_type=Bearer&expires_in=3600')
    cy.get('@providers')
      .get(`[aria-label="Spotify"]`)
      .find('img')
      .last()
      .should('have.attr', 'alt', 'Connected')
  })

  it('displays a next button if both providers are connected', () => {
    cy.visit('/?service=Spotify#access_token=123456789&token_type=Bearer&expires_in=3600')
    cy.visit('/?service=Deezer#access_token=987654321&token_type=Bearer&expires_in=3600')
    cy.contains('NEXT').parent().should('have.attr', 'role', 'button')
  })

  it('Clicking the next button goes to the loading screen', () => {
    cy.visit('/?service=Spotify#access_token=123456789&token_type=Bearer&expires_in=3600')
    cy.visit('/?service=Deezer#access_token=987654321&token_type=Bearer&expires_in=3600')
    cy.contains('NEXT').click()
    cy.contains('Pick a playlist you want to transfer').should('exist')
  })
})
