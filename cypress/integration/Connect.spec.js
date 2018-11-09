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

  it('successfully connects Deezer when clicking', () => {
    cy.get('@providers')
      .get('[aria-label="Deezer"]')
      .click()
      .find('img')
      .last()
      .should('have.attr', 'alt', 'Connected')
  })

  it('successfully connects Spotify if navigating to the page with a token', () => {
    cy.visit('/#access_token=123456789&token_type=Bearer&expires_in=3600')
    cy.get('@providers')
      .get(`[aria-label="Spotify"]`)
      .find('img')
      .last()
      .should('have.attr', 'alt', 'Connected')
  })
})
