describe('Elemen UI Dinamis - The Internet', () => {
  const base = 'https://the-internet.herokuapp.com'

  it('Dynamic Loading: teks muncul setelah loading', () => {
    cy.visit(`${base}/dynamic_loading/1`)
    cy.get('#start button').click()
    cy.get('#loading').should('be.visible')
    cy.get('#finish', { timeout: 10000 }).should('be.visible').and('contain', 'Hello World!')
  })

  it('Dynamic Controls: hapus checkbox', () => {
    cy.visit(`${base}/dynamic_controls`)
    cy.get('#checkbox-example button').click()
    cy.get('#message', { timeout: 10000 }).should('contain', "It's gone!")
    cy.get('#checkbox').should('not.exist')
  })

  it('Dynamic Controls: enable input', () => {
    cy.visit(`${base}/dynamic_controls`)
    cy.get('#input-example input').should('be.disabled')
    cy.get('#input-example button').click()
    cy.get('#input-example input', { timeout: 10000 }).should('be.enabled').type('Kelompok 13')
  })

  it('Add/Remove Elements', () => {
    cy.visit(`${base}/add_remove_elements/`)
    cy.contains('Add Element').click().click().click()
    cy.get('.added-manually').should('have.length', 3)
    cy.get('.added-manually').first().click()
    cy.get('.added-manually').should('have.length', 2)
  })
})